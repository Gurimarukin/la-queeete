/* eslint-disable functional/no-expression-statements,
                  functional/no-return-void */
import { eq, readonlyMap } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import type { OptionProps, SingleValue, SingleValueProps } from 'react-select'
import Select from 'react-select'

import { apiRoutes } from '../../../shared/ApiRouter'
import { Platform } from '../../../shared/models/api/Platform'
import type { DiscordUserView } from '../../../shared/models/api/madosayentisuto/DiscordUserView'
import { MadosayentisutoInfos } from '../../../shared/models/api/madosayentisuto/MadosayentisutoInfos'
import type { SummonerShort } from '../../../shared/models/api/summoner/SummonerShort'
import { DiscordUserId } from '../../../shared/models/discord/DiscordUserId'
import { GameName } from '../../../shared/models/riot/GameName'
import { RiotId } from '../../../shared/models/riot/RiotId'
import { TagLine } from '../../../shared/models/riot/TagLine'
import { MapUtils } from '../../../shared/utils/MapUtils'
import { Either, Future, List, Maybe, Tuple, getTrivialOrd } from '../../../shared/utils/fp'

import { apiSummonerGet } from '../../api'
import { AsyncRenderer } from '../../components/AsyncRenderer'
import { Loading } from '../../components/Loading'
import { Pre } from '../../components/Pre'
import { MainLayout } from '../../components/mainLayout/MainLayout'
import { useStaticData } from '../../contexts/StaticDataContext'
import { useSWRHttp } from '../../hooks/useSWRHttp'
import { CheckMarkSharp, CloseFilled } from '../../imgs/svgs/icons'
import { cx } from '../../utils/cx'
import { futureRunUnsafe } from '../../utils/futureRunUnsafe'

export const AdminMadosayentisuto: React.FC = () => (
  <MainLayout>
    <AsyncRenderer
      {...useSWRHttp(apiRoutes.admin.madosayentisuto.get, { timeout: 60000 }, [
        MadosayentisutoInfos.codec,
        'MadosayentisutoInfos',
      ])}
    >
      {infos => <Loaded infos={infos} />}
    </AsyncRenderer>
  </MainLayout>
)

type LoadedProps = {
  infos: MadosayentisutoInfos
}

const Loaded: React.FC<LoadedProps> = ({ infos }) => {
  const [members, setMembers] = useState<
    ReadonlyMap<PartialDiscordUser, SummonerShort | undefined>
  >(() => toPartial(infos.hallOfFameMembers))

  const setSummonerAt = (id: DiscordUserId) => (summoner: SummonerShort | undefined) =>
    setMembers(prev =>
      pipe(
        prev,
        readonlyMap.updateAt(byIdEq)({ id }, summoner),
        Maybe.getOrElse(() => prev),
      ),
    )

  const remove = (id: DiscordUserId) => () => setMembers(readonlyMap.deleteAt(byIdEq)({ id }))

  const addPending = useCallback(
    (user: DiscordUserView) =>
      setMembers(readonlyMap.upsertAt(byIdEq)<SummonerShort | undefined>(user, undefined)),
    [],
  )

  return (
    <div className="flex min-h-full items-center justify-center py-4 text-white">
      <table>
        <tbody>
          {pipe(
            members,
            readonlyMap.toReadonlyArray(getTrivialOrd(byIdEq)),
            List.map(([user, summoner]) => (
              <Member
                key={DiscordUserId.unwrap(user.id)}
                user={user}
                summoner={summoner}
                setSummoner={setSummonerAt(user.id)}
                remove={remove(user.id)}
              />
            )),
          )}
          <Pending
            guildMembers={pipe(
              infos.guildMembers,
              List.differenceW(byIdEq)(pipe(members, readonlyMap.keys(getTrivialOrd(byIdEq)))),
            )}
            addPending={addPending}
          />
        </tbody>
      </table>
    </div>
  )
}

const Tr: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>
> = props => <tr {...props} className={cx('odd:bg-zinc-900 even:bg-zinc-700', props.className)} />

const Td: React.FC<
  React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>
> = props => <td {...props} className={cx('px-10 py-2 first:pl-2 last:pr-2', props.className)} />

type PartialDiscordUser = DiscordUserView | { id: DiscordUserId }

const byIdEq: eq.Eq<PartialDiscordUser> = eq.struct({ id: DiscordUserId.Eq })

function toPartial(
  members: ReadonlyMap<DiscordUserId, SummonerShort>,
): ReadonlyMap<PartialDiscordUser, SummonerShort | undefined> {
  return pipe(
    members,
    readonlyMap.toReadonlyArray(getTrivialOrd(DiscordUserId.Eq)),
    List.map(Tuple.map(id => ({ id }))),
    MapUtils.fromReadonlyArray(byIdEq),
  )
}

function isDefined(u: PartialDiscordUser): u is DiscordUserView {
  return ((u as DiscordUserView).username as string | undefined) !== undefined
}

type MemberProps = {
  user: PartialDiscordUser
  summoner: SummonerShort | undefined
  setSummoner: (summoner: SummonerShort | undefined) => void
  remove: () => void
}

const Member: React.FC<MemberProps> = ({ user, summoner, setSummoner, remove }) => (
  <Tr>
    <Td>
      <div className="flex h-full items-center">
        <button type="button" onClick={remove}>
          <CloseFilled className="h-6 w-6 text-red" />
        </button>
      </div>
    </Td>
    <Td>
      {isDefined(user) ? <DiscordUser user={user} /> : <Pre>{DiscordUserId.unwrap(user.id)}</Pre>}
    </Td>
    <Td>
      <SummonerSelect summoner={summoner} setSummoner={setSummoner} />
    </Td>
  </Tr>
)

type PendingProps = {
  guildMembers: List<DiscordUserView>
  addPending: (user: DiscordUserView) => void
}

const Pending: React.FC<PendingProps> = ({ guildMembers, addPending }) => {
  const [value, setValue] = useState<DiscordUserView | null>(null)

  const handleSelectChange = useCallback(
    (newValue: SingleValue<DiscordUserView>) => {
      setValue(newValue)

      if (newValue !== null) {
        addPending(newValue)
      }
    },
    [addPending],
  )

  useEffect(() => {
    if (value !== null) {
      setValue(null)
    }
  }, [value])

  return (
    <Tr>
      <Td />
      <Td>
        <Select<DiscordUserView, false>
          options={guildMembers}
          getOptionValue={getOptionValueUser}
          getOptionLabel={getOptionLabelUser}
          value={value}
          onChange={handleSelectChange}
          components={{
            SingleValue: UserSingleValue,
            Option: UserOption,
          }}
          className="min-w-[320px] text-black"
        />
      </Td>
      <Td />
    </Tr>
  )
}

function getOptionValueUser(u: DiscordUserView): string {
  return DiscordUserId.unwrap(u.id)
}

function getOptionLabelUser(u: DiscordUserView): string {
  return u.username
}

const UserSingleValue: React.FC<SingleValueProps<DiscordUserView, false>> = props => {
  const { data, innerProps } = props

  const { padding, gridArea } = props.getStyles('singleValue', props)

  return (
    <DiscordUser {...innerProps} user={data} style={{ padding, gridArea } as React.CSSProperties} />
  )
}

const UserOption: React.FC<OptionProps<DiscordUserView, false>> = props => {
  const { data, innerProps } = props

  const { padding, color, backgroundColor } = props.getStyles('option', props)

  return (
    <DiscordUser
      {...innerProps}
      user={data}
      style={{ padding, color, backgroundColor } as React.CSSProperties}
    />
  )
}

type DiscordUserProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  user: DiscordUserView
}

const DiscordUser: React.FC<DiscordUserProps> = ({ user, className, ...props }) => (
  <div {...props} className={cx('flex cursor-pointer items-center gap-2', className)}>
    {pipe(
      user.avatar,
      Maybe.fold(
        () => null,
        avatar => (
          <img
            src={`https://cdn.discordapp.com/avatars/${user.id}/${avatar}.png?size=64`}
            className="h-8 w-8"
          />
        ),
      ),
    )}
    <span>
      {pipe(
        user.global_name,
        Maybe.foldW(
          () => <span className="font-lib-mono">{user.username}</span>,
          n => `@${n}`,
        ),
      )}
    </span>
  </div>
)

type SummonerSelectProps = {
  summoner: SummonerShort | undefined
  setSummoner: (summoner: SummonerShort | undefined) => void
}

const SummonerSelect: React.FC<SummonerSelectProps> = ({ summoner, setSummoner }) => {
  const handleClick = useCallback(() => setSummoner(undefined), [setSummoner])

  return summoner === undefined ? (
    <SummonerSelectInput onFoundSummoner={setSummoner} />
  ) : (
    <div className="flex items-center gap-2">
      <SummonerComponent summoner={summoner} className="grow" />
      <Button type="button" onClick={handleClick}>
        edit
      </Button>
    </div>
  )
}

type SummonerSelectInputProps = {
  onFoundSummoner: (summoner: SummonerShort) => void
}

const SummonerSelectInput: React.FC<SummonerSelectInputProps> = ({ onFoundSummoner }) => {
  const [platform, setPlatform] = useState<Platform>(Platform.defaultPlatform)

  const handleSelectChange = useCallback((v: SingleValue<{ value: Platform }>) => {
    if (v !== null) {
      setPlatform(v.value)
    }
  }, [])

  const [rawRiotId, setRawRiotId] = useState('')

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRawRiotId(e.target.value)
    setError(undefined)
  }, [])

  const [error, setError] = useState<string | undefined>(undefined)

  const [isLoading, setIsLoading] = useState(false)

  const riotId = RiotId.fromStringDecoder.decode(rawRiotId)

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (Either.isRight(riotId)) {
        setIsLoading(true)
        pipe(
          apiSummonerGet(platform, riotId.right),
          Future.map(Maybe.fold(() => setError('not found'), onFoundSummoner)),
          Future.orElseW(() => {
            setError('error.')
            return Future.notUsed
          }),
          Future.chainFirstIOK(() => () => setIsLoading(false)),
          futureRunUnsafe,
        )
      }
    },
    [onFoundSummoner, platform, riotId],
  )

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Select<{ value: Platform }, false>
        options={platformOptions}
        value={{ value: platform }}
        getOptionLabel={getOptionLabelPlatform}
        onChange={handleSelectChange}
        isDisabled={isLoading}
        className="text-black"
      />
      <input
        type="text"
        value={rawRiotId}
        onChange={handleInputChange}
        disabled={isLoading}
        className="text-black"
      />
      {isLoading ? (
        <Loading />
      ) : (
        <Button type="submit" disabled={Either.isLeft(riotId)}>
          <CheckMarkSharp className="h-4" />
        </Button>
      )}
      {error !== undefined ? <div>{error}</div> : null}
    </form>
  )
}

const platformOptions = Platform.values.map(value => ({ value }))

function getOptionLabelPlatform({ value }: { value: Platform }): string {
  return value
}

type SummonerComponentProp = {
  summoner: SummonerShort
  className?: string
}

const SummonerComponent: React.FC<SummonerComponentProp> = ({
  summoner: {
    platform,
    riotId: { gameName, tagLine },
    profileIconId,
  },
  className,
}) => {
  const { assets } = useStaticData()
  return (
    <div className={cx('flex items-center gap-2', className)}>
      <img src={assets.summonerIcon(profileIconId)} className="h-8 w-8" />
      <div>
        <span className="text-goldenrod">{GameName.unwrap(gameName)}</span>
        <span className="text-grey-500">#{TagLine.unwrap(tagLine)}</span>
      </div>
      <span className="text-white">{platform}</span>
    </div>
  )
}

const Button: React.FC<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = ({ className, ...props }) => (
  // eslint-disable-next-line react/button-has-type
  <button
    {...props}
    className={cx(
      'border-2 bg-mastery-7-bis px-1.5 pb-[3px] pt-0.5 text-white active:border-dashed',
      className,
    )}
  />
)
