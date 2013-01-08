
module.exports = [
  {
    before: {1: 1, 2: 2, 3: 3, 4: 4},
    after: [
      {5: 6, 3: 8, 2: 2, 4: 4, 1: 5},
      {2: 2, 1: 9, 4: 5}
    ],
    diffs: [
      {
        diff: {5: 6, 1: 5, 3: 8}
      }, {
        diff: {1: 9, 4: 5, 3: null}
      }
    ],
    diffsMerged: {
      diff: {1: [5, 9], 3: [8, null], 4: 5, 5: 6},
      conflict: [1, 3]
    }
  }
]
