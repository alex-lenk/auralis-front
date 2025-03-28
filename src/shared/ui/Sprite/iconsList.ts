export enum Icons {
  coloredNoises = 'colored-noises',
  deeperFocus = 'deeper-focus',
  focus = 'focus',
  hibernation = 'hibernation',
  natureElements = 'nature-elements',
  recovery = 'recovery',
  relax = 'relax',
  sleepRain = 'sleep-rain',
  sleep = 'sleep',
  spatialOrbit = 'spatial-orbit',
  study = 'study'
}

export type IconName = (typeof Icons)[keyof typeof Icons];
