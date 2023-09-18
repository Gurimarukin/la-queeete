import { pipe } from 'fp-ts/function'
import * as D from 'io-ts/Decoder'
import { lens } from 'monocle-ts'

import { MsDuration } from '../../shared/models/MsDuration'
import { ValidatedNea } from '../../shared/models/ValidatedNea'
import { DiscordUserId } from '../../shared/models/discord/DiscordUserId'
import { LogLevelOrOff } from '../../shared/models/logger/LogLevel'
import { loadDotEnv } from '../../shared/utils/config/loadDotEnv'
import { parseConfig } from '../../shared/utils/config/parseConfig'
import type { List, NonEmptyArray, PartialDict, Try } from '../../shared/utils/fp'
import { Either, IO, Maybe } from '../../shared/utils/fp'
import {
  ArrayFromString,
  BooleanFromString,
  NonEmptyArrayFromString,
  NumberFromString,
  URLFromString,
} from '../../shared/utils/ioTsUtils'

import { ClientSecret } from '../models/discord/ClientSecret'

const seqS = ValidatedNea.getSeqS<string>()

export type Config = {
  isDev: boolean
  mock: boolean
  logLevel: LogLevelOrOff
  client: ClientConfig
  http: HttpConfig
  db: DbConfig
  riotApi: RiotApiConfig
  porofessorApiCacheTtlActiveGame: MsDuration
  jwtSecret: string
  madosayentisuto: MadosayentisutoConfig
}

export type ClientConfig = {
  id: DiscordUserId
  secret: ClientSecret
  redirectUri: string
}

export type HttpConfig = {
  port: number
  allowedOrigins: Maybe<NonEmptyArray<URL>>
}

type DbConfig = {
  host: string
  dbName: string
  user: string
  password: string
}

type RiotApiConfig = {
  keys: RiotApiKeysConfig
  cacheTtl: RiotApiCacheTtlConfig
}

export type RiotApiKeysConfig = {
  lol: string
  account: string // You need a legends of runeterra or valorant app for account-v1
}

export type RiotApiCacheTtlConfig = {
  ddragonLatestVersion: MsDuration
  activeGame: MsDuration
  activeGameLoading: MsDuration // If the game is loading, cache it less longer
  challenges: MsDuration
  leagueEntries: MsDuration
  masteries: MsDuration
  summoner: MsDuration
  account: MsDuration
}

export type MadosayentisutoConfig = {
  whitelistedIps: List<string>
  token: string
}

const parse = (dict: PartialDict<string, string>): Try<Config> =>
  parseConfig(dict)(r => {
    const infiniteCache = pipe(
      r(Maybe.decoder(BooleanFromString.decoder))('INFINITE_CACHE'),
      Either.map(Maybe.getOrElse(() => false)),
    )
    return seqS<Config>({
      isDev: pipe(
        r(Maybe.decoder(BooleanFromString.decoder))('IS_DEV'),
        Either.map(Maybe.getOrElse(() => false)),
      ),
      mock: pipe(
        r(Maybe.decoder(BooleanFromString.decoder))('MOCK'),
        Either.map(Maybe.getOrElse(() => false)),
      ),
      logLevel: r(LogLevelOrOff.codec)('LOG_LEVEL'),
      client: seqS<ClientConfig>({
        id: r(DiscordUserId.codec)('CLIENT_ID'),
        secret: r(ClientSecret.codec)('CLIENT_SECRET'),
        redirectUri: r(D.string)('REDIRECT_URI'),
      }),
      http: seqS<HttpConfig>({
        port: r(NumberFromString.decoder)('HTTP_PORT'),
        allowedOrigins: r(Maybe.decoder(NonEmptyArrayFromString.decoder(URLFromString.decoder)))(
          'HTTP_ALLOWED_ORIGINS',
        ),
      }),
      db: seqS<DbConfig>({
        host: r(D.string)('DB_HOST'),
        dbName: r(D.string)('DB_NAME'),
        user: r(D.string)('DB_USER'),
        password: r(D.string)('DB_PASSWORD'),
      }),
      riotApi: seqS<RiotApiConfig>({
        keys: seqS<RiotApiKeysConfig>({
          lol: r(D.string)('RIOT_API_KEYS_LOL'),
          account: r(D.string)('RIOT_API_KEYS_ACCOUNT'),
        }),
        cacheTtl: pipe(infiniteCache, Either.map(riotApiCacheTtl)),
      }),
      porofessorApiCacheTtlActiveGame: pipe(
        infiniteCache,
        Either.map(i => (i ? infinity : MsDuration.hour(1))),
      ),
      jwtSecret: r(D.string)('JWT_SECRET'),
      madosayentisuto: seqS<MadosayentisutoConfig>({
        whitelistedIps: r(ArrayFromString.decoder(D.string))('MADOSAYENTISUTO_WHITELISTED_IPS'),
        token: r(D.string)('MADOSAYENTISUTO_TOKEN'),
      }),
    })
  })

const infinity = MsDuration.days(99 * 365)

const riotApiCacheTtl = (infiniteCache: boolean): RiotApiCacheTtlConfig => ({
  ddragonLatestVersion: infiniteCache ? infinity : MsDuration.hour(1),

  activeGame: infiniteCache ? infinity : MsDuration.minutes(3),
  activeGameLoading: infiniteCache ? infinity : MsDuration.seconds(5),
  challenges: infiniteCache ? infinity : MsDuration.seconds(3),
  leagueEntries: infiniteCache ? infinity : MsDuration.minutes(3),
  masteries: infiniteCache ? infinity : MsDuration.minutes(3),
  summoner: infiniteCache ? infinity : MsDuration.minutes(9),

  account: infinity,
})

const load: IO<Config> = pipe(loadDotEnv, IO.map(parse), IO.chain(IO.fromEither))

const Lens = {
  logLevel: pipe(lens.id<Config>(), lens.prop('logLevel')),
}

export const Config = { load, Lens }
