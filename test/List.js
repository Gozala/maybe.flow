// @flow

import * as Maybe from ".."

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

export const list = <a>(...items: Array<a>): List<a> =>
  items.reduceRight(
    (tail, head) => new List(head, tail),
    List.singleton(items.pop())
  )

export const tail = <a>(list: List<a>): Maybe.Maybe<List<a>> => list.tail
