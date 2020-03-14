import facepaint from 'facepaint'

const breakpoints = [641, 961]

export const mq = facepaint(breakpoints.map(bp => `@media (min-width: ${bp}px)`))
