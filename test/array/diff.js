
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
  /*it('should do a non-set diff', function() {
    var diff = require('../../lib/index').array.diff({unique:false})

    var before = 'this is just a test sentece - let\'s see how it works.'
    var after = 'Hi! This is just a test sentence - let\'s see if it works.'

    var beforeWords = before.split(' ')
    var afterWords = after.split(' ')
    var expected = {
      delete: [[0,1],[5,1],[9,1]],
      insert: [[0,["Hi!","This"]],[5,["sentence"]],[9,["if"]]]
    }

    var result = diff(beforeWords, afterWords)
    assert.deepEqual(result, expected)

    var beforeChars = before.split('')
    var afterChars = after.split('')
    var expected = {
      delete: [[0,1], [40,3]],
      insert:[
        [0,["H","i","!"," ","T"]],
        [24,["n"]],
        [42,["i","f"]]
      ]
    }

    var result = diff(beforeChars, afterChars)
    assert.deepEqual(result, expected)
  })*/
})

