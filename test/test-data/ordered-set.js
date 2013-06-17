
module.exports = [
  {
    before: [1, 2],
    after: [
      [2, 1, 3],
      [1, 2, 4]
    ],
    diffs: [{
      diff: [ [1, [{move: 0}, {insert: 3}]] ]
    }, {
      diff: [ [1, [{insert: 4}] ] ]
    }],
    diffsMerged: {
      diff: [
        [1, [{move: 0, source: [0]}, {insert: 3, source: [0]}, {insert: 4, source: [1]}]]
      ]
    }
  }, {
    before: [1, 2, 3, 4, 5, 6, 7],
    after: [
      [1, 2, 7, 3, 4, 5, 6],
      [1, 6, 2, 3, 4, 5, 7]
    ],
    diffs: [{
      diff: [ [1, [{move: 6}]] ]
    }, {
      diff: [ [0, [{move: 5}]] ]
    }],
    diffsMerged: {
      diff: [
        [0, [{move: 5, source: [1]}] ],
        [1, [{move: 6, source: [0]}] ]
      ]
    }
  }, {
    before: [1, 2, 3, 4, 5],
    after: [
      [2, 6, 1, 5, 4, 3],
      [2, 4, 1, 7, 3, 5]
    ],
    diffs: [
      {
        diff: [
          [3, [{insert: 6}, {move: 0}]],
          [4, [{move: 3}, {move: 2}]]
        ]
      }, {
        diff: [
          [3, [{move: 0}, {insert: 7}, {move: 2}]]
        ]
      }
    ],
    diffsMerged: {
      diff: [
        [3, [{insert: 6, source: [0]}, {move: 0, source: [0, 1]}, {insert: 7, source: [1]}, {move: 2, conflict: 1, source: [1]}]],
        [4, [{move: 3, source: [0]}, {move: 2, conflict: 1, source: [0]}]]
      ],
      conflict: 1
    },
    diffsMergedResolved: {
      diff: [
        [3, [{insert: 6, source: [0]}, {move: 0, source: [0, 1]}, {insert: 7, source: [1]}]],
        [4, [{move: 3, source: [0]}, {move: 2, source: [0]}]]
      ]
    },
    result: [2,6,1,7,5,4,3]
  }, {
    //test deletes:
    before: [1, 2, 3, 4, 5],
    after: [
      [1, 2, 5, 4],
      [2, 3, 1, 4, 5]
    ],
    diffs: [
      {
        diff: [
          [null, [{move: 2}]],
          [4, [{move: 3}]]
        ]
      }, {
        diff: [[2, [{move: 0}]]]
      }
    ],
    diffsMerged: {
      diff: [
        [null, [{move: 2, source: [0]}]],
        [2, [{move: 0, source: [1]}]],
        [4, [{move: 3, source: [0]}]]
      ]
    }
  }, {
    // test delete conflicts:
    before: [1, 2, 3, 4, 5],
    after: [
      [1, 2, 3, 4],
      [5, 1, 2, 3, 4]
    ],
    diffs: [
      {
        diff: [
          [null, [{move: 4}]]
        ]
      }, {
        diff: [
          [-1, [{move: 4}]]
        ]
      }
    ],
    diffsMerged: {
      diff: [
        [-1, [{move: 4, conflict: 1, source: [1]}]],
        [null, [{move: 4, conflict: 1, source: [0]}]]
      ],
      conflict: 1
    },
    diffsMergedResolved: {
      diff: [
        [null, [{move: 4, source: [0]}]]
      ]
    }
  }
]
