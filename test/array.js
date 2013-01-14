
var assert = require('assert')
var array = require('../lib/index').array
var diff = array.diff({unique: true})
var merge = array.merge
var Result = merge.Result
var patch = array.patch

var testData = require('./test-data/array')

describe('array', function() {

  describe('diff', function() {
    testData.forEach(function(each, j) {
      each.after.forEach(function(eachAfter, i) {
        it('should find the position diff at ' + j + '.' + i, function() {
          var result = diff(each.before, eachAfter)
          assert.deepEqual(result, each.diffs[i])
        })
      })
    })
  })

  describe('merge', function() {
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

  describe('patch', function() {
    testData.forEach(function(each, i) {
      each.diffs.forEach(function(diff, j) {
        it('should patch an array using a diff at ' + i + '.' + j, function() {
          var result = patch(each.before, diff)
          assert.deepEqual(result, each.after[j])
        })
      })
    })
  })

})