
var assert = require('assert')

var testDiff = function(diff, testData) { return function() {
  testData.forEach(function(each, j) {
    each.after.forEach(function(eachAfter, i) {
      it('should find the position diff at ' + j + '.' + i, function() {
        var result = diff(each.before, eachAfter)
        // why does this sometimes not work without stringify?? :
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
    if (each.result) {
      it('should patch an array using the merged diffs at ' + i, function() {
        var result = patch(each.before, each.diffsMergedResolved)
        assert.deepEqual(result, each.result)
      })
    }
  })
}}

var test = function(module, testData) { return function() {
  describe('diff', testDiff(module.diff, testData))
  describe('merge', testMerge(module.merge, testData))
  describe('patch', testPatch(module.patch, testData))
}}

describe('set', test(require('../lib/index').set, require('./test-data/set')))

describe('ordered-list', test(require('../lib/index').orderedList, require('./test-data/ordered-list')))

describe('ordered-set', test(require('../lib/index').orderedSet, require('./test-data/ordered-set')))

describe('object', test(require('../lib/index').object, require('./test-data/object')))

