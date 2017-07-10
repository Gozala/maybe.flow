/* @flow */

/**
 * This library provides means for representing values that may or may not
 * exist. This can come handy for representing optional arguments,
 * error handling, and records with optional fields.
 */

/**
 * Type representing absence of value. Library treats all of the typescript
 * primitives for absense of value as `Nothing`.
 */
export type Nothing = void | null

/**
 * Type reprsenting some value. Library treats arbitrary value other than
 * `Nothing` as `Just` that value.
 */
export type Just<a> = a

/**
 * Type represent value that may not exist in which case it's `Nothing` or
 * `Just` that value.
 */
export type Maybe<a> = Nothing | Just<a>

/**
 * Turns arbitrary value into maybe value.
 * @param value arbitrary value
 */
export const just = <a>(value: a): Maybe<a> => value

/**
 * Just provides an alias to `null`.
 */
export const nothing: Maybe<*> = null

/**
 * Provide a `fallback` value, turning an optional value into a normal value.
 * 
 * ```ts
 * Maybe.toValue(5, Maybe.just(9)) // => Maybe.just(9)
 * Maybe.toValue(6, Maybe.nothing) // => Maybe.just(6)
 * ```
 * @param fallback Fallback value
 * @param maybe Optional value
 */
export const toValue = <a>(fallback: a, maybe: Maybe<a>): a =>
  maybe == null ? fallback : maybe

/**
 * Transform a Maybe value with a given function:
 * 
 * ```ts
 * Maybe.map(Math.sqrt, Maybe.just(9)) // => Maybe.just(3)
 * Maybe.map(Math.sqrt, Maybe.nothing) // => Maybe.nothing
 * ```
 * @param f Function that maps underlayng value.
 * @param maybe Maybe value to be transformed.
 */
export const map = <a, b>(f: (input: a) => b, maybe: Maybe<a>): Maybe<b> =>
  maybe == null ? null : f(maybe)

/**
 * Utility to chain together two computations that may fail (return Nothing).
 * 
 * ```ts
 * const makeGreeting = (name:string):string =>
 *  `Hello ${name}!`
 * 
 * const greet = (name:Maybe<string>):Maybe<string> =>
 *  Maybe.chain(makeGreeting, name)
 * 
 * greet(Maybe.nothing) // => Maybe.nothing
 * greet(Maybe.just('world')) // => Maybe.just('Hello world!')
 * ```
 * 
 * @param then Function that performs second computation from the a result of
 * the first one (if it was successful - returned Just).
 * @param maybe Maybe value, representing result of first computation.
 */
export const chain = <a, b>(
  then: (input: a) => Maybe<b>,
  maybe: Maybe<a>
): Maybe<b> => (maybe == null ? null : then(maybe))

/**
 * Returns `Nothing` if the left Maybe is `Nothing`, otherwise returns the
 * right Maybe.
 * 
 * ```ts
 * Maybe.and(Maybe.just(2), Maybe.nothing) // => Maybe.nothing
 * Maybe.and(Maybe.nothing, Maybe.just('foo')) // => Maybe.nothing
 * Maybe.and(Maybe.just(2), Maybe.just('foo')) // => Maybe.just('foo')
 * Maybe.and(Maybe.nothing, Maybe.nothing) // => Maybe.nothing
 * ```
 */
export const and = <a, b>(left: Maybe<a>, right: Maybe<b>): Maybe<b> =>
  left == null ? null : right

/**
 * Returns the left Maybe if it is a Just value, otherwise returns right Maybe.
 * 
 * ```js
 * Maybe.or(Maybe.just(2), Maybe.nothing) // => Maybe.just(2)
 * Maybe.or(Maybe.nothing, Maybe.just('foo')) // => Maybe.just('foo')
 * Maybe.or(Maybe.just(2), Maybe.just(100)) // => Maybe.just(2)
 * Maybe.or(Maybe.nothing, Maybe.nothing) // => Maybe.nothing
 * ```
 */
export const or = <a>(left: Maybe<a>, right: Maybe<a>): Maybe<a> =>
  left == null ? right : left
