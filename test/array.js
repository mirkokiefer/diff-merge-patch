
var assert = require('assert')

var testDiff = function(diff, testData) { return function() {
  testData.forEach(function(each, j) {
    each.after.forEach(function(eachAfter, i) {
      it('should find the position diff at ' + j + '.' + i, function() {
        var result = diff(each.before, eachAfter)
        assert.deepEqual(result, each.diffs[i])
      })
    })
  })
}}

var testMerge = function(merge, testData) { return function() {
  testData.forEach(function(each, i) {
    it('should merge the diffs at ' + i, function() {
      var result = merge([each.diffs[0], each.diffs[1]])
      assert.deepEqual(result, each.diffsMerged)
    })
  })
  var Result = merge.Result
  testData.forEach(function(each, i) {
    if (each.diffsMergedResolved) {
      it('should test conflict resolution at ' + i, function() {
        var diff = new Result(each.diffsMerged.diff, each.diffsMerged.conflict)
        var resolved = diff.resolveConflicts()
        assert.deepEqual(resolved, each.diffsMergedResolved)
      })
    }
  })
}}

var testPatch = function(patch, testData) { return function() {
  testData.forEach(function(each, i) {
    each.diffs.forEach(function(diff, j) {
      it('should patch an array using a diff at ' + i + '.' + j, function() {
        var result = patch(each.before, diff)
        assert.deepEqual(result, each.after[j])
      })
    })
  })
}}

var test = function(module, testData) {
  describe('diff', testDiff(module.diff, testData))
  describe('merge', testMerge(module.merge, testData))
  describe('patch', testPatch(module.patch, testData))
}

describe('array', function() {
  test(require('../lib/index').array, require('./test-data/array'))
})
