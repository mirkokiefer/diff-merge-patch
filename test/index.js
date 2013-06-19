
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
        var result = patch(each.before, each.diffsMergedResolved || each.diffsMerged)
        assert.deepEqual(result, each.result)
      })
    }
  })
}}

var testResolve = function(resolve, testData) { return function() {
  testData.forEach(function(each, i) {
    if (each.diffsMergedResolved) {
      it('should resolve the conflicts in a merged diff at ' + i, function() {
        var result = resolve(each.diffsMerged, each.resolvePicking)
        assert.deepEqual(result, each.diffsMergedResolved)
      })
    }
  })
}}

var test = function(module, testData) { return function() {
  describe('diff', testDiff(module.diff, testData))
  describe('merge', testMerge(module.merge, testData))
  describe('patch', testPatch(module.patch, testData))
  describe('resolve', testResolve(module.resolve, testData))
}}

describe('set', test(require('../lib/index').set, require('./test-data/set')))

describe('ordered-list', test(require('../lib/index').orderedList, require('./test-data/ordered-list')))

describe('ordered-set', test(require('../lib/index').orderedSet, require('./test-data/ordered-set')))

describe('dictionary', test(require('../lib/index').dictionary, require('./test-data/dictionary')))

