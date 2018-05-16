// // _appendKey : ([k], v, k) -> [k]
// const _appendKey = (keys, val, key) => append(key, keys)

// _assign : ({ k: v }, { k: v }) -> { k: v }
const _assign = (a, b) => {
  // eslint-disable-next-line guard-for-in
  for (const key in b) a[key] = b[key]
  return a
}

// // _comp : (a, b) -> Number
// const _comp = (a, b) => (a < b ? -1 : b < a ? 1 : 0)

// // _index : ({ k: Number }, String) -> { k: Number }
// const _index = (idx, key) => assoc(key, 1, idx)

// _partial : ((a... -> b), [a]) -> a... -> b
const _partial = (f, args) => f.bind(null, ...args)

// length : [a] -> Number
const length = list => list.length

// unapply : ([a] -> b) -> a... -> b
const unapply = f => (...args) => f(args)

// curryN : Number -> ((a, b, ...) -> z) -> a -> b -> ... -> z
const _curryN = (n, f) =>
  n < 1
    ? f
    : unapply(args => {
        const left = n - length(args)
        return left > 0 ? _curryN(left, _partial(f, args)) : f(...args)
      })

const curryN = _curryN(2, _curryN)

// curry : ((a, b, ...) -> z) -> a -> b -> ... -> z
const curry = f => curryN(length(f), f)

// dissoc : k -> { k: v } -> { k: v }
export const dissoc = (key, obj) => {
  const res = _assign({}, obj)
  delete res[key]
  return res
}

// assoc : k -> v -> { k: v } -> { k: v }
const assoc = curry((prop, val, obj) => {
  const res = _assign({}, obj)
  res[prop] = val
  return res
})

/* eslint-disable */
// dissocPath : [k] -> { k: v } -> { k: v }
export const dissocPath = curry(
  ([head, ...tail], obj) =>
    !head
      ? obj
      : obj[head] == null
        ? obj
        : length(tail)
          ? assoc(head, dissocPath(tail, obj[head]), obj)
          : dissoc(head, obj),
)
/* eslint-enable */
