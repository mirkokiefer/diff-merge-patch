
var assert = require('assert')
var diff = require('../../lib/index').collection.diff
var Result = diff.Result
var testData = require('./test-data')

describe('collection diff', function() {
  it('should find all added and deleted values', function() {
    testData.forEach(function(each) {
      each.after.forEach(function(eachAfter, i) {
        var result = diff(each.before, eachAfter)
        assert.deepEqual(result, each.diffs[i])        
      })
    })
  })
})