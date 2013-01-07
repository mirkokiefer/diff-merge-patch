
var assert = require('assert')
var diff = require('../lib/index').hashs
var Result = diff.Result

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
  diff: {
    5: 6,
    1: 5,
    3: 8
  }
}
var expectedDiff2 = {
  diff: {
    1: 9,
    4: 5,
    3: null
  }
}

describe('key-value collection diff', function() {
  it('should find all added/deleted keys + value changes', function() {
    var result1 = diff(before, after1)
    assert.deepEqual(result1, expectedDiff1)

    var result2 = diff(before, after2)
    assert.deepEqual(result2, expectedDiff2)
  })
  it('should compute the difference of two diffs', function() {
    var diff1 = new Result({
      diff: {
        1: 3,
        2: 4,
        6: 7
      }
    })
    var diff2 = {
      diff: {
        1: 3,
        2: 5,
        5: 6
      }
    }
    var expected = {
      diff: {
        2: 4,
        6: 7
      }
    }
    var result = diff1.difference(diff2)
    assert.deepEqual(result, expected)
  })
})
