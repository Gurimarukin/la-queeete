import { ChampionPosition } from '../../shared/models/api/champion/ChampionPosition'

import { Assets } from '../imgs/Assets'
import { cssClasses } from '../utils/cssClasses'

type Props = {
  position: ChampionPosition
  /**
   * Should define a fixed width and height
   */
  className?: string
}

export const ChampionPositionImg: React.FC<Props> = ({ position, className }) => (
  <div className={cssClasses('flex items-center justify-center', className)}>
    <img
      src={Assets.positions[position]}
      alt={`Icône position ${ChampionPosition.label[position]}`}
      className={cssClasses(['mx-[8.33%] h-5/6 w-5/6', position === 'jun' || position === 'sup'])}
    />
  </div>
)
