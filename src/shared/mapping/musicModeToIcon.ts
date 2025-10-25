import { Icons } from '@/shared/ui/Sprite/iconsList';
import { musicMode } from '@/shared/enum/playlist';

export const musicModeToIcon: Record<musicMode, Icons> = {
  [musicMode.AlanWatts]: Icons.alanwatts,
  [musicMode.Focus]: Icons.focus,
  [musicMode.Grimes]: Icons.grimes,
  [musicMode.JamesBlake]: Icons.jamesblake,
  [musicMode.PlastikMan]: Icons.plastikman,
  [musicMode.Recovery]: Icons.recovery,
  [musicMode.Relax]: Icons.relax,
  [musicMode.Sleep]: Icons.sleep,
  [musicMode.SleepRain]: Icons.sleepRain,
  [musicMode.SpatialOrbit]: Icons.spatialOrbit,
  [musicMode.Study]: Icons.study,
  [musicMode.WinterSleep]: Icons.wintersleep,
};
