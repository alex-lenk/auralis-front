export enum Icons {
  alanwatts = 'alanwatts',
  close = 'close',
  focus = 'focus',
  grimes = 'grimes',
  jamesblake = 'jamesblake',
  moon = 'moon',
  pause = 'pause',
  plastikman = 'plastikman',
  play = 'play',
  recovery = 'recovery',
  relax = 'relax',
  sleepRain = 'sleep-rain',
  sleep = 'sleep',
  spatialOrbit = 'spatial-orbit',
  study = 'study',
  sun = 'sun',
  update = 'update',
  volume = 'volume',
  wintersleep = 'wintersleep'
}

export type IconName = (typeof Icons)[keyof typeof Icons];
