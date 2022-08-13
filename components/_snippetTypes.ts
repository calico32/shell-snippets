// NOTE: prettier just completely dies on this file; format it manually

import { ComponentProps } from 'react'
import { snippetNodeTypes } from './Snippet'

export interface PrimitiveType {
  /** any string value */
  string: string
  /** any numerical value (0, -25.231, 4, 69.2) */
  number: number
  /** any positive number, including 0 (13, 15.6, 0, 23.2) */
  positive: number
  /** any integer (0, 15, -34, 51) */
  integer: number
  /** any positive integer, including 0 (0, 5, 14, 66) */
  natural: number
  /** true or false */
  boolean: boolean
  /** yes or no */
  yesno: 'yes' | 'no'
}

export interface PlaceholderProps<T extends keyof PrimitiveType> {
  name: string
  type?: T
  render?: (value: PrimitiveType[T]) => NonNullable<React.ReactNode>
  presets?: { [key: string]: T | (() => NonNullable<React.ReactNode>) }
}

export interface PlaceholderChoiceProps<C extends string[]> {
  name: string
  type: Choice<C>
  render?: (value: C[number], key?: number | string) => NonNullable<React.ReactNode>
}

export interface CustomPlaceholderProps<T extends PlaceholderInputs> {
  name: string
  inputs: T
  render: (values: PlaceholderValues<T>, key?: number | string) => NonNullable<React.ReactNode>
  presets?: { [key: string]: PlaceholderValues<T> | (() => NonNullable<React.ReactNode>) }
}

export class Choice<T extends string[]> {
  constructor(public readonly values: T) {}
}

export interface PlaceholderInputs {
  [name: string]: keyof PrimitiveType | PlaceholderInputs | Choice<string[]> | [PlaceholderInputs, ...PlaceholderInputs[]]
}

export type PlaceholderValue<T> =
  T extends keyof PrimitiveType
  ? PrimitiveType[T]
  : T extends Choice<infer U>
  ? U[number]
  : T extends PlaceholderInputs
  ? PlaceholderValues<T>
  : T extends [...infer U extends PlaceholderInputs[]]
  ? { [V in keyof U]: PlaceholderValues<U[V]> }[number]
  : never

export type PlaceholderValues<T extends PlaceholderInputs = PlaceholderInputs> = {
  [P in keyof T]: PlaceholderValue<T[P]>
}

// ---------------------------

export interface SnippetNode<T extends keyof typeof snippetNodeTypes> {
  type: T
  props: ComponentProps<typeof snippetNodeTypes[T]>
}

export type SnippetNodeTypes = {
  [K in keyof typeof snippetNodeTypes]: SnippetNode<K>
}[keyof typeof snippetNodeTypes]

type PrimitivePlaceholderOptionsValue = {
  [K in keyof PrimitiveType]: PlaceholderOptionsValue<K>
}[keyof PrimitiveType]

export interface SnippetOptions {
  placeholders: Array<PrimitivePlaceholderOptionsValue | PlaceholderChoiceOptionsValue<string[]> | CustomPlaceholderOptionsValue<PlaceholderInputs>>
}

interface PlaceholderOptionsValue<T extends keyof PrimitiveType> {
  value: PrimitiveType[T]
}

interface PlaceholderChoiceOptionsValue<T extends string[]> {
  value: T[number]
}

interface CustomPlaceholderOptionsValue<T extends PlaceholderInputs> {
  value: T
}
