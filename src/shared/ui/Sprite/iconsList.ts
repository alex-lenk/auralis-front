export enum Icons {
  coloredNoises = 'colored-noises',
  deeperFocus = 'deeper-focus',
  focus = 'focus',
  hibernation = 'hibernation',
  moon = 'moon',
  natureElements = 'nature-elements',
  pause = 'pause',
  play = 'play',
  recovery = 'recovery',
  relax = 'relax',
  sleepRain = 'sleep-rain',
  sleep = 'sleep',
  spatialOrbit = 'spatial-orbit',
  study = 'study',
  sun = 'sun',
  update = 'update',
  volume = 'volume'
}

export type IconName = (typeof Icons)[keyof typeof Icons];
