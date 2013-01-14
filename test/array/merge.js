
var assert = require('assert')
var diff = require('../../lib/index').array.diff({unique:true})
var merge = require('../../lib/index').array.merge
var Result = merge.Result
var testData = require('./test-data')

describe('array merge', function() {
  testData.forEach(function(each, i) {
    it('should merge the diffs at ' + i, function() {
      var result = merge(each.diffs[0], each.diffs[1])
      assert.deepEqual(result, each.diffsMerged)
    })
  })
  testData.forEach(function(each, i) {
    if (each.diffsMergedResolved) {
      it('should test conflict resolution at ' + i, function() {
        var diff = new Result(each.diffsMerged.diff, each.diffsMerged.conflict)
        var resolved = diff.resolveConflicts()
        assert.deepEqual(resolved, each.diffsMergedResolved)
      })
    }
  })
})
