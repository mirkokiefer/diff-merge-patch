
var assert = require('assert')
var diff = require('../../lib/index').array.diff({unique:true})
var testData = require('./test-data')

describe('array diff', function() {
  it('should find the position diff', function() {
    testData.forEach(function(each, j) {
      each.after.forEach(function(eachAfter, i) {
        var result = diff(each.before, eachAfter)
        assert.deepEqual(result, each.diffs[i])
      })
    })
  })
})

