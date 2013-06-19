
var assert = require('assert')
var merge = require('../lib/index').dictionary.merge
var Result = merge.Result
var testData = require('./test-data/dictionary')

describe('dictionary merging', function() {
  it('should test an n-way merge', function() {
    var diffs = testData[0].diffs
    var diff3 = { diff: { '2': {value: 3}, '3': {value: null}, '4': {value: 6}, '7': {value: 9} } }
    var expected = {
      diff: {
        1: [{value: 5, source: [0]}, {value: 9, source: [1]}],
        2: {value: 3, source: [2]},
        3: [{value: 8, source: [0]}, {value: null, source: [1, 2]}],
        4: [{value: 5, source: [1]}, {value: 6, source: [2]}],
        5: {value: 6, source: [0]},
        7: {value: 9, source: [2]}
      },
      conflict: [1, 3, 4]
    }
    var result = merge(diffs.concat(diff3))
    assert.deepEqual(result, expected)
  })
})
