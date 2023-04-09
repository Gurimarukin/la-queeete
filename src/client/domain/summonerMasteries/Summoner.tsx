import React, { useMemo, useRef } from 'react'

import type { ChampionLevelOrZero } from '../../../shared/models/api/ChampionLevel'
import type { SummonerView } from '../../../shared/models/api/summoner/SummonerView'
import type { Dict } from '../../../shared/utils/fp'

import { MasteryImg } from '../../components/MasteryImg'
import { Tooltip } from '../../components/tooltip/Tooltip'
import { useStaticData } from '../../contexts/StaticDataContext'
import { InformationCircleOutline } from '../../imgs/svgIcons'
import { NumberUtils } from '../../utils/NumberUtils'
import { cssClasses } from '../../utils/cssClasses'

const { round } = NumberUtils

type Props = {
  summoner: EnrichedSummonerView
}

export type EnrichedSummonerView = SummonerView & {
  questPercents: number
  totalMasteryLevel: number
  masteriesCount: Dict<`${ChampionLevelOrZero}`, number>
}

export const Summoner = ({
  summoner: {
    name,
    profileIconId,
    summonerLevel,
    questPercents,
    totalMasteryLevel,
    masteriesCount,
  },
}: Props): JSX.Element => {
  const staticData = useStaticData()

  const masteriesRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLSpanElement>(null)

  const MasteryImgWithCount = useMemo(
    () => getMasteryImgWithCount(masteriesCount),
    [masteriesCount],
  )

  return (
    <div className="relative flex w-full max-w-7xl flex-wrap items-center justify-between gap-6 self-center px-3 pt-1">
      <div className="flex items-center gap-4">
        <img
          src={staticData.assets.summonerIcon(profileIconId)}
          alt={`Icône de ${name}`}
          className="h-24 w-24 rounded border border-goldenrod-secondary"
        />
        <div className="flex flex-col">
          <span className="text-lg text-goldenrod">{name}</span>
          <span className="text-sm">Niveau {summonerLevel}</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div ref={masteriesRef} className="flex items-end gap-2">
          <MasteryImgWithCount level={7} imgClassName="w-[72px] mt-[-6px]" />
          <MasteryImgWithCount level={6} imgClassName="w-[72px] mt-[-7px] mb-[-4px]" />
          <MasteryImgWithCount level={5} imgClassName="w-[72px] mt-[-11px] mb-[-6px]" />
        </div>
        <Tooltip
          hoverRef={masteriesRef}
          className="grid grid-cols-[1fr] justify-items-center gap-2 px-5 pt-3 pb-4"
        >
          <div className="grid grid-cols-[repeat(4,54px)_34px] items-end gap-1">
            <MasteryImgWithCount level={4} imgClassName="mt-[-6px]" />
            <MasteryImgWithCount level={3} imgClassName="mt-[-9px] mb-[-3px]" />
            <MasteryImgWithCount level={2} imgClassName="mt-[-10px] mb-[-5px]" />
            <MasteryImgWithCount level={1} imgClassName="mt-[-10px] mb-[-8px]" />
            <MasteryImgWithCount
              level={0}
              imgClassName="mt-[-10px] mb-[-8px]"
              className="relative left-[-10px] w-[54px]"
            />
          </div>
          <span className="text-sm">Niveau de maîtrise : {totalMasteryLevel}</span>
        </Tooltip>
        <span className="flex items-center gap-2">
          <span className="text-sm">Progression : {round(questPercents, 2)} %</span>
          <span ref={infoRef}>
            <InformationCircleOutline className="h-6 fill-current" />
          </span>
          <Tooltip hoverRef={infoRef}>
            <ul className="list-disc pl-3 leading-6">
              <li>
                De la maîtrise 0 à la maîtrise 5, les pourcents correspondent aux points de
                maîtrise.
              </li>
              <li>Maîtrise 5 = 50 %</li>
              <li>Chaque fragment = 3 %</li>
              <li>
                Chaque jeton pour la maîtrise 6 = 7 % (maîtrise 5 + 1 jeton = 57 % ; maîtrise 5 + 2
                jetons = 64 %)
              </li>
              <li>Maîtrise 6 = 67 %</li>
              <li>
                Chaque jeton pour la maîtrise 7 = 10 % (maîtrise 6 + 1 jeton = 77 % ; maîtrise 6 + 2
                jetons = 87 % ; maîtrise 6 + 3 jetons = 97 %)
              </li>
              <li>Maîtrise 7 = 100 %</li>
            </ul>
          </Tooltip>
        </span>
      </div>
    </div>
  )
}

type MasteryImgWithCountProps = {
  level: ChampionLevelOrZero
  imgClassName?: string
  className?: string
}

const getMasteryImgWithCount =
  (masteriesCount: Dict<`${ChampionLevelOrZero}`, number>) =>
  ({ level, imgClassName, className }: MasteryImgWithCountProps): JSX.Element =>
    (
      <div className={cssClasses('flex flex-col items-center', className)}>
        <span className="text-xs">{masteriesCount[level]}</span>
        <MasteryImg level={level} className={cssClasses('w-full', imgClassName)} />
      </div>
    )
