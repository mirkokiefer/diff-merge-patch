
var assert = require('assert')
var diff = require('../../lib/index').object.diff
var Result = diff.Result
var testData = require('./test-data')

describe('object diff', function() {
  it('should find all changes', function() {
    testData.forEach(function(each) {
      each.after.forEach(function(eachAfter, i) {
        var result = diff(each.before, eachAfter)
        assert.deepEqual(result, each.diffs[i])
      })
    })
  })
})
