
module.exports = [
  {
    before: [1, 2, 3, 4],
    after: [
      [1, 2, 4, 5, 6],
      [1, 2, 3, 4, 5, 7]
    ],
    diffs: [
      {diff: [{delete: 3}, {insert: 5}, {insert: 6}]},
      {diff: [{insert: 5}, {insert: 7}]}
    ],
    diffsMerged: {
      diff: [
        {delete: 3, source: [0]},
        {insert: 5, source: [0, 1]}, {insert: 6, source: [0]}, {insert: 7, source: [1]}
      ]
    }
  }
]