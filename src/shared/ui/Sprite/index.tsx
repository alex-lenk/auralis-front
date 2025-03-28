import { FC, CSSProperties } from 'react'

import sprite from '@/assets/img/sprite.svg'
import { IconName } from './iconsList'

interface ISpriteProps {
  icon: IconName;
  className?: string;
  styles?: CSSProperties;
}

const Sprite: FC<ISpriteProps> = ({ icon, className, styles }) => {
  return (
    <svg className={ className } style={ styles }>
      <use href={ `${sprite}#${ icon }` } />
    </svg>
  )
}

export default Sprite
