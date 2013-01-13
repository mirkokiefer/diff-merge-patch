
module.exports = [
  {
    before: [1, 2, 3, 3, 4, 8],
    after: [
      [1,2,4,8,5,6,6],
      [1, 2, 3, 3, 4, 9]
    ],
    diffs: [
      {insert: [{value: 5}, {value: 6}, {value: 6}], delete: [{index: 2}, {index: 3}]},
      {insert: [{value: 9}], delete: [{index: 5}]}
    ],
    diffsMerged: {
      insert: [{value: 5, source: [0]}, {value: 6, source: [0]}, {value: 6, source: [0]}, {value: 9, source: [1]}],
      delete: [{index: 2, source: [0]}, {index: 3, source: [0]}, {index: 5, source: [1]}]
    }
  }, {
    before: [1,2,3,3,4],
    after: [
      [1,2,4,5],
      [1,2,3]
    ],
    diffs: [
      {
        insert: [ {value: 5} ], delete: [ {index: 2}, {index: 3} ]
      }, {
        delete: [ {index: 3}, {index: 4} ]
      }
    ],
    diffsMerged: {
      insert: [{value: 5, source: [0]}],
      delete: [{value: 2, source: [0]}, {value: 3, source: [0, 1]}, {value: 4, source: [1]}]
    }
  }
]