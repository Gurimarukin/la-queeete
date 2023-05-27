import * as C from 'io-ts/Codec'

import { Maybe } from '../../../utils/fp'
import { ChampionKey } from '../champion/ChampionKey'
import { PerksView } from '../perk/PerksView'
import { SummonerLeaguesView } from '../summoner/SummonerLeaguesView'
import { SummonerSpellKey } from '../summonerSpell/SummonerSpellKey'
import { ActiveGameMasteriesView } from './ActiveGameMasteriesView'
import { TeamId } from './TeamId'

type ActiveGameParticipantView = C.TypeOf<typeof codec>

const codec = C.struct({
  teamId: TeamId.codec,
  summonerName: C.string,
  profileIconId: C.number,
  leagues: Maybe.codec(SummonerLeaguesView.codec),
  championId: ChampionKey.codec,
  masteries: Maybe.codec(ActiveGameMasteriesView.codec),
  shardsCount: C.number,
  spell1Id: SummonerSpellKey.codec,
  spell2Id: SummonerSpellKey.codec,
  perks: PerksView.codec,
})

const ActiveGameParticipantView = { codec }

export { ActiveGameParticipantView }
