/* eslint-disable functional/no-expression-statements,
                  functional/no-return-void */
import { monoid, number, random, string } from 'fp-ts'
import { flow, pipe } from 'fp-ts/function'
import { optional } from 'monocle-ts'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { apiRoutes } from '../../../shared/ApiRouter'
import { ChampionKey } from '../../../shared/models/api/ChampionKey'
import { ChampionLevelOrZero } from '../../../shared/models/api/ChampionLevel'
import type { ChampionMasteryView } from '../../../shared/models/api/ChampionMasteryView'
import type { Platform } from '../../../shared/models/api/Platform'
import type { StaticDataChampion } from '../../../shared/models/api/StaticDataChampion'
import { ChampionShardsView } from '../../../shared/models/api/summoner/ChampionShardsView'
import { SummonerMasteriesView } from '../../../shared/models/api/summoner/SummonerMasteriesView'
import type { SummonerView } from '../../../shared/models/api/summoner/SummonerView'
import { ListUtils } from '../../../shared/utils/ListUtils'
import { Dict, Future, List, Maybe, NonEmptyArray } from '../../../shared/utils/fp'

import { apiUserSelfSummonerChampionShardsCountPut } from '../../api'
import { MainLayout } from '../../components/mainLayout/MainLayout'
import { useHistory } from '../../contexts/HistoryContext'
import { useStaticData } from '../../contexts/StaticDataContext'
import { useUser } from '../../contexts/UserContext'
import { usePrevious } from '../../hooks/usePrevious'
import { useSWRHttp } from '../../hooks/useSWRHttp'
import { useSummonerNameFromLocation } from '../../hooks/useSummonerNameFromLocation'
import { MasteriesQuery } from '../../models/masteriesQuery/MasteriesQuery'
import type { MasteriesQueryView } from '../../models/masteriesQuery/MasteriesQueryView'
import { appRoutes } from '../../router/AppRouter'
import { basicAsyncRenderer } from '../../utils/basicAsyncRenderer'
import { futureRunUnsafe } from '../../utils/futureRunUnsafe'
import type { EnrichedChampionMastery } from './EnrichedChampionMastery'
import { Masteries } from './Masteries'
import type { ShardsToRemoveNotification } from './ShardsToRemoveModal'
import { ShardsToRemoveModal } from './ShardsToRemoveModal'
import type { EnrichedSummonerView } from './Summoner'
import { Summoner } from './Summoner'

type Props = {
  readonly platform: Platform
  readonly summonerName: string
}

export const SummonerMasteries = ({ platform, summonerName }: Props): JSX.Element => {
  const { user } = useUser()

  const { data, error, mutate } = useSWRHttp(
    apiRoutes.summoner.get(platform, clearSummonerName(summonerName)),
    {},
    [SummonerMasteriesView.codec, 'SummonerMasteriesView'],
  )

  // Remove shards on user disconnect
  const previousUser = usePrevious(user)
  useEffect(() => {
    if (data !== undefined && Maybe.isNone(user) && Maybe.isSome(Maybe.flatten(previousUser))) {
      mutate({ ...data, championShards: Maybe.none }, { revalidate: false })
    }
  }, [data, mutate, previousUser, user])

  const setChampionShards = useCallback(
    (champion: ChampionKey) =>
      (count: number): void => {
        if (data === undefined || Maybe.isNone(data.championShards)) return

        mutate(
          pipe(
            SummonerMasteriesView.Lens.championShards,
            optional.modify(
              ListUtils.updateOrAppend(ChampionShardsView.Eq.byChampion)({
                champion,
                count,
                shardsToRemoveFromNotification: Maybe.none,
              }),
            ),
          )(data),
          { revalidate: false },
        )
        pipe(
          apiUserSelfSummonerChampionShardsCountPut(platform, data.summoner.name, champion, count),
          // TODO: sucess toaster
          // Future.map(() => {}),
          Future.orElseW(() => {
            mutate(data, { revalidate: false })
            // TODO: error toaster
            alert('Erreur lors de la modification des fragments')
            return Future.right<void>(undefined)
          }),
          futureRunUnsafe,
        )
      },
    [data, mutate, platform],
  )

  return (
    <MainLayout>
      {basicAsyncRenderer({ data, error })(({ summoner, masteries, championShards }) => (
        <SummonerViewComponent
          platform={platform}
          summoner={summoner}
          masteries={masteries}
          championShards={championShards}
          setChampionShards={setChampionShards}
        />
      ))}
    </MainLayout>
  )
}

const whiteSpaces = /\s+/g
const clearSummonerName = (name: string): string => name.toLowerCase().replaceAll(whiteSpaces, '')

type SummonerViewProps = {
  readonly platform: Platform
  readonly summoner: SummonerView
  readonly masteries: List<ChampionMasteryView>
  readonly championShards: Maybe<List<ChampionShardsView>>
  readonly setChampionShards: (champion: ChampionKey) => (count: number) => void
}

const SummonerViewComponent = ({
  platform,
  summoner,
  masteries,
  championShards,
  setChampionShards,
}: SummonerViewProps): JSX.Element => {
  const { navigate, masteriesQuery } = useHistory()
  const { addRecentSearch } = useUser()
  const staticData = useStaticData()

  useEffect(
    () =>
      addRecentSearch({
        platform,
        name: summoner.name,
        profileIconId: summoner.profileIconId,
      }),
    [addRecentSearch, platform, summoner.name, summoner.profileIconId],
  )

  const summonerNameFromLocation = useSummonerNameFromLocation()
  // Correct case of summoner's name in url
  useEffect(
    () =>
      navigate(
        appRoutes.platformSummonerName(
          platform,
          summoner.name,
          MasteriesQuery.toPartial(masteriesQuery),
        ),
        { replace: true },
      ),
    [summonerNameFromLocation, masteriesQuery, navigate, platform, summoner.name],
  )

  const { enrichedSummoner, enrichedMasteries } = useMemo(
    () => enrichAll(masteries, championShards, masteriesQuery.view, staticData.champions),
    [championShards, masteries, masteriesQuery.view, staticData.champions],
  )

  const [isNotificationsHidden, setIsNotificationsHidden] = useState(false)

  const hideNotifications = useCallback(() => setIsNotificationsHidden(true), [])

  const notifications = useMemo(
    (): Maybe<NonEmptyArray<ShardsToRemoveNotification>> =>
      pipe(
        championShards,
        Maybe.filter(() => !isNotificationsHidden),
        Maybe.map(
          List.filterMap(({ champion, count, shardsToRemoveFromNotification }) =>
            pipe(
              shardsToRemoveFromNotification,
              Maybe.chain(n =>
                pipe(
                  enrichedMasteries,
                  List.findFirst(c => ChampionKey.Eq.equals(c.championId, champion)),
                  Maybe.map(
                    (c): Readonly<ShardsToRemoveNotification> => ({
                      championId: champion,
                      name: c.name,
                      championLevel: c.championLevel,
                      percents: c.percents,
                      chestGranted: c.chestGranted,
                      tokensEarned: c.tokensEarned,
                      shardsCount: count,
                      leveledUpFrom: n.leveledUpFrom,
                      shardsToRemove: n.shardsToRemove,
                    }),
                  ),
                ),
              ),
            ),
          ),
        ),
        Maybe.chain(NonEmptyArray.fromReadonlyArray),
      ),
    [championShards, enrichedMasteries, isNotificationsHidden],
  )

  return (
    <>
      <div className="flex flex-col p-2">
        <Summoner summoner={{ ...summoner, ...enrichedSummoner }} />
        <Masteries masteries={enrichedMasteries} setChampionShards={setChampionShards} />
      </div>
      {pipe(
        notifications,
        Maybe.fold(
          () => null,
          n => <ShardsToRemoveModal notifications={n} hide={hideNotifications} />,
        ),
      )}
    </>
  )
}

type EnrichedAll = {
  readonly enrichedSummoner: Omit<EnrichedSummonerView, keyof SummonerView>
  readonly enrichedMasteries: List<EnrichedChampionMastery>
}

type PartialMasteriesGrouped = Partial<
  Dict<`${ChampionLevelOrZero}`, NonEmptyArray<EnrichedChampionMastery>>
>

const enrichAll = (
  masteries: List<ChampionMasteryView>,
  championShards: Maybe<List<ChampionShardsView>>,
  view: MasteriesQueryView,
  staticDataChampions: List<StaticDataChampion>,
): EnrichedAll => {
  const enrichedMasteries_ = pipe(
    staticDataChampions,
    List.map(({ key, name }): EnrichedChampionMastery => {
      const shardsCount = pipe(
        championShards,
        Maybe.map(
          flow(
            List.findFirst(s => ChampionKey.Eq.equals(s.champion, key)),
            Maybe.fold(
              () => 0,
              s => s.count,
            ),
          ),
        ),
      )

      // TODO: search
      const glow =
        view === 'compact' &&
        List.elem(string.Eq)(name, ['Renekton', 'Twitch', 'Vayne', 'LeBlanc', 'Pyke'])
          ? Maybe.some(random.random())
          : Maybe.none

      return pipe(
        masteries,
        List.findFirst(c => ChampionKey.Eq.equals(c.championId, key)),
        Maybe.fold(
          (): EnrichedChampionMastery => ({
            championId: key,
            championLevel: 0,
            championPoints: 0,
            championPointsSinceLastLevel: 0,
            championPointsUntilNextLevel: 0,
            chestGranted: false,
            tokensEarned: 0,
            name,
            percents: 0,
            shardsCount,
            glow,
          }),
          champion => ({
            ...champion,
            name,
            percents: championPercents(champion),
            shardsCount,
            glow,
          }),
        ),
      )
    }),
  )
  const totalChampionsCount = enrichedMasteries_.length
  const questPercents =
    pipe(
      enrichedMasteries_,
      List.map(c => c.percents),
      monoid.concatAll(number.MonoidSum),
    ) / totalChampionsCount
  const totalMasteryLevel = pipe(
    enrichedMasteries_,
    List.map(c => c.championLevel),
    monoid.concatAll(number.MonoidSum),
  )

  const grouped: PartialMasteriesGrouped = pipe(
    enrichedMasteries_,
    NonEmptyArray.fromReadonlyArray,
    Maybe.map(List.groupBy(c => ChampionLevelOrZero.stringify(c.championLevel))),
    Maybe.getOrElse(() => ({})),
  )
  const masteriesCount = pipe(
    ChampionLevelOrZero.values,
    List.reduce(Dict.empty<`${ChampionLevelOrZero}`, number>(), (acc, key) => {
      const value: number = grouped[key]?.length ?? 0
      return { ...acc, [key]: value }
    }),
  )
  return {
    enrichedSummoner: {
      questPercents,
      // totalChampionsCount,
      totalMasteryLevel,
      masteriesCount,
    },
    enrichedMasteries: enrichedMasteries_,
  }
}

// Mastery 5: 50%
// Mastery 6 tokens: 7% each
// Mastery 7 tokens: 10% each
// Shards (not based on user's favorites): 3% each
const championPercents = (c: ChampionMasteryView): number => {
  if (c.championLevel === 7) return 100

  // 6-0: 67%, 6-1: 77%, 6-2: 87%, 6-3: 97%
  if (c.championLevel === 6) return 67 + c.tokensEarned * 10

  // 5-0: 50%, 5-1: 57%, 5-2: 64%
  if (c.championLevel === 5) return 50 + c.tokensEarned * 7

  return (c.championPoints / 21600) * 50
}
