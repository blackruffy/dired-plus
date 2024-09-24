export type AnyVal =
  | boolean
  | number
  | string
  | ReadonlyArray<AnyVal>
  | Readonly<{ [key: string]: AnyVal }>;
