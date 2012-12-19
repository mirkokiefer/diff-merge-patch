
var assert = require('assert')
var diff = require('../lib/index').keyValueCollections

var before = {
  1: 1,
  2: 2,
  3: 3,
  4: 4
}

var after1 = {
  5: 6,
  3: 8,
  2: 2,
  4: 4,
  1: 5
}

var after2 = {
  2: 2,
  1: 9,
  4: 5
}

var expectedDiff1 = {
  insert: {5: 6},
  update: {1: 5, 3: 8},
  delete: []
}
var expectedDiff2 = {
  insert: {},
  update: {1: 9, 4: 5},
  delete: [3]
}

describe('key-value collection diff', function() {
  it('should find all added/deleted keys + value changes', function() {
    var result1 = diff(before, after1)
    assert.deepEqual(result1, expectedDiff1)

    var result2 = diff(before, after2)
    assert.deepEqual(result2, expectedDiff2)
  })
})
