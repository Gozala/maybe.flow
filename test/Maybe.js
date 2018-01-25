/* @flow */

import * as Maybe from ".."
import test from "blue-tape"

test("test exports", async test => {
  test.isEqual(typeof Maybe, "object")
  test.ok(isFunction(Maybe.just), "Maybe.just is function")
  test.equal(Maybe.nothing, null, "Maybe.nothing is null")
  test.ok(isFunction(Maybe.toValue), "Maybe.toValue is function")
  test.ok(isFunction(Maybe.map), "Maybe.map is function")
  test.ok(isFunction(Maybe.chain), "Maybe.chain is function")
  test.ok(isFunction(Maybe.and), "Maybe.and is function")
  test.ok(isFunction(Maybe.or), "Maybe.or is function")
})

test("test Maybe.just", async test => {
  test.isEqual(Maybe.just(5), Maybe.just(5), "Maybe.just(5) -> Maybe.just(5)")
  test.isEqual(Maybe.just(5), 5, "Maybe.just(5) -> 5")
})

test("test Maybe.toValue", async test => {
  test.isEqual(
    Maybe.toValue(5, Maybe.just(7)),
    Maybe.just(7),
    "Maybe.toValue(Maybe.just(7), 5)"
  )
  test.isEqual(Maybe.toValue(7, 5), 5, "Maybe.toValue(7, 5) -> Maybe.just(7)")
  test.isEqual(Maybe.toValue(8, Maybe.nothing), 8)
  test.isEqual(Maybe.toValue(-1, Maybe.nothing), -1)
})

test("test Maybe.map", async test => {
  test.isEqual(Maybe.map(x => x * 2, Maybe.just(4)), Maybe.just(8))
  test.isEqual(Maybe.map(x => x * 2, 4), Maybe.just(8))
  test.isEqual(Maybe.map(x => x * 2, Maybe.nothing), Maybe.nothing)
})

test("test Maybe.chain", async test => {
  class List<a> {
    head: a
    tail: Maybe.Maybe<List<a>>
    static singleton(head: a): List<a> {
      return new List(head, Maybe.nothing)
    }
    constructor(head: a, tail: Maybe.Maybe<List<a>>) {
      this.head = head
      this.tail = tail
    }
  }

  const list = <a>(...items: Array<a>): List<a> =>
    items.reduceRight(
      (tail, head) => new List(head, tail),
      List.singleton(items.pop())
    )

  const tail = <a>(list: List<a>): Maybe.Maybe<List<a>> => list.tail

  test.deepEqual(Maybe.chain(tail, Maybe.just(list(1, 2))), list(2))
  test.deepEqual(Maybe.chain(tail, list(1, 2)), list(2))
  test.deepEqual(Maybe.chain(tail, list(1)), Maybe.nothing)
  test.deepEqual(Maybe.chain(tail, Maybe.nothing), Maybe.nothing)
  test.deepEqual(Maybe.chain(tail, tail(list(1, 2))), Maybe.nothing)
  test.deepEqual(Maybe.chain(tail, Maybe.chain(tail, list(1, 2, 3))), list(3))
  test.deepEqual(
    Maybe.chain(tail, Maybe.chain(tail, list(1, 2))),
    Maybe.nothing
  )
  test.deepEqual(Maybe.chain(tail, Maybe.chain(tail, list(1))), Maybe.nothing)
  test.deepEqual(
    Maybe.chain(tail, Maybe.chain(tail, Maybe.nothing)),
    Maybe.nothing
  )
})

test("test Maybe.and", async test => {
  test.equal(Maybe.and(Maybe.just(2), Maybe.nothing), Maybe.nothing)
  test.equal(Maybe.and(Maybe.nothing, Maybe.just("foo")), Maybe.nothing)
  test.equal(Maybe.and(Maybe.just(2), Maybe.just("foo")), Maybe.just("foo"))
  test.equal(Maybe.and(Maybe.nothing, Maybe.nothing), Maybe.nothing)
})

test("test Maybe.or", async test => {
  test.equal(Maybe.or(Maybe.just(2), Maybe.nothing), Maybe.just(2))
  test.equal(Maybe.or(Maybe.nothing, Maybe.just("foo")), Maybe.just("foo"))
  test.equal(Maybe.or(Maybe.just(2), Maybe.just(10)), Maybe.just(2))
  test.equal(Maybe.or(Maybe.nothing, Maybe.nothing), Maybe.nothing)
})

test("issue#4", async test => {
  type Params = {
    age: number
  }

  type User = {
    name: string,
    params: Maybe.Maybe<Params>
  }

  {
    const user: User = { name: "Soname", params: { age: 99 } }

    const params = Maybe.chain(v => v.params, Maybe.just(user)) // params:Maybe<Params>

    const age = Maybe.map(v => v.age, params) // age:Maybe<number>

    test.equal(age, 99, "age is as expected")
  }

  {
    const params = Maybe.chain(v => v.params, Maybe.nothing) // params:Maybe<Params>

    const age = Maybe.map(v => v.age, params) // age:Maybe<number>

    test.equal(age, Maybe.nothing, "age is Maybe.nothing")
  }

  {
    const user: User = { name: "Soname", params: null }

    const params = Maybe.chain(v => v.params, Maybe.just(user)) // params:Maybe<Params>

    const age = Maybe.map(v => v.age, params) // age:Maybe<number>

    test.equal(age, Maybe.nothing, "age is Maybe.nothing")
  }
})

const isFunction = <a>(value: a): boolean => typeof value === "function"
