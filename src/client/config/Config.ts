import { pipe } from 'fp-ts/function'
import * as D from 'io-ts/Decoder'

import { ValidatedNea } from '../../shared/models/ValidatedNea'
import { DiscordUserId } from '../../shared/models/discord/DiscordUserId'
import { parseConfig } from '../../shared/utils/config/parseConfig'
import type { PartialDict, Try } from '../../shared/utils/fp'
import { Either, Maybe } from '../../shared/utils/fp'
import { BooleanFromString, URLFromString } from '../../shared/utils/ioTsUtils'

const seqS = ValidatedNea.getSeqS<string>()

export type Config = {
  isDev: boolean
  apiHost: URL
  clientId: DiscordUserId
  redirectUri: string
  poroApiBaseUrl: string
}

const parse = (rawConfig: PartialDict<string, string>): Try<Config> =>
  parseConfig(rawConfig)(r =>
    seqS<Config>({
      isDev: pipe(
        r(Maybe.decoder(BooleanFromString.decoder))('IS_DEV'),
        Either.map(Maybe.getOrElseW(() => false)),
      ),
      apiHost: r(URLFromString.decoder)('API_HOST'),
      clientId: r(DiscordUserId.codec)('CLIENT_ID'),
      redirectUri: r(D.string)('REDIRECT_URI'),
      poroApiBaseUrl: r(D.string)('PORO_BASE_URL'),
    }),
  )

export const Config = { parse }
