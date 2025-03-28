import { Icons } from '@/shared/ui/Sprite/iconsList'
import { musicMode } from '@/shared/enum/playlist'

export const musicModeToIcon: Record<musicMode, Icons> = {
  [musicMode.AlanWatts]: Icons.coloredNoises,
  [musicMode.Focus]: Icons.focus,
  [musicMode.Grimes]: Icons.hibernation,
  [musicMode.JamesBlake]: Icons.natureElements,
  [musicMode.PlastikMan]: Icons.deeperFocus,
  [musicMode.Recovery]: Icons.recovery,
  [musicMode.Relax]: Icons.relax,
  [musicMode.Sleep]: Icons.sleep,
  [musicMode.SleepRain]: Icons.sleepRain,
  [musicMode.SpatialOrbit]: Icons.spatialOrbit,
  [musicMode.Study]: Icons.study,
  [musicMode.WinterSleep]: Icons.hibernation,
}
