import * as D from 'io-ts/Decoder'

import { DayJsFromNumber } from '../../utils/ioTsUtils'
import { AccountId } from './AccountId'
import { Puuid } from './Puuid'
import { SummonerId } from './SummonerId'

type RiotSummoner = Readonly<D.TypeOf<typeof decoder>>

const decoder = D.struct({
  id: SummonerId.codec,
  accountId: AccountId.codec,
  puuid: Puuid.codec,
  name: D.string,
  profileIconId: D.number,
  revisionDate: DayJsFromNumber.decoder,
  summonerLevel: D.number,
})

const RiotSummoner = { decoder }

export { RiotSummoner }
