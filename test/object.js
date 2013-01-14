
var assert = require('assert')
var merge = require('../lib/index').object.merge
var Result = merge.Result
var testData = require('./test-data/object')

describe('object merging', function() {
  it('should test an n-way merge', function() {
    var diffs = testData[0].diffs
    var diff3 = { diff: { '2': {value: 3}, '3': {value: null}, '4': {value: 6}, '7': {value: 9} } }
    var expected = {
      diff: {
        1: [{value: 5, source: [0]}, {value: 9, source: [1]}],
        2: {value: 3, source: [2]},
        3: [{value: 8, source: [0]}, {value: null, source: [1, 2]}],
        4: [{value: 5, source: [1]}, {value: 6, source: [2]}],
        5: {value: 6, source: [0]},
        7: {value: 9, source: [2]}
      },
      conflict: [1, 3, 4]
    }
    var result = merge(diffs.concat(diff3))
    assert.deepEqual(result, expected)
  })
  it('should test commutative conflict resolution', function() {
    var result1 = new Result({
      diff: {
        1: [{value: 5, source: [0]}, {value: 9, source: [1]}],
        2: {value: 3, source: [0, 1]},
        3: [{value: null, source: [0, 1]}, {value: 8, source: [1]}],
        4: [{value: 6, source: [1]}, {value: 5, source: [0]}],
        5: {value: 6, source: [2]},
        7: {value: null, source: [0]}
      },
      conflict: [1, 3, 4]
    })
    var result2 = new Result({
      diff: {
        1: [{value: 9, source: [1]}, {value: 5, source: [0]}],
        2: {value: 3, source: [0, 1]},
        3: [{value: null, source: [0, 1]}, {value: 8, source: [1]}],
        4: [{value: 5, source: [0]}, {value: 6, source: [1]}],
        5: {value: 6, source: [2]},
        7: {value: null, source: [0]}
      },
      conflict: [1, 3, 4]
    })
    var expected = {
      diff: {
        1: {value: 5, source: [0]},
        2: {value: 3, source: [0, 1]},
        3: {value: 8, source: [1]},
        4: {value: 5, source: [0]},
        5: {value: 6, source: [2]},
        7: {value: null, source: [0]}
      }
    }
    var resolvedResult1 = result1.resolveConflicts()
    var resolvedResult2 = result2.resolveConflicts()
    assert.deepEqual(resolvedResult1, expected)
    assert.deepEqual(resolvedResult1, resolvedResult2)
  })
})
