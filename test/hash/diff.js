
var assert = require('assert')
var diff = require('../../lib/index').hash.diff
var Result = diff.Result
var testData = require('./test-data')

describe('key-value collection diff', function() {
  it('should find all added/deleted keys + value changes', function() {
    testData.forEach(function(each) {
      each.after.forEach(function(eachAfter, i) {
        var result = diff(each.before, eachAfter)
        assert.deepEqual(result, each.diffs[i])
      })
    })
  })
})
