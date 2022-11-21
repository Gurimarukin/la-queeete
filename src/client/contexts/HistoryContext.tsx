/* eslint-disable functional/no-return-void */
import { pipe } from 'fp-ts/function'
import * as history from 'history'
import qs from 'qs'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { Either } from '../../shared/utils/fp'

import { MasteriesQuery } from '../models/masteriesQuery/MasteriesQuery'
import { PartialMasteriesQuery } from '../models/masteriesQuery/PartialMasteriesQuery'

type NavigateOptions = {
  /**
   * @default false
   */
  readonly replace?: boolean
}

type HistoryContext = {
  readonly location: history.Location
  readonly navigate: (to: string, options?: NavigateOptions) => void
  readonly query: qs.ParsedQs

  readonly masteriesQuery: MasteriesQuery
  readonly updateMasteriesQuery: (f: (q: MasteriesQuery) => MasteriesQuery) => void
}

const HistoryContext = createContext<HistoryContext | undefined>(undefined)

export const HistoryContextProvider: React.FC = ({ children }) => {
  const h = useMemo(() => history.createBrowserHistory(), [])

  const [location, setLocation] = useState(h.location)
  useEffect(() => h.listen(l => setLocation(l.location)), [h])

  const navigate = useCallback(
    (to: string, { replace = false }: NavigateOptions = {}) =>
      (replace ? h.replace : h.push)({ pathname: to, search: '', hash: '' }),
    [h],
  )

  const query = useMemo(() => qs.parse(location.search.slice(1)), [location.search])

  const masteriesQuery = useMemo(
    () =>
      pipe(
        PartialMasteriesQuery.decoder.decode(query),
        Either.getOrElse(() => ({})),
        MasteriesQuery.fromPartial,
      ),
    [query],
  )

  const updateMasteriesQuery = useCallback(
    (f: (q: MasteriesQuery) => MasteriesQuery) =>
      h.push({
        search: pipe(
          f(masteriesQuery),
          MasteriesQuery.toPartial,
          PartialMasteriesQuery.qsStringify,
        ),
      }),
    [h, masteriesQuery],
  )

  const value: HistoryContext = { location, navigate, query, masteriesQuery, updateMasteriesQuery }

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
}

export const useHistory = (): HistoryContext => {
  const context = useContext(HistoryContext)
  if (context === undefined) {
    // eslint-disable-next-line functional/no-throw-statement
    throw Error('useHistory must be used within a HistoryContextProvider')
  }
  return context
}
