import { flow, pipe } from 'fp-ts/function'
import React, { useCallback } from 'react'

import { List, Maybe } from '../../../shared/utils/fp'

import { useStaticData } from '../../contexts/StaticDataContext'
import { Assets } from '../../imgs/Assets'
import { NumberUtils } from '../../utils/NumberUtils'
import { cssClasses } from '../../utils/cssClasses'
import type { EnrichedChampionMastery } from './EnrichedChampionMastery'

const { round } = NumberUtils

type ChampionMasterySquareProps = {
  readonly champion: EnrichedChampionMastery
}

export const ChampionMasterySquare = ({
  champion: { championId, championLevel, chestGranted, tokensEarned, name, percents, glow },
}: ChampionMasterySquareProps): JSX.Element => {
  const staticData = useStaticData()

  const nameLevelTokens = `${name} - niveau ${championLevel}${
    championLevel === 5 || championLevel === 6
      ? ` - ${tokensEarned} jeton${tokensEarned < 2 ? '' : 's'}`
      : ''
  }\n${Math.round(percents)}%`

  const isGlowing = Maybe.isSome(glow)

  return (
    <div className="relative">
      <div
        className={cssClasses(
          ['hidden', !isGlowing],
          [
            'absolute left-[-6px] top-[-6px] h-[76px] w-[76px] animate-glow rounded-1/2 bg-gradient-to-r from-amber-200 to-yellow-400 blur-sm',
            isGlowing,
          ],
        )}
        style={animationDelay(glow)}
      />
      <div
        className={cssClasses(
          'relative flex h-16 w-16 items-center justify-center',
          ['bg-mastery7-blue', championLevel === 7],
          ['bg-mastery6-violet', championLevel === 6],
          ['bg-mastery5-red', championLevel === 5],
          ['bg-mastery4-brown', championLevel === 4],
          ['bg-mastery-beige', championLevel < 4],
        )}
        title={name}
      >
        <div className="h-12 w-12 overflow-hidden">
          <img
            src={staticData.assets.champion.square(championId)}
            alt={`${name}'s icon`}
            className="m-[-3px] w-[calc(100%_+_6px)] max-w-none"
          />
        </div>
        <div
          className="absolute top-0 left-0 flex h-4 w-[14px] justify-center overflow-hidden rounded-br-lg bg-black pr-[2px] text-xs"
          title={nameLevelTokens}
        >
          <span className="mt-[-2px]">{championLevel}</span>
        </div>
        <Tokens championLevel={championLevel} tokensEarned={tokensEarned} title={nameLevelTokens} />
        {chestGranted ? (
          <div
            title={`${name} - coffre obtenu`}
            className="absolute left-0 bottom-0 flex h-[15px] w-[18px] flex-col-reverse rounded-tr bg-black"
          >
            <img src={Assets.chest} alt="Chest icon" className="w-4" />
          </div>
        ) : null}
      </div>
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

type TokensProps = {
  readonly championLevel: number
  readonly tokensEarned: number
  readonly title?: string
}

const Tokens = ({ championLevel, tokensEarned, title }: TokensProps): JSX.Element | null => {
  const render = useCallback(
    (totalTockens: number, src: string): JSX.Element => {
      const alt = `Mastery ${championLevel + 1} token`
      return (
        <span
          title={title}
          className={cssClasses(
            'absolute left-[13px] top-0 flex h-[10px] rounded-br bg-black pl-[2px]',
            ['gap-[2px] pt-[1px] pb-[2px] pr-[2px]', championLevel === 5],
            ['gap-[3px] pb-[1px] pr-[3px]', championLevel === 6],
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
                  alt={`${alt} (not earned)`}
                  className="h-full bg-cover grayscale"
                />
              )),
            ),
          )}
        </span>
      )
    },
    [championLevel, title, tokensEarned],
  )

  if (championLevel === 5) return render(2, Assets.token5)
  if (championLevel === 6) return render(3, Assets.token6)
  return null
}

function repeatElements<A>(n: number, getA: (i: number) => A): List<A> {
  return pipe([...Array(Math.max(n, 0))], List.mapWithIndex(getA))
}
