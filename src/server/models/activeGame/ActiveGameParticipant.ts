import type { ActiveGameMasteriesView } from '../../../shared/models/api/activeGame/ActiveGameMasteriesView'
import type { ActiveGameParticipantView } from '../../../shared/models/api/activeGame/ActiveGameParticipantView'
import type { ChampionKey } from '../../../shared/models/api/champion/ChampionKey'
import type { RuneId } from '../../../shared/models/api/perk/RuneId'
import type { RuneStyleId } from '../../../shared/models/api/perk/RuneStyleId'
import type { Puuid } from '../../../shared/models/api/summoner/Puuid'
import type { SummonerLeaguesView } from '../../../shared/models/api/summoner/SummonerLeaguesView'
import type { SummonerSpellKey } from '../../../shared/models/api/summonerSpell/SummonerSpellKey'
import type { SummonerName } from '../../../shared/models/riot/SummonerName'
import type { List } from '../../../shared/utils/fp'
import { Maybe } from '../../../shared/utils/fp'

import type { SummonerId } from '../summoner/SummonerId'

type ActiveGameParticipant = {
  puuid: Puuid
  summonerId: SummonerId
  summonerName: SummonerName
  profileIconId: number
  championId: ChampionKey
  spell1Id: SummonerSpellKey
  spell2Id: SummonerSpellKey
  perks: {
    perkIds: List<RuneId>
    perkStyle: RuneStyleId
    perkSubStyle: RuneStyleId
  }
}

type ToView = {
  leagues: Maybe<SummonerLeaguesView>
  masteries: Maybe<ActiveGameMasteriesView>
  shardsCount: Maybe<number>
}

const toView =
  ({ leagues, masteries, shardsCount }: ToView) =>
  (participant: ActiveGameParticipant): ActiveGameParticipantView => ({
    summonerName: participant.summonerName,
    profileIconId: participant.profileIconId,
    leagues,
    championId: participant.championId,
    masteries,
    shardsCount,
    spell1Id: participant.spell1Id,
    spell2Id: participant.spell2Id,
    perks: participant.perks,

    premadeId: Maybe.none,
    summonerLevel: Maybe.none,
    championRankedStats: Maybe.none,
    role: Maybe.none,
    mainRoles: [],
    tags: [],
  })

const ActiveGameParticipant = { toView }

export { ActiveGameParticipant }
