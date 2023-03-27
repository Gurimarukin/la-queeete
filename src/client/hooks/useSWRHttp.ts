import type { Decoder } from 'io-ts/Decoder'
import type { HttpMethod } from 'ky/distribution/types/options'
import type { BareFetcher, SWRConfiguration, SWRResponse } from 'swr'
import useSWR from 'swr'

import type { Tuple } from '../../shared/utils/fp'

import { config } from '../config/unsafe'
import { futureRunUnsafe } from '../utils/futureRunUnsafe'
import type { HttpOptions } from '../utils/http'
import { http } from '../utils/http'

// only changes of method and url will trigger revalidation
export const useSWRHttp = <A, O, B>(
  methodWithUrl: Tuple<string, HttpMethod>,
  httpOptions: Omit<Readonly<HttpOptions<O, B>>, 'redirectOnUnauthorized'>,
  decoderWithName: Tuple<Decoder<unknown, A>, string>,
  swrOptions?: Readonly<SWRConfiguration<A, unknown, BareFetcher<A>>>,
): Readonly<SWRResponse<A, unknown>> =>
  useSWR<A, unknown, Tuple<string, HttpMethod>>(
    methodWithUrl,
    ([method, url]) => futureRunUnsafe(http([method, url], { ...httpOptions }, decoderWithName)),
    { ...swrOptions, revalidateOnFocus: swrOptions?.revalidateOnFocus ?? !config.isDev },
  )
