
var assert = require('assert')
var merge = require('../../lib/index').hash.merge
var Result = merge.Result
var testData = require('./test-data')

describe('hash merging', function() {
  var before = testData[0].before
  var diffs = testData[0].diffs

  it('should do a 3-way merge', function() {
    var result = merge(diffs)
    assert.deepEqual(result, testData[0].diffsMerged)
  })
  it('should test an n-way merge', function() {
    var diff3 = { diff: { '2': 3, '3': null, '4': 6, '7': 9 } }
    var expected = {
      diff: {
        1: [5, 9],
        2: 3,
        3: [8, null, null],
        4: [5, 6],
        5: 6,
        7: 9
      },
      conflict: [1, 3, 4]
    }
    var result = merge(diffs.concat(diff3))
    assert.deepEqual(result, expected)
  })
  it('should test commutative conflict resolution', function() {
    var result1 = new Result({
      diff: {
        1: [5, 9],
        2: 3,
        3: [null, 8, null],
        4: [6, 5],
        5: 6,
        7: null
      },
      conflict: [1, 3, 4]
    })
    var result2 = new Result({
      diff: {
        1: [5, 9],
        2: 3,
        3: [8, null, null],
        4: [5, 6],
        5: 6,
        7: null
      },
      conflict: [1, 3, 4]
    })
    var expected = {
      diff: {
        1: 5,
        2: 3,
        3: 8,
        4: 5,
        5: 6,
        7: null
      }
    }
    var resolvedResult1 = result1.resolveConflicts()
    var resolvedResult2 = result2.resolveConflicts()
    assert.deepEqual(resolvedResult1, expected)
    assert.deepEqual(resolvedResult1, resolvedResult2)
  })
})
