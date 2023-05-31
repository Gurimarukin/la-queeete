import { pipe } from 'fp-ts/function'
import { useRef } from 'react'

import type { BannedChampion } from '../../../shared/models/api/activeGame/BannedChampion'
import { TeamId } from '../../../shared/models/api/activeGame/TeamId'
import { ChampionKey } from '../../../shared/models/api/champion/ChampionKey'
import type { PartialDict, Tuple } from '../../../shared/utils/fp'
import { List, NonEmptyArray } from '../../../shared/utils/fp'

import { CroppedChampionSquare } from '../../components/CroppedChampionSquare'
import { Tooltip } from '../../components/tooltip/Tooltip'
import { useStaticData } from '../../contexts/StaticDataContext'
import { cx } from '../../utils/cx'

type Props = {
  bans: PartialDict<`${TeamId}`, List<Tuple<string, NonEmptyArray<BannedChampion>>>>
}

export const ActiveGameBans: React.FC<Props> = ({ bans }) => (
  <div className="flex flex-wrap justify-between gap-6 px-3">
    {TeamId.values.map((teamId, i) => {
      const teamBans = bans[teamId]
      const reverse = i % 2 === 1
      return (
        <ul key={teamId} className={cx('flex flex-wrap gap-6', ['flex-row-reverse', reverse])}>
          {teamBans !== undefined
            ? pipe(
                teamBans,
                List.map(([pickTurn, turnBans]) => (
                  <ul
                    key={pickTurn}
                    className={cx('flex flex-wrap gap-1', ['flex-row-reverse', reverse])}
                  >
                    {pipe(
                      turnBans,
                      NonEmptyArray.map(({ pickTurn: turn, championId }) => (
                        <Ban
                          key={ChampionKey.unwrap(championId)}
                          pickTurn={turn}
                          championId={championId}
                        />
                      )),
                    )}
                  </ul>
                )),
              )
            : null}
        </ul>
      )
    })}
  </div>
)

type BanProps = {
  pickTurn: number
  championId: ChampionKey
}

const Ban: React.FC<BanProps> = ({ pickTurn, championId }) => {
  const { champions } = useStaticData()
  const champion = champions.find(c => ChampionKey.Eq.equals(c.key, championId))

  const ref = useRef<HTMLLIElement>(null)

  return (
    <>
      <CroppedChampionSquare
        ref={ref}
        championKey={championId}
        championName={champion?.name ?? `<Champion ${championId}>`}
        as="li"
        title={`${pickTurn}`}
        className="relative h-10 w-10"
      >
        <span className="absolute top-[calc(100%_-_2px)] w-20 origin-left -rotate-45 border-t-4 border-red-ban shadow-even shadow-black" />
      </CroppedChampionSquare>
      {champion !== undefined ? <Tooltip hoverRef={ref}>{champion.name}</Tooltip> : null}
    </>
  )
}
