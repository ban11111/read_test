import { noop } from 'lodash'

export type KeyOfByType<T extends object, P> = { [K in keyof T]: T[K] extends P ? K : never }[keyof T]

export type Callback = (...args: any[]) => void

export type Noop = typeof noop
