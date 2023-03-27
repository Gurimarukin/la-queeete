import type { Match, Parser } from 'fp-ts-routing'
import { end, format, lit, str } from 'fp-ts-routing'

import type { Method } from './models/Method'
import { Lang } from './models/api/Lang'
import { Platform } from './models/api/Platform'
import { RouterUtils } from './utils/RouterUtils'
import type { Dict, Tuple } from './utils/fp'

const { codec } = RouterUtils

/**
 * matches
 */

// intermediate
const api = lit('api')
const healthcheck = api.then(lit('healthcheck'))
const staticDataLang = api.then(lit('staticData')).then(codec('lang', Lang.codec))
const summoner = api
  .then(lit('summoner'))
  .then(codec('platform', Platform.codec))
  .then(str('summonerName'))
const user = api.then(lit('user'))
const userSelf = user.then(lit('self'))
const userSelfFavorites = userSelf.then(lit('favorites'))
const userSelfSummonerChampionsShardsCount = userSelf
  .then(lit('summoner'))
  .then(codec('platform', Platform.codec))
  .then(str('summonerName'))
  .then(lit('championsShardsCount'))
const userLogin = user.then(lit('login'))
const userLoginDiscord = userLogin.then(lit('discord'))
const userLoginPassword = userLogin.then(lit('password'))
const userLogout = user.then(lit('logout'))
const userRegister = user.then(lit('register'))
const userRegisterDiscord = userRegister.then(lit('discord'))
const userRegisterPassword = userRegister.then(lit('password'))
const madosayentisuto = api.then(lit('madosayentisuto'))
const madosayentisutoStaticData = madosayentisuto.then(lit('staticData'))
const madosayentisutoUsersGetProgression = madosayentisuto
  .then(lit('users'))
  .then(lit('getProgression'))

// final
const healthcheckGet = m(healthcheck, 'get')
const staticDataLangGet = m(staticDataLang, 'get')
const summonerGet = m(summoner, 'get')
const userSelfGet = m(userSelf, 'get')
const userSelfFavoritesPut = m(userSelfFavorites, 'put')
const userSelfFavoritesDelete = m(userSelfFavorites, 'delete')
const userSelfSummonerChampionsShardsCountPost = m(userSelfSummonerChampionsShardsCount, 'post')
const userLoginDiscordPost = m(userLoginDiscord, 'post')
const userLoginPasswordPost = m(userLoginPassword, 'post')
const userLogoutPost = m(userLogout, 'post')
const userRegisterDiscordPost = m(userRegisterDiscord, 'post')
const userRegisterPasswordPost = m(userRegisterPassword, 'post')
const madosayentisutoStaticDataGet = m(madosayentisutoStaticData, 'get')
const madosayentisutoUsersGetProgressionPost = m(madosayentisutoUsersGetProgression, 'post')

/**
 * parsers
 */

export const apiParsers = {
  healthcheck: { get: p(healthcheckGet) },
  staticData: { lang: { get: p(staticDataLangGet) } },
  summoner: { get: p(summonerGet) },
  user: {
    self: {
      get: p(userSelfGet),
      favorites: {
        put: p(userSelfFavoritesPut),
        delete: p(userSelfFavoritesDelete),
      },
      summoner: {
        championsShardsCount: { post: p(userSelfSummonerChampionsShardsCountPost) },
      },
    },
    login: {
      discord: { post: p(userLoginDiscordPost) },
      password: { post: p(userLoginPasswordPost) },
    },
    logout: { post: p(userLogoutPost) },
    register: {
      discord: { post: p(userRegisterDiscordPost) },
      password: { post: p(userRegisterPasswordPost) },
    },
  },
  madosayentisuto: {
    staticData: { get: p(madosayentisutoStaticDataGet) },
    users: {
      getProgression: { post: p(madosayentisutoUsersGetProgressionPost) },
    },
  },
}

/**
 * formats
 */

export const apiRoutes = {
  staticData: { lang: { get: (lang: Lang) => r(staticDataLangGet, { lang }) } },
  summoner: {
    get: (platform: Platform, summonerName: string) => r(summonerGet, { platform, summonerName }),
  },
  user: {
    self: {
      get: r(userSelfGet, {}),
      favorites: {
        put: r(userSelfFavoritesPut, {}),
        delete: r(userSelfFavoritesDelete, {}),
      },
      summoner: (platform: Platform, summonerName: string) => ({
        championsShardsCount: {
          post: r(userSelfSummonerChampionsShardsCountPost, { platform, summonerName }),
        },
      }),
    },
    login: {
      discord: { post: r(userLoginDiscordPost, {}) },
      password: { post: r(userLoginPasswordPost, {}) },
    },
    logout: { post: r(userLogoutPost, {}) },
    register: {
      discord: { post: r(userRegisterDiscordPost, {}) },
      password: { post: r(userRegisterPasswordPost, {}) },
    },
  },
}

/**
 * Helpers
 */

type WithMethod<A> = Tuple<A, Method>
type MatchWithMethod<A> = WithMethod<Match<A>>
export type ParserWithMethod<A> = WithMethod<Parser<A>>
export type RouteWithMethod = WithMethod<string>

// Match with Method
function m<A extends Dict<string, unknown>>(match: Match<A>, method: Method): MatchWithMethod<A> {
  return [match.then(end), method]
}

// Parser with Method
function p<A>([match, method]: MatchWithMethod<A>): ParserWithMethod<A> {
  return [match.parser, method]
}

// Route with Method
function r<A>([match, method]: MatchWithMethod<A>, a: A): RouteWithMethod {
  return [format(match.formatter, a), method]
}
