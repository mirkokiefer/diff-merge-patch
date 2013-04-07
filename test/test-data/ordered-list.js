
module.exports = [
  {
    before: [1, 2, 3, 4],
    after: [
      [1, 2, 4, 5, 7],
      [6, 1, 2, 3, 4, 7]
    ],
    diffs: [
      [
        {op: '-', length: 1, indexBefore: 1, indexAfter: 1},
        {op: '+', indexBefore: 3, indexAfter: 2, values: [5, 7]}
      ], [
        {op: '+', indexBefore: -1, indexAfter: -1, values: [6]},
        {op: '+', indexBefore: 3, indexAfter: 4, values: [7]}
      ]
    ],
    diffsMerged: [
      {op: '+', indexBefore: -1, values: [6], source: [1]},
      {op: '-', length: 1, indexBefore: 1, source: [0]},
      {op: '+', indexBefore: 3, values: [5, 7], source: [0]},
      {op: '+', indexBefore: 3, values: [7], source: [1]}
    ],
    result: [6, 1, 2, 4, 5, 7, 7]
  }, {
    before: [1, 2, 3, 4, 5, 6, 7, 8],
    after: [
      [5, 6, 1, 2, 3, 9, 10, 6, 7, 11, 8],
      [1, 2, 9, 7, 8]
    ],
    diffs: [
      [
        {op: '+', indexBefore: -1, indexAfter: -1, values: [5, 6]},
        {op: '-', indexBefore: 2, indexAfter: 4, length: 2},
        {op: '+', indexBefore: 4, indexAfter: 4, values: [9, 10]},
        {op: '+', indexBefore: 6, indexAfter: 8, values: [11]}
      ], [
        {op: '-', indexBefore: 1, indexAfter: 1, length: 4},
        {op: '+', indexBefore: 5, indexAfter: 1, values: [9]}
      ]
    ],
    diffsMerged: [
      {op: '+', indexBefore: -1,  values: [5, 6], source: [0]},
      {op: '-', indexBefore: 1, length: 1, source: [1]},
      {op: '-', indexBefore: 2, length: 2, source: [0, 1]},
      {op: '-', indexBefore: 4, length: 1, source: [1]},
      {op: '+', indexBefore: 4, values: [9, 10], source: [0]},
      {op: '+', indexBefore: 5, values: [9], source: [1]},
      {op: '+', indexBefore: 6, values: [11], source: [0]}
    ]
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