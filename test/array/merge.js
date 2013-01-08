
var assert = require('assert')
var diff = require('../../lib/index').array.diff({unique:true})
var merge = require('../../lib/index').array.merge
var Result = merge.Result
var testData = require('./test-data')

describe('array merge', function() {
  it('should merge diffs', function() {
    testData.forEach(function(each) {
      var result = merge(each.diffs)
      assert.deepEqual(result, each.diffsMerged)
    })
  })
  it('should test commutative conflict resolution', function() {
    var changes1 = new Result({
      "insert":[[1,[6]],[3,[7]],[0,[8]]],
      "move":[
        [[1,[0,1]],[4,[3,1]]],
        [[2,[0,1]],[4,[3,1]]],
        [[4,[3,1]]]
      ],
      conflict: true
    })
    var changes2 = new Result({
      "insert":[[1,[6]],[3,[7]],[0,[8]]],
      "move":[
        [[4,[3,1]]],
        [[2,[0,1]],[4,[3,1]]],
        [[1,[0,1]],[4,[3,1]]]
      ],
      conflict: true
    })
    var expected = {
      "insert":[[1,[6]],[3,[7]],[0,[8]]],
      "move": [[1,[0,1]],[4,[3,1]]]
    }
    var resolvedResult1 = changes1.resolveConflicts()
    var resolvedResult2 = changes2.resolveConflicts()
    assert.deepEqual(resolvedResult1, expected)
    assert.deepEqual(resolvedResult1, resolvedResult2)
  })
})
