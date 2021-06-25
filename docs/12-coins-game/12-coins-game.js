/**
 * Created by michiru on 2/7/16.
 */

 var arrayIsEqual = function (arrayA, arrayB) {
    // if the other array is a falsy value, return
    if (!arrayA || !arrayB)
        return false;

    // compare lengths - can save a lot of time
    if (arrayA.length != arrayB.length)
        return false;

    for (var i = 0, l = arrayA.length; i < l; i++) {
        // Check if we have nested arrays
        if (arrayA[i] instanceof Array && arrayB[i] instanceof Array) {
            // recurse into the nested arrays
            if (!arrayIsEqual(arrayA[i], arrayB[i]))
                return false;
        } else if (arrayA[i] != arrayB[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};

//console.log(arrayIsEqual([12], [12]));

var splitOne = function (num) {
    if (!num || num < 1)
        return -1;

    if (num == 1)
        return [[]];

    if (num == 2)
        return [[1]];

    var res = [[num - 1]];
    for (var i = 1; i < num / 2; i++) {
        res.push([i, (num - i - 1)]);
    }
    return res;
}

//console.log(splitOne(4));

var splitTwo = function (num) {
    if (!num || num < 2)
        return -1;

    if (num == 2)
        return [[]];

    if (num == 3)
        return [[1]];

    var res = [[num - 2]];
    for (var i = 1; i < (num - 1) / 2; i++) {
        res.push([i, (num - i - 2)]);
    }
    return res;
}

//console.log(splitTwo(6));

var listNext = function (board) {
    var res = [];
    for (var i = 0; i < board.length; i++) {
        if (board[i] >= 1) {
            var n = splitOne(board[i]);
            for (var j = 0; j< n.length; j ++) {
                var temp = board.slice();
                temp.splice(i, 1);
                res.push(temp.concat(n[j]));
            }
        }
        if (board[i] >= 2) {
            var n = splitTwo(board[i]);
            for (var j = 0; j< n.length; j ++) {
                var temp = board.slice();
                temp.splice(i, 1);
                res.push(temp.concat(n[j]));
            }
        }
    }
    return res;
}

//console.log(listNext([12]));

var compareNum = function(a, b){
    if (a < b)
        return -1;

    if (a > b)
        return 1;

    return 0;
}

var compareBoard = function (boardA, boardB) {
    if (boardA.length < boardB.length)
        return -1;

    if (boardA.length > boardB.length)
        return 1;

    for (var i = 0; i < boardA.length; i++) {
        if (boardA[i] < boardB[i])
            return -1;

        if (boardA[i] > boardB[i])
            return 1;
    }

    return 0;
}

//console.log(compare([1, 2, 5], [1, 2, 3]));

var sort = function (boards) {
    var temp = [];
    var res = [];

    for (var i = 0; i < boards.length; i++) {
        temp.push(boards[i].sort(compareNum));
    }

    temp = temp.sort(compareBoard);

    for (var i = 0; i < temp.length; i ++) {
        if (i == 0)
            res.push(temp[i]);
        else
            if (compareBoard(temp[i], temp[i-1]) != 0)
                res.push(temp[i]);
    }

    return res;
}

var listNextSorted = function (board) {
    return sort(listNext(board));
}

var lut = {};

lut[[]] = 1;

var solve = function (board) {

    if (lut.hasOwnProperty(board))
        return lut[board];

    //if (compareBoard(board, []) == 0)
    //    return 1;

    var nexts = listNextSorted(board);

    for (var i = 0; i < nexts.length; i++) {
        if (solve(nexts[i]) == 0) {
            console.log("solve board ", board.toString(), " is 1");
            console.log("way > ", nexts[i].toString());
            lut[board] = 1;
            return 1;
        }
    }

    console.log("solve board ", board.toString(), "is 0");
    lut[board] = 0;
    return 0;
}

var f = solve;
