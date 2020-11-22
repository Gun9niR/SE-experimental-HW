function getRandomStartNEnd(index) {
    do {
        start[index].x = parseInt(Math.random() * cols);
        start[index].y = parseInt(Math.random() * rows);;
        end[index].x = parseInt(Math.random() * cols);;
        end[index].y = parseInt(Math.random() * rows);;
    } while(mazes[index][start[index].x][start[index].y] || mazes[index][end[index].x][end[index].y]);
}

function resetIterations() {
    for(var i = 0; i < count; i++) {
        iterations[i] = 0;
    }
}

function manhattanDist(p1, p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

function getH(p1, p2) {
    return Math.pow(manhattanDist(p1, p2), 2);
}

function drawMaze(index) {
    for( var i = 0; i < cols; i++ ) {
        for( var j = 0; j < rows; j++ ) {
            switch( mazes[index][i][j] ) {
                case 0: ctxs[index].fillStyle = "black"; break;
                case 1: ctxs[index].fillStyle = "gray"; break;
                case 2: ctxs[index].fillStyle = "red"; break;
                case 3: ctxs[index].fillStyle = "yellow"; break;
                case 4: ctxs[index].fillStyle = "#500000"; break;
                case 5: ctxs[index].fillStyle = "purple"; break;
                case 8: ctxs[index].fillStyle = "blue"; break;
                case 9: ctxs[index].fillStyle = "gold"; break;
            }
            ctxs[index].fillRect( grid * i, grid * j, grid, grid  );
        }
    }
}

function createArray( c, r ) {
    var m = new Array( count );
    for( var i = 0; i < count; i++ ) {
        m[i] = new Array( c );
        for( var j = 0; j < c; j++ ) {
            m[i][j] = new Array(r);
            for(var k = 0; k < r; k++) {
                m[i][j][k] = 1;
            }
        }
    }
    return m;
}

function incrLabel(index, test) {
    var timeElapsed = performance.now() - startTime;
    timeElapsed = (timeElapsed / 1000).toFixed(2);
    iterations[index]++;
    if(test == false) {
        document.getElementById("timer" + (index + 1)).innerHTML = "Time: " + timeElapsed + "s    Iterations:" + " " + iterations[index];
    } else {
        document.getElementById("timer" + (index + 1)).innerHTML = "Time: " + timeElapsed + "s    Iterations:" + " " + iterations[index] + " Total iterations: " + totalIterations[index];
    }
}

function resetNDisplayLabel(index) {
    document.getElementById("timer" + (index + 1)).innerHTML = "Time: 0.00s    Iterations: 0";
}

function incrFinished() {
    finished++;
    if(finished == count) {
        $("#btnInterrupt").prop("class", "nav-link disabled");
        $("#btnClear, #btnCreateMaze").prop("class", "nav-link");
        $("#testDropDown").prop("class", "nav-link dropdown-toggle");
        finished = 0;
    }
}

function interrupt() {
    interrupted++;
    if(interrupted == count || testingTime) {
        $("#btnInterrupt").prop("class", "nav-link disabled");
        $("#btnClear, #btnCreateMaze").prop("class", "nav-link");
        $("#testDropDown").prop("class", "nav-link dropdown-toggle");
        interrupted = 0;
        finished = 0;
        isInterrupting = false;
    }
    testingTime = false;
}

function initAstar(index) {
    pq = new PriorityQueue();
    pq.enqueue({x: start[index].x, y: start[index].y, g: 0, f: getH(start[index], end[index])});
    prev = new Array(cols);
    for(let i = 0; i < prev.length; i++) {
        prev[i] = new Array(rows);
        for(let j = 0; j < prev.length; j++) {
            prev[i] = {x: -1, y: -1};
        }
    }
    prev[start[index].x][start[index].y] = {x: start[index].x, y: start[index].y};
}