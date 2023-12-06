/* eslint-disable functional/no-expression-statements */
import type { Match, Parser } from 'fp-ts-routing'
import { Route, format, parse, zero } from 'fp-ts-routing'
import { pipe } from 'fp-ts/function'
import { useEffect, useMemo } from 'react'

import type { Platform, PlatformLower } from '../../shared/models/api/Platform'
import { RiotId } from '../../shared/models/riot/RiotId'
import type { Override } from '../../shared/models/typeFest'
import { StringUtils } from '../../shared/utils/StringUtils'
import { Maybe, Tuple } from '../../shared/utils/fp'

import { Navigate } from '../components/Navigate'
import { useHistory } from '../contexts/HistoryContext'
import { Factions } from '../domain/Factions'
import { Home } from '../domain/Home'
import { Login } from '../domain/Login'
import { NotFound } from '../domain/NotFound'
import { Register } from '../domain/Register'
import {
  SummonerByNameGame,
  SummonerByNameProfile,
  SummonerByPuuidGame,
  SummonerByPuuidProfile,
} from '../domain/SummonerBy'
import { ActiveGame } from '../domain/activeGame/ActiveGame'
import { Aram } from '../domain/aram/Aram'
import { DiscordRedirect } from '../domain/discordRedirect/DiscordRedirect'
import { SummonerMasteries } from '../domain/summonerMasteries/SummonerMasteries'
import { appMatches, appParsers } from './AppRouter'

type ElementWithTitle = Tuple<React.ReactElement, Maybe<string>>

const titleWithElementParser = zero<ElementWithTitle>()
  .alt(appParsers.index.map(() => t(<Home />)))
  .alt(
    withPlatformLower(appMatches.sPlatformPuuid, ({ platform, puuid }) =>
      t(<SummonerByPuuidProfile platform={platform} puuid={puuid} />),
    ),
  )
  .alt(
    withPlatformLower(appMatches.sPlatformPuuidGame, ({ platform, puuid }) =>
      t(<SummonerByPuuidGame platform={platform} puuid={puuid} />),
    ),
  )
  .alt(
    withPlatformLower(appMatches.platformRiotId, ({ platform, riotId }) =>
      t(
        <SummonerMasteries platform={platform} riotId={riotId} />,
        `${RiotId.stringify(riotId)} (${platform})`,
      ),
    ),
  )
  .alt(
    withPlatformLower(appMatches.platformRiotIdGame, ({ platform, riotId }) =>
      t(
        <ActiveGame platform={platform} riotId={riotId} />,
        `${RiotId.stringify(riotId)} (${platform}) | partie)`,
      ),
    ),
  )
  .alt(
    withPlatformLower(appMatches.platformSummonerName, ({ platform, summonerName }) =>
      t(<SummonerByNameProfile platform={platform} name={summonerName} />),
    ),
  )
  .alt(
    withPlatformLower(appMatches.platformSummonerNameGame, ({ platform, summonerName }) =>
      t(<SummonerByNameGame platform={platform} name={summonerName} />),
    ),
  )
  .alt(appParsers.aram.map(() => t(<Aram />, 'ARAM')))
  .alt(appParsers.factions.map(() => t(<Factions />, 'Factions')))
  .alt(appParsers.login.map(() => t(<Login />, 'Connexion')))
  .alt(appParsers.register.map(() => t(<Register />, 'Inscription')))
  .alt(appParsers.discordRedirect.map(() => t(<DiscordRedirect />)))

export const AppRouterComponent: React.FC = () => {
  const { location } = useHistory()

  const [node, title] = useMemo(() => {
    const [node_, subTitle] = parse(
      titleWithElementParser,
      Route.parse(location.pathname),
      t(<NotFound />, 'Page non trouvée'),
    )
    const title_ = `La Quête${pipe(
      subTitle,
      Maybe.fold(
        () => '',
        s => ` | ${s}`,
      ),
    )}`
    return [node_, title_]
  }, [location.pathname])

  useEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    document.title = title
  }, [title])

  return node
}

const t = (element: React.ReactElement, title?: string): ElementWithTitle =>
  Tuple.of(element, Maybe.fromNullable(title))

type Platformable = {
  platform: Platform | PlatformLower
}

type UppercasePlatform<A extends Platformable> = Override<A, 'platform', Uppercase<A['platform']>>

// Redirect if upper case
function withPlatformLower<A extends Platformable>(
  match: Match<A>,
  f: (a: UppercasePlatform<A>) => ElementWithTitle,
): Parser<ElementWithTitle> {
  return match.parser.map(a => {
    const upperCase = StringUtils.toUpperCase<A['platform']>(a.platform)
    const isUppercase = upperCase === a.platform

    return isUppercase
      ? t(
          <Navigate
            to={format(match.formatter, { ...a, platform: a.platform.toLowerCase() })}
            replace={true}
          />,
        )
      : f({ ...a, platform: upperCase })
  })
}
