
module.exports = [
  {
    before: {1: 1, 2: 2, 3: 3, 4: 4},
    after: [
      {5: 6, 3: 8, 2: 2, 4: 4, 1: 5},
      {2: 2, 1: 9, 4: 5}
    ],
    diffs: [
      {
        diff: {5: {value: 6}, 1: {value: 5}, 3: {value: 8}}
      }, {
        diff: {1: {value: 9}, 4: {value: 5}, 3: {value: null}}
      }
    ],
    diffsMerged: {
      diff: {
        1: [{value: 5, source: [0]}, {value: 9, source: [1]}],
        3: [{value: 8, source: [0]}, {value: null, source: [1]}],
        4: {value: 5, source: [1]},
        5: {value: 6, source: [0]}
      },
      conflict: [1, 3]
    }
  }, {
    before: {0: 1, 2: 2},
    after: [
      {0: 3, 2: 4, 3: 4},
      {0: 3, 2: 3}
    ],
    diffs: [
      { diff: {0: {value: 3}, 2: {value: 4}, 3: {value: 4}} },
      { diff: {0: {value: 3}, 2: {value: 3}} }
    ],
    diffsMerged: {
      diff: {
        0: {value: 3, source: [0, 1]},
        2: [{value: 4, source: [0]}, {value: 3, source: [1]}],
        3: {value: 4, source: [0]}
      },
      conflict: [2]
    }
  }
]
