
module.exports = [
  {
    before: [1, 2, 3, 3, 4, 8],
    after: [
      [1,2,4,8,5,6,6],
      [1, 2, 3, 3, 4, 9]
    ],
    diffs: [
      {insert: [5, 6, 6], delete: [2, 3]},
      {insert: [9], delete: [5]}
    ],
    diffsMerged: {
      insert: [5, 6, 6, 9],
      delete: [2, 3, 5]
    }
  }, {
    before: [1,2,3,3,4],
    after: [
      [1,2,4,5],
      [1,2,3]
    ],
    diffs: [
      {
        insert: [ 5 ], delete: [ 2, 3 ]
      }, {
        delete: [ 3, 4 ]
      }
    ],
    diffsMerged: {
      insert: [5],
      delete: [2, 3, 4]
    }
  }
]