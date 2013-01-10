
module.exports = [
  {
    before: [1, 2],
    after: [
      [2, 1, 3],
      [1, 2, 4]
    ],
    diffs: [{
      diff: { 1: [{move: 0}, {insert: 3}]}
    }, {
      diff: { 1: [{insert: 4}] }
    }],
    diffsMerged: {
      diff: {
        1: [{move: 0, source: [0]}, {insert: 3, source: [0]}, {insert: 4, source: [1]}]
      }
    }
  }, {
    before: [1, 2, 3, 4, 5, 6, 7],
    after: [
      [1, 2, 7, 3, 4, 5, 6],
      [1, 6, 2, 3, 4, 5, 7]
    ],
    diffs: [{
      diff: {1: [{move: 6}]}
    }, {
      diff: {0: [{move: 5}]}
    }],
    diffsMerged: {
      diff: {
        0: [{move: 5, source: [1]}],
        1: [{move: 6, source: [0]}]
      }
    }
  }/*, {
    before: [1, 2, 3, 4, 5],
    after: [
      [1, 6, 2, 3, 5, 4],
      [1, 2, 3, 4, 7, 5]
    ],
    diffs: [
      {
        insert: [[0,[6]]],
        move: [[4,[3, 1]]]
      }, {
        insert: [ [ 3, [7] ] ]
      }
    ],
    diffsMerged: {"move":[[4,[3,1]]],"insert":[[0,[6]],[3,[7]]]}
  }, {
    before: [1, 2, 3, 4, 5],
    after: [
      [2, 6, 1, 3, 5, 4],
      [2, 3, 1, 4, 7, 5]
    ],
    diffs: [
      {"insert":[[1,[6]]],"move":[[1,[0,1]],[4,[3,1]]]},
      {"insert":[[3,[7]]],"move":[[2,[0,1]]]}
    ],
    diffsMerged: {
      conflict: true,
      insert: [[1,[6]],[3,[7]]],
      move: [
        [[1,[0,1]],[4,[3,1]]],
        [[2,[0,1]],[4,[3,1]]]
      ]
    }
  }*/, {
    before: [1, 2, 3, 4, 5],
    after: [
      [2, 6, 1, 5, 4, 3],
      [2, 4, 1, 7, 3, 5]
    ],
    diffs: [
      {
        diff: {
          3: [{insert: 6}, {move: 0}],
          4: [{move: 3}, {move: 2}]
        }
      }, {
        diff: {
          3: [{move: 0}, {insert: 7}, {move: 2}]
        }
      }
    ],
    diffsMerged: {
      diff: {
        3: [{insert: 6, source: [0]}, {move: 0, source: [0, 1]}, {move: 2, conflict: 0, source: [1]}],
        4: [{move: 3, source: [0]}, {move: 2, conflict: 0, source: [0]}]
      },
      conflict: true
    }
  }/*, {
    //test deletes:
    before: [1, 2, 3, 4, 5],
    after: [
      [1, 2, 5, 4],
      [2, 3, 1, 4, 5]
    ],
    diffs: [
      {"delete":[[2,1]],"move":[[4,[3,1]]]},
      {"move":[[2,[0,1]]]}
    ],
    diffsMerged: {"move":[[2,[0,1]],[4,[3,1]]],"delete":[[2,1]]}
  }, {
    // test delete conflicts:
    before: [1, 2, 3, 4, 5],
    after: [
      [1, 2, 3, 4],
      [5, 1, 2, 3, 4]
    ],
    diffs: [
      {"delete":[[4,1]]},
      {"move":[[-1,[4,1]]]}
    ],
    diffsMerged: {"conflict":true, "move":[[],[[-1,[4,1]]]],"delete":[[[4,1]],[]]}
  }, {
    before: [1, 2, 3, 4, 5, 6],
    after: [
      [1, 2, 3, 6, 4, 5],
      [4, 5, 6, 1, 2, 3],
      [4, 5, 3, 1, 2, 6]
    ],
    diffs: [
      {
        move: [ [ 2, [5, 1] ] ]
      }, {
        move: [ [ 5, [0, 3] ] ]
      }, {
        move: [[4,[2,1]],[4,[0,1]],[4,[1,1]]]
      }
    ],
    diffsMerged: {
      "move":[
        [[2,[5,1]]],
        [[5,[0,3]],[2,[5,1]]],
        [[4,[2,1]],[4,[0,2]],[2,[5,1]]]
      ],
      "conflict":true
    }
  }, {
    before: [1, 2, 3, 4, 5],
    after: [
      [2, 6, 1, 3, 5, 4],
      [2, 3, 1, 4, 7, 5],
      [1, 2, 3, 4, 5],
      [1, 8, 2, 3, 4, 5]
    ],
    diffs: [
      {"insert":[[1,[6]]],"move":[[1,[0,1]],[4,[3,1]]]},
      {"insert":[[3,[7]]],"move":[[2,[0,1]]]},
      {},
      {"insert":[[0,[8]]]}
    ],
    diffsMerged: {
      "conflict":true,
      "insert":[[1,[6]],[3,[7]],[0,[8]]],
      "move":[
        [[1,[0,1]],[4,[3,1]]],
        [[2,[0,1]],[4,[3,1]]],
        [[4,[3,1]]],
        [[4,[3,1]]]
      ]
    }
  }*/
]
