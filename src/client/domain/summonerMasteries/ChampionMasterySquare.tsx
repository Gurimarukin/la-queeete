/* eslint-disable functional/no-return-void */
import { flow, pipe } from 'fp-ts/function'
import React, { useCallback, useMemo, useRef } from 'react'

import type { AramData } from '../../../shared/models/api/AramData'
import type { ChampionKey } from '../../../shared/models/api/champion/ChampionKey'
import type { ChampionLevelOrZero } from '../../../shared/models/api/champion/ChampionLevel'
import type { ChampionPosition } from '../../../shared/models/api/champion/ChampionPosition'
import { List, Maybe } from '../../../shared/utils/fp'

import { Tooltip } from '../../components/tooltip/Tooltip'
import { useStaticData } from '../../contexts/StaticDataContext'
import { Assets } from '../../imgs/Assets'
import { AddOutline, RemoveOutline, SparklesSharp } from '../../imgs/svgIcons'
import { NumberUtils } from '../../utils/NumberUtils'
import { cssClasses } from '../../utils/cssClasses'
import { ChampionTooltip } from './ChampionTooltip'

const { round } = NumberUtils

type ChampionMasterySquareProps = {
  championId: ChampionKey
  chestGranted: boolean
  tokensEarned: number
  championLevel: ChampionLevelOrZero
  championPoints: number
  championPointsUntilNextLevel: number
  name: string
  percents: number
  shardsCount: Maybe<number>
  glow: Maybe<number>
  positions: List<ChampionPosition>
  aram: Maybe<AramData>
  setChampionShards: ((champion: ChampionKey) => (count: number) => void) | null
  /**
   * @default false
   */
  roundedBrInsteadOfTr?: boolean
  hoverRef?: React.RefObject<HTMLDivElement>
  className?: string
}

export const ChampionMasterySquare = ({
  championId,
  championLevel,
  championPoints,
  championPointsUntilNextLevel,
  chestGranted,
  tokensEarned,
  name,
  percents,
  shardsCount,
  glow,
  positions,
  aram,
  setChampionShards,
  roundedBrInsteadOfTr = false,
  hoverRef: overrideHoverRef,
  className,
}: ChampionMasterySquareProps): JSX.Element => {
  const staticData = useStaticData()

  const setShardsCount = useMemo(
    () => (setChampionShards !== null ? setChampionShards(championId) : null),
    [championId, setChampionShards],
  )

  const isGlowing = Maybe.isSome(glow)

  const filteredShardsCount = pipe(
    shardsCount,
    Maybe.filter(count => (championLevel === 7 ? 0 < count : true)), // hide for level 7 and 0 shards
  )

  const hoverRef_ = useRef<HTMLDivElement>(null)
  const hoverRef = overrideHoverRef ?? hoverRef_

  return (
    <div className={cssClasses('relative', className)}>
      {/* glow */}
      <div
        className={
          isGlowing
            ? 'absolute -left-1.5 -top-1.5 h-[76px] w-[76px] animate-glow rounded-1/2 bg-gradient-to-r from-amber-200 to-yellow-400 blur-sm'
            : 'hidden'
        }
        style={animationDelay(glow)}
      />

      {/* container, color background */}
      <div
        ref={hoverRef}
        className={cssClasses(
          'relative flex h-16 w-16 items-center justify-center rounded-bl-xl',
          championLevelBgColor(championLevel),
          roundedBrInsteadOfTr ? 'rounded-br-xl' : 'rounded-tr-xl',
        )}
      >
        {/* champion image */}
        <div
          className={cssClasses(
            'h-12 w-12 overflow-hidden rounded-bl-lg',
            roundedBrInsteadOfTr ? 'rounded-br-lg' : 'rounded-tr-lg',
          )}
        >
          <img
            src={staticData.assets.champion.square(championId)}
            alt={`Icône de ${name}`}
            className="m-[-3px] w-[calc(100%_+_6px)] max-w-none"
          />
        </div>

        {/* champion level top left */}
        <div
          className={cssClasses(
            'absolute top-0 left-0 flex h-4 w-3.5 justify-center overflow-hidden rounded-br-lg bg-black pr-0.5 text-xs font-bold',
            championLevelNumberColor(championLevel),
          )}
        >
          <span className="-mt-0.5">{championLevel}</span>
        </div>

        {/* tokens next to champion level */}
        <Tokens championLevel={championLevel} tokensEarned={tokensEarned} />

        {/* chest bottom left */}
        {chestGranted ? (
          <div className="absolute left-0 bottom-0 flex h-[15px] w-[18px] flex-col-reverse rounded-tr bg-black">
            <img src={Assets.chest} alt="Icône de coffre" className="w-4" />
          </div>
        ) : null}

        {/* shards bottom right */}
        {pipe(
          filteredShardsCount,
          Maybe.fold(
            () => null,
            shards => <Shards shardsCount={shards} setShardsCount={setShardsCount} />,
          ),
        )}
      </div>

      <Tooltip hoverRef={hoverRef} placement="top" className="grid grid-cols-[auto_auto] !p-0">
        <ChampionTooltip
          chestGranted={chestGranted}
          tokensEarned={tokensEarned}
          championLevel={championLevel}
          championPoints={championPoints}
          championPointsUntilNextLevel={championPointsUntilNextLevel}
          name={name}
          percents={percents}
          filteredShardsCount={filteredShardsCount}
          positions={positions}
          aram={aram}
        />
      </Tooltip>
    </div>
  )
}

const animationDelay: (glow: Maybe<number>) => React.CSSProperties | undefined = flow(
  Maybe.map((delay): React.CSSProperties => {
    const delaySeconds = `${round(delay, 3)}s`
    return {
      animationDelay: delaySeconds,
      MozAnimationDelay: delaySeconds,
      WebkitAnimationDelay: delaySeconds,
    }
  }),
  Maybe.toUndefined,
)

const championLevelBgColor = (championLevel: ChampionLevelOrZero): string => {
  if (championLevel === 7) return 'bg-mastery7-blue'
  if (championLevel === 6) return 'bg-mastery6-violet'
  if (championLevel === 5) return 'bg-mastery5-red'
  if (championLevel === 4) return 'bg-mastery4-brown'
  if (championLevel === 0) return 'bg-black'
  return 'bg-mastery-beige'
}

const championLevelNumberColor = (championLevel: ChampionLevelOrZero): string => {
  if (championLevel === 7) return 'text-blue-500'
  if (championLevel === 6) return 'text-purple-400'
  if (championLevel === 5) return 'text-red-700'
  if (championLevel === 4) return 'text-yellow-600'
  return 'text-neutral-400'
}

type TokensProps = {
  championLevel: number
  tokensEarned: number
}

const Tokens = ({ championLevel, tokensEarned }: TokensProps): JSX.Element | null => {
  const render = useCallback(
    (totalTockens: number, src: string): JSX.Element => {
      const alt = `Jeton de maîtrise ${championLevel + 1}`
      return (
        <span
          className={cssClasses(
            'absolute left-[13px] top-0 flex h-2.5 rounded-br bg-black pl-0.5',
            ['gap-0.5 pt-px pb-0.5 pr-0.5', championLevel === 5],
            ['gap-[3px] pb-px pr-[3px]', championLevel === 6],
          )}
        >
          {pipe(
            repeatElements(tokensEarned, i => (
              <img key={i} src={src} alt={alt} className="h-full bg-cover" />
            )),
            List.concat(
              repeatElements(totalTockens - tokensEarned, i => (
                <img
                  key={totalTockens - i}
                  src={src}
                  alt={`${alt} (non obtenu)`}
                  className="h-full bg-cover grayscale"
                />
              )),
            ),
          )}
        </span>
      )
    },
    [championLevel, tokensEarned],
  )

  if (championLevel === 5) return render(2, Assets.token5)
  if (championLevel === 6) return render(3, Assets.token6)
  return null
}

function repeatElements<A>(n: number, getA: (i: number) => A): List<A> {
  return pipe([...Array(Math.max(n, 0))], List.mapWithIndex(getA))
}

type ShardsProps = {
  shardsCount: number
  setShardsCount: ((count: number) => void) | null
}

const Shards = ({ shardsCount, setShardsCount }: ShardsProps): JSX.Element => {
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const removeButtonRef = useRef<HTMLButtonElement>(null)

  const addShardCount = useCallback(
    () => setShardsCount?.(shardsCount + 1),
    [setShardsCount, shardsCount],
  )
  const removeShardCount = useCallback(
    () => setShardsCount?.(shardsCount - 1),
    [setShardsCount, shardsCount],
  )

  const canRemoveShard = 1 <= shardsCount

  return (
    <div className="group absolute right-0 bottom-0 flex items-end">
      <span className="-mr-0.5 overflow-hidden rounded-tl bg-black pl-px pt-px">
        <SparklesSharp className="h-2.5 w-2.5 rotate-180 fill-current" />
      </span>
      <span className="flex h-4 w-3.5 justify-end rounded-tl-lg bg-black pl-0.5 text-xs group-hover:justify-center">
        <span className="mt-0.5">{shardsCount}</span>
      </span>
      {setShardsCount !== null ? (
        <div
          className={cssClasses(
            'absolute -right-px z-10 hidden flex-col items-end overflow-hidden rounded-[5px] group-hover:flex',
            ['-bottom-3.5', canRemoveShard],
          )}
        >
          <span className={cssClasses('flex bg-black p-px pb-0.5', ['hidden', 9 <= shardsCount])}>
            <button
              ref={addButtonRef}
              type="button"
              onClick={addShardCount}
              className="w-3 rounded-t bg-goldenrod text-black"
            >
              <AddOutline className="w-full" />
            </button>
            <Tooltip hoverRef={addButtonRef} placement="right" className="z-10 !text-2xs">
              Ajouter un fragment
            </Tooltip>
          </span>
          <span className="h-3 w-px bg-black" />
          <span className={cssClasses('flex bg-black p-px', ['hidden', !canRemoveShard])}>
            <button
              ref={removeButtonRef}
              type="button"
              onClick={removeShardCount}
              className="w-3 rounded-b bg-goldenrod text-black"
            >
              <RemoveOutline className="w-full" />
            </button>
            <Tooltip hoverRef={removeButtonRef} placement="right" className="z-10 !text-2xs">
              Enlever un fragment
            </Tooltip>
          </span>
        </div>
      ) : null}
    </div>
  )
}
