import { pipe } from 'fp-ts/function'
import type { Db } from 'mongodb'
import { MongoClient } from 'mongodb'
import type { Readable } from 'stream'

import { TObservable } from '../../../shared/models/rx/TObservable'
import { Future, Try } from '../../../shared/utils/fp'

import type { DbConfig } from '../../config/Config'
import { TObservableUtils } from '../../utils/TObservableUtils'

export type WithDb = ReturnType<typeof of>

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function of(client: MongoClient, dbName: string) {
  return {
    client,

    future: <A>(f: (db: Db) => Promise<A>): Future<A> =>
      Future.tryCatch(() => f(client.db(dbName))),

    observable: (f: (db: Db) => Readable): TObservable<unknown> => {
      const obs = pipe(
        Try.tryCatch(() => f(client.db(dbName))),
        Try.map(TObservableUtils.observableFromReadable),
        Try.getOrElseW(TObservable.throwError),
      )
      return TObservable.fromSubscribe(subscriber =>
        obs.subscribe({
          next: u => subscriber.next(u),
          error: e => subscriber.error(e),
          complete: () => subscriber.complete(),
        }),
      )
    },
  }
}

function load(config: DbConfig): Future<WithDb> {
  return pipe(
    Future.tryCatch(() =>
      new MongoClient(`mongodb://${config.user}:${config.password}@${config.host}`).connect(),
    ),
    Future.map(client => of(client, config.dbName)),
  )
}

export const WithDb = { load }
