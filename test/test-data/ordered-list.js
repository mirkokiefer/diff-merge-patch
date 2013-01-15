
module.exports = [
  {
    before: [1, 2, 3, 4],
    after: [
      [1, 2, 4, 5, 7],
      [6, 1, 2, 3, 4, 7]
    ],
    diffs: [
      {
        insert: [
          [3, [{values: [5, 7]}]],
        ],
        delete: [{index: 2}]
      }, {
        insert: [
          [-1, [{values: [6]}]],
          [3, [{values: [7]}]]
        ]
      }
    ],
    diffsMerged: {
      insert: [
        [-1, [{values: [6], source: 1}]],
        [3, [{values: [5, 7], source: 0}, {values: [7], source: 1}]]
      ],
      delete: [{index: 2, source: [0]}]
    }
  }, {
    before: [1, 2, 3, 4, 5],
    after: [
      [2, 6, 1, 5, 4, 3],
      [2, 4, 1, 7, 3, 5]
    ],
    diffs: [
      {
        "insert":[
          [3, [{"values": [6,1]}]],
          [4, [{"values": [4,3]}]]
        ],
        "delete": [{"index": 0},{"index": 2},{"index": 3}]
      }, {
        "insert": [
          [3, [{"values":[1, 7, 3]}]]
        ],
        "delete": [{"index":0}, {"index":2}]
      }
    ],
    diffsMerged: {
      "insert":[
        [3,[{"values":[6,1],"source":0},{"values":[1,7,3],"source":1}]],
        [4,[{"values":[4,3],"source":0}]]
      ],
      "delete":[{"index":0,"source":[0,1]},{"index":2,"source":[0,1]},{"index":3,"source":[0]}]
    }
  }
]

/*
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
*/