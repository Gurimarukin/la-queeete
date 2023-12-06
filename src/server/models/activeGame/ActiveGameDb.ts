import type { Codec } from 'io-ts/Codec'
import * as C from 'io-ts/Codec'

import { MapId } from '../../../shared/models/api/MapId'
import type { BannedChampionOutput } from '../../../shared/models/api/activeGame/BannedChampion'
import { BannedChampion } from '../../../shared/models/api/activeGame/BannedChampion'
import { GameQueue } from '../../../shared/models/api/activeGame/GameQueue'
import type { TeamId } from '../../../shared/models/api/activeGame/TeamId'
import { ChampionKey } from '../../../shared/models/api/champion/ChampionKey'
import { RuneId } from '../../../shared/models/api/perk/RuneId'
import { RuneStyleId } from '../../../shared/models/api/perk/RuneStyleId'
import { Puuid } from '../../../shared/models/api/summoner/Puuid'
import { SummonerSpellKey } from '../../../shared/models/api/summonerSpell/SummonerSpellKey'
import { SummonerName } from '../../../shared/models/riot/SummonerName'
import type { Dict } from '../../../shared/utils/fp'
import { List, Maybe, NonEmptyArray } from '../../../shared/utils/fp'

import { DayJsFromDate } from '../../utils/ioTsUtils'
import { GameId } from '../riot/GameId'
import { SummonerId } from '../summoner/SummonerId'

type Participant = C.TypeOf<typeof participantCodec>
type ParticipantOutput = C.OutputOf<typeof participantCodec>

const participantCodec = C.struct({
  puuid: Puuid.codec,
  summonerId: SummonerId.codec,
  summonerName: SummonerName.codec,
  profileIconId: C.number,
  championId: ChampionKey.codec,
  spell1Id: SummonerSpellKey.codec,
  spell2Id: SummonerSpellKey.codec,
  perks: C.struct({
    perkIds: List.codec(RuneId.codec),
    perkStyle: RuneStyleId.codec,
    perkSubStyle: RuneStyleId.codec,
  }),
})

type ActiveGameDb = C.TypeOf<typeof codec>

const bannedChampionsProperties: Dict<
  `${TeamId}`,
  Codec<unknown, NonEmptyArray<BannedChampionOutput>, NonEmptyArray<BannedChampion>>
> = {
  100: NonEmptyArray.codec(BannedChampion.codec),
  200: NonEmptyArray.codec(BannedChampion.codec),
}

const participantsProperties: Dict<
  `${TeamId}`,
  Codec<unknown, NonEmptyArray<ParticipantOutput>, NonEmptyArray<Participant>>
> = {
  100: NonEmptyArray.codec(participantCodec),
  200: NonEmptyArray.codec(participantCodec),
}

const codec = C.struct({
  gameId: GameId.codec,
  mapId: MapId.codec,
  gameStartTime: Maybe.codec(DayJsFromDate.codec),
  gameQueueConfigId: GameQueue.codec,
  isDraft: C.boolean,
  bannedChampions: C.readonly(C.partial(bannedChampionsProperties)),
  participants: C.readonly(C.partial(participantsProperties)),
  insertedAt: DayJsFromDate.codec,
  updatedAt: DayJsFromDate.codec,
})

const ActiveGameDb = { codec }

export { ActiveGameDb }
