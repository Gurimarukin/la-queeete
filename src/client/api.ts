import { apiRoutes } from '../shared/ApiRouter'
import type { Platform } from '../shared/models/api/Platform'
import { ChampionShardsPayload } from '../shared/models/api/summoner/ChampionShardsPayload'
import { PlatformWithPuuid } from '../shared/models/api/summoner/PlatformWithPuuid'
import type { Puuid } from '../shared/models/api/summoner/Puuid'
import { SummonerMasteriesView } from '../shared/models/api/summoner/SummonerMasteriesView'
import { LoginPasswordPayload } from '../shared/models/api/user/LoginPasswordPayload'
import type { Future } from '../shared/utils/fp'
import { NonEmptyArray } from '../shared/utils/fp'

import { http } from './utils/http'

export const apiSummonerByPuuidGet = (
  platform: Platform,
  puuid: Puuid,
): Future<SummonerMasteriesView> =>
  http(apiRoutes.summoner.byPuuid.get(platform, puuid), {}, [
    SummonerMasteriesView.codec,
    'SummonerMasteriesView',
  ])

export const apiUserRegisterPost = (payload: LoginPasswordPayload): Future<unknown> =>
  http(apiRoutes.user.register.password.post, { json: [LoginPasswordPayload.codec, payload] })

export const apiUserLoginPasswordPost = (payload: LoginPasswordPayload): Future<unknown> =>
  http(apiRoutes.user.login.password.post, { json: [LoginPasswordPayload.codec, payload] })

export const apiUserLogoutPost: Future<unknown> = http(apiRoutes.user.logout.post)

export const apiUserSelfFavoritesPut = (platformWithPuuid: PlatformWithPuuid): Future<unknown> =>
  http(apiRoutes.user.self.favorites.put, { json: [PlatformWithPuuid.codec, platformWithPuuid] })

export const apiUserSelfFavoritesDelete = (platformWithPuuid: PlatformWithPuuid): Future<unknown> =>
  http(apiRoutes.user.self.favorites.delete, { json: [PlatformWithPuuid.codec, platformWithPuuid] })

export const apiUserSelfSummonerChampionsShardsCountPost = (
  platform: Platform,
  summonerName: string,
  championsShards: NonEmptyArray<ChampionShardsPayload>,
): Future<unknown> =>
  http(apiRoutes.user.self.summoner(platform, summonerName).championsShardsCount.post, {
    json: [NonEmptyArray.encoder(ChampionShardsPayload.codec), championsShards],
  })
