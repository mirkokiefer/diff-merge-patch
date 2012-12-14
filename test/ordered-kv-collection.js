
var assert = require('assert')
var diff = require('../lib/index').orderedKeyValueCollections

var origin = [
  {key: 1, value: 1},
  {key: 2, value: 2},
  {key: 3, value: 3},
  {key: 4, value: 4}
]
var modified1 = [
  {key: 5, value: 6},
  {key: 3, value: 8},
  {key: 2, value: 2},
  {key: 4, value: 4},
  {key: 1, value: 5}
]
var modified2 = [
  {key: 2, value: 2},
  {key: 1, value: 9},
  {key: 4, value: 5}
]

var diff1Expected = {
  values: {
    modified: [{key: 1, value: 5}, {key: 3, value: 8}],
    added: [{key: 5, value: 6}],
    deleted: []
  },
  keys: [["x", 2], ["+", [5]], ["=", 1], ["p", [1]], ["=", 1], ["p", [0]]]
}
var diff2Expected = {
  values: {
    modified: [{key: 1, value: 9}, {key: 4, value: 5}],
    added: [],
    deleted: [3]
  },
  keys: [["x", 1], ["=", 1],["-", 1], ["p", [0]], ["=", 1]]
}

describe('ordered key-value diff', function() {
  it('should find the diffs including value changes', function() {
    var diff1 = diff(origin, modified1)
    assert.deepEqual(diff1, diff1Expected)

    var diff2 = diff(origin, modified2)
    assert.deepEqual(diff2, diff2Expected)
  })
})

