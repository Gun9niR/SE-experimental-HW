var ctxs, wid, hei, cols, rows, mazes, stacks = [], start = [], end = [],grid = 8, padding = 16, s, density=0.5, count=4;
var startTime;
var finished = 0;
var isInterrupting;
var interrupted = 0;
var prev;
var pq;
var iterations = [];
const testTime = 100;
var totalIterations;

class PriorityQueue {
    constructor() {
        this.pq = [0];
    }

    enqueue(k) {
        this.pq.push(k);
        this.swim(this.pq.length - 1);
    }

    dequeue() {
        var min = this.pq[1];
        this.pq[1] = this.pq[this.pq.length - 1];
        this.pq.pop();
        this.sink(1);
        return min;
    }

    sink(k) {
        while((k << 1) <= this.pq.length - 1) {
            var j = k << 1;
            if(j < this.pq.length - 1 && this.pq[j + 1].f < this.pq[j].f) j++;
            if(this.pq[k].f < this.pq[j].f) break;

            var t = this.pq[k];
            this.pq[k] = this.pq[j];
            this.pq[j] = t;
            k = j;
        }
    }

    swim(k) {
        while(k > 1 && this.pq[k].f < this.pq[k >> 1].f) {
            var t = this.pq[k];
            this.pq[k] = this.pq[k >> 1];
            this.pq[k >> 1] = t;
            k = k >> 1;
        }
    }

    isEmpty() {
        return this.pq.length == 1;
    }
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
            // first two parameters: top-left point
            // next two: width and height
            ctxs[index].fillRect( grid * i, grid * j, grid, grid  );
        }
    }
}

// unused function
function drawBlock(ctx, sx, sy, a) {
    switch( a ) {
        case 0: ctx.fillStyle = "black"; break;
        case 1: ctx.fillStyle = "gray"; break;
        case 2: ctx.fillStyle = "red"; break;
        case 3: ctx.fillStyle = "yellow"; break;
        case 4: ctx.fillStyle = "#500000"; break;
        case 8: ctx.fillStyle = "blue"; break;
        case 9: ctxs[index].fillStyle = "gold"; break;
    }
    ctx.fillRect( grid * sx, grid * sy, grid, grid  );
}

// used in solving
function getFNeighbours( index, sx, sy, a ) {
    // return all the points available
    // a==0: return road or end point
    var n = [];
    if( sx - 1 > 0 && mazes[index][sx - 1][sy] % 8 == a ) {
        n.push( { x:sx - 1, y:sy } );
    }
    if( sx + 1 < cols - 1 && mazes[index][sx + 1][sy] % 8 == a ) {
        n.push( { x:sx + 1, y:sy } );
    }
    if( sy - 1 > 0 && mazes[index][sx][sy - 1] % 8 == a ) {
        n.push( { x:sx, y:sy - 1 } );
    }
    if( sy + 1 < rows - 1 && mazes[index][sx][sy + 1] % 8 == a ) {
        n.push( { x:sx, y:sy + 1 } );
    }
    return n;
}

function getFNeighbours2( index, sx, sy, a ) {
    // return all the points available
    // a==0: return road or end point
    var n = [];
    if( sx > 0 && mazes[index][sx - 1][sy] % 8 == a ) {
        n.push( { x:sx - 1, y:sy } );
    }
    if( sx < cols - 1 && mazes[index][sx + 1][sy] % 8 == a ) {
        n.push( { x:sx + 1, y:sy } );
    }
    if( sy > 0 && mazes[index][sx][sy - 1] % 8 == a ) {
        n.push( { x:sx, y:sy - 1 } );
    }
    if( sy < rows - 1 && mazes[index][sx][sy + 1] % 8 == a ) {
        n.push( { x:sx, y:sy + 1 } );
    }
    return n;
}
// used in solving
function getFNeighboursNew(index, sx, sy, a) {

    var n = [];
    var dx = end[index].x - sx;
    var dy = end[index].y - sy;

    if(dx >= 0) {
        if(dy >= 0) {
            if(dy >= dx) {
                if(mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
                if(mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
                if(mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
                if(mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
            }
            else {
                if(mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
                if(mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
                if(mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
                if(mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
            }
        }
        else {
            if(-1 * dy >= dx) {
                if(mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
                if(mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
                if(mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
                if(mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
            }
            else {
                if(mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
                if(mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
                if(mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
                if(mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
            }
        }
    }
    else {
        if(dy < 0) {
            if(dy <= dx) {
                if(mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
                if(mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
                if(mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
                if(mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
            }
            else {
                if(mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
                if(mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
                if(mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
                if(mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
            }
        }
        else {
            if(dy >= dx * -1) {
                if(mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
                if(mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
                if(mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
                if(mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
            }
            else {
                if(mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
                if(mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
                if(mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
                if(mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
            }
        }
    }

    return n; 
}

function getFNeighboursNew2(index, sx, sy, a) {

    var n = [];
    var dx = end[index].x - sx;
    var dy = end[index].y - sy;

    if(dx >= 0) {
        if(dy >= 0) {
            if(dy >= dx) {
                if(sy + 1 < rows && mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
                if(sx + 1 < cols && mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
                if(sx > 0 && mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
                if(sy > 0 && mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
            }
            else {
                if(sx + 1 < cols && mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
                if(sy + 1 < rows && mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
                if(sy > 0 && mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
                if(sx > 0 && mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
            }
        }
        else {
            if(-1 * dy >= dx) {
                if(sy > 0 && mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
                if(sx + 1 < cols && mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
                if(sx > 0 && mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
                if(sy + 1 < rows && mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
            }
            else {
                if(sx + 1 < cols && mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
                if(sy > 0 && mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
                if(sy + 1 < rows && mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
                if(sx > 0 && mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
            }
        }
    }
    else {
        if(dy < 0) {
            if(dy <= dx) {
                if(sy > 0 && mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
                if(sx > 0 && mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
                if(sx + 1 < cols && mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
                if(sy + 1 < rows && mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
            }
            else {
                if(sx > 0 && mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
                if(sy > 0 && mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
                if(sy + 1 < rows && mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
                if(sx + 1 < cols && mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
            }
        }
        else {
            if(dy >= dx * -1) {
                if(sy + 1 < rows && mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
                if(sx > 0 && mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
                if(sx + 1 < cols && mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
                if(sy > 0 && mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
            }
            else {
                if(sx > 0 && mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
                if(sy + 1 < rows && mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
                if(sy > 0 && mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
                if(sx + 1 < cols && mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
            }
        }
    }

    return n; 
}
function euclidDist(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function insertionSort(n, dist) {
    for(var i = 1; i < n.length; i++) {
        const key = dist[i];
        const p = n[i];
        var j = i - 1;
        while(j >= 0 && dist[j] > key) {
            n[j + 1] = n[j];
            dist[j + 1] = dist[j];
            j--;
        }
        dist[j + 1] = key;
        n[j + 1] = p;
    }
    return n;
}

function getFNeighboursEuclid(index, sx, sy, a) {
    var n = [], dist = [];
    if( sx - 1 > 0 && mazes[index][sx - 1][sy] % 8 == a ) {
        n.push( { x:sx - 1, y:sy } );
        dist.push(euclidDist({x: sx - 1, y: sy}, end[index]));
    }
    if( sx + 1 < cols - 1 && mazes[index][sx + 1][sy] % 8 == a ) {
        n.push( { x:sx + 1, y:sy } );
        dist.push(euclidDist({x: sx + 1, y: sy}, end[index]));
    }
    if( sy - 1 > 0 && mazes[index][sx][sy - 1] % 8 == a ) {
        n.push( { x:sx, y:sy - 1 } );
        dist.push(euclidDist({x: sx, y: sy - 1}, end[index]));
    }
    if( sy + 1 < rows - 1 && mazes[index][sx][sy + 1] % 8 == a ) {
        n.push( { x:sx, y:sy + 1 } );
        dist.push(euclidDist({x: sx, y: sy + 1}, end[index]));
    }
    return insertionSort(n, dist);
}

function getFNeighboursEuclid2(index, sx, sy, a) {
    var n = [], dist = [];
    if( sx > 0 && mazes[index][sx - 1][sy] % 8 == a ) {
        n.push( { x:sx - 1, y:sy } );
        dist.push(euclidDist({x: sx - 1, y: sy}, end[index]));
    }
    if( sx < cols - 1 && mazes[index][sx + 1][sy] % 8 == a ) {
        n.push( { x:sx + 1, y:sy } );
        dist.push(euclidDist({x: sx + 1, y: sy}, end[index]));
    }
    if( sy > 0 && mazes[index][sx][sy - 1] % 8 == a ) {
        n.push( { x:sx, y:sy - 1 } );
        dist.push(euclidDist({x: sx, y: sy - 1}, end[index]));
    }
    if( sy < rows - 1 && mazes[index][sx][sy + 1] % 8 == a ) {
        n.push( { x:sx, y:sy + 1 } );
        dist.push(euclidDist({x: sx, y: sy + 1}, end[index]));
    }
    return insertionSort(n, dist);
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
        document.getElementById("btnClear").removeAttribute("disabled");
        document.getElementById("btnCreateMaze").removeAttribute("disabled");
        document.getElementById("btnInterrupt").setAttribute("disabled", "disabled");
        finished = 0;
    }
}
// ordinary DFS
function solveMaze1(index, test) {
    if(isInterrupting) {
        interrupt();
        return;
    }
    if( start[index].x == end[index].x && start[index].y == end[index].y) {
        if(test == false || totalIterations[index] == testTime) {
            for( var i = 0; i < cols; i++ ) {
                for( var j = 0; j < rows; j++ ) {
                    switch( mazes[index][i][j] ) {
                        case 2: mazes[index][i][j] = 3; break;
                    }
                }
            }
            drawMaze(index);
            incrFinished();
            return;
        } else {
            totalIterations[index]++;
            incrLabel(index, test);
            for(var j = 0; j < cols; j++){
                for( var k = 0; k < rows; k++) {
                    if(mazes[index][j][k] != 0 && mazes[index][j][k] != 1) {
                        mazes[index][j][k] = 0;
                    }    
                }
            }
            getRandomStartNEnd(index);
            
            mazes[index][start[index].x][start[index].y] = 9;
            mazes[index][end[index].x][end[index].y] = 8;
            drawMaze(index);
            requestAnimationFrame( function() {
                solveMaze1(index, test);
            } );
            return;
        }
    }
    
    incrLabel(index, test);

    var neighbours = getFNeighbours( index, start[index].x, start[index].y, 0 );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = 2;
    } else {
        mazes[index][start[index].x][start[index].y] = 4;
        start[index] = stacks[index].pop();
    }
    
    if(document.getElementById("chkProcess").checked) {
        drawMaze(index);
    }
    requestAnimationFrame( function() {
        solveMaze1(index, test);
    } );
}

function solveMaze2(index, test) {
    if(isInterrupting) {
        interrupt();
        return;
    }
    if( start[index].x == end[index].x && start[index].y == end[index].y) {
        if(test == false || totalIterations[index] == testTime) {
            for( var i = 0; i < cols; i++ ) {
                for( var j = 0; j < rows; j++ ) {
                    switch( mazes[index][i][j] ) {
                        case 2: mazes[index][i][j] = 3; break;
                    }
                }
            }
            drawMaze(index);
            incrFinished();
            return;
        } else {
            totalIterations[index]++;
            incrLabel(index, test);
            for(var j = 0; j < cols; j++){
                for( var k = 0; k < rows; k++) {
                    if(mazes[index][j][k] != 0 && mazes[index][j][k] != 1) {
                        mazes[index][j][k] = 0;
                    }    
                }
            }
            getRandomStartNEnd(index);
            mazes[index][start[index].x][start[index].y] = 9;
            mazes[index][end[index].x][end[index].y] = 8;
            drawMaze(index);
            requestAnimationFrame( function() {
                solveMaze2(index, test);
            } );
            return;
        }
    }
    
    incrLabel(index, test);

    var neighbours = getFNeighbours2( index, start[index].x, start[index].y, 0 );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = 2;
    } else {
        if(stacks[index].length == 0) {
            if(test == false || totalIterations[index] == testTime) {
                mazes[index][start[index].x][start[index].y] = 5;
                drawMaze(index);
                incrFinished();
                return;
            } else {
                totalIterations[index]++;
                incrLabel(index, test);
                for(var j = 0; j < cols; j++){
                    for( var k = 0; k < rows; k++) {
                        if(mazes[index][j][k] != 0 && mazes[index][j][k] != 1) {
                            mazes[index][j][k] = 0;
                        }    
                    }
                }
                getRandomStartNEnd(index);
                mazes[index][start[index].x][start[index].y] = 9;
                mazes[index][end[index].x][end[index].y] = 8;
                drawMaze(index);
                requestAnimationFrame( function() {
                    solveMaze2(index, test);
                } );
                return;
            }
        }
        mazes[index][start[index].x][start[index].y] = 4;
        start[index] = stacks[index].pop();
    }
 
    if(document.getElementById("chkProcess").checked) {
        drawMaze(index);
    }
    requestAnimationFrame( function() {
        solveMaze2(index, test);
    } );
}
// DFS, but pick the point closer to the end point first
function solveMaze1New(index, test) {
    if(isInterrupting) {
        interrupt();
        return;
    }
    if( start[index].x == end[index].x && start[index].y == end[index].y) {
        if(test == false || totalIterations[index] == testTime) {
            for( var i = 0; i < cols; i++ ) {
                for( var j = 0; j < rows; j++ ) {
                    switch( mazes[index][i][j] ) {
                        case 2: mazes[index][i][j] = 3; break;
                    }
                }
            }
            drawMaze(index);
            incrFinished();
            return;
        } else {
            totalIterations[index]++;
            incrLabel(index, test);
            for(var j = 0; j < cols; j++){
                for( var k = 0; k < rows; k++) {
                    if(mazes[index][j][k] != 0 && mazes[index][j][k] != 1) {
                        mazes[index][j][k] = 0;
                    }    
                }
            }
            getRandomStartNEnd(index);
            mazes[index][start[index].x][start[index].y] = 9;
            mazes[index][end[index].x][end[index].y] = 8;
            drawMaze(index);
            requestAnimationFrame( function() {
                solveMaze1New(index, test);
            } );
            return;
        }
    }
    
    incrLabel(index, test);

    var neighbours = getFNeighboursNew( index, start[index].x, start[index].y, 0 );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = 2;
    } else {
        mazes[index][start[index].x][start[index].y] = 4;
        start[index] = stacks[index].pop();
    }
 
    if(document.getElementById("chkProcess").checked) {
        drawMaze(index);
    }
    // request a frame for animation, BUT THE CALLBACK FUNCTION WON'T BE CALLED IMMEDIATELY, hence the stack to simulate DFS
    requestAnimationFrame( function() {
        solveMaze1New(index, test);
    } );
}

function solveMaze2New(index, test) {
    if(isInterrupting) {
        interrupt();
        return;
    }
    if( start[index].x == end[index].x && start[index].y == end[index].y) {
        if(test == false || totalIterations[index] == testTime) {
            for( var i = 0; i < cols; i++ ) {
                for( var j = 0; j < rows; j++ ) {
                    switch( mazes[index][i][j] ) {
                        case 2: mazes[index][i][j] = 3; break;
                    }
                }
            }
            drawMaze(index);
            incrFinished();
            return;
        } else {
            totalIterations[index]++;
            incrLabel(index, test);
            for(var j = 0; j < cols; j++){
                for( var k = 0; k < rows; k++) {
                    if(mazes[index][j][k] != 0 && mazes[index][j][k] != 1) {
                        mazes[index][j][k] = 0;
                    }    
                }
            }
            getRandomStartNEnd(index);
            mazes[index][start[index].x][start[index].y] = 9;
            mazes[index][end[index].x][end[index].y] = 8;
            drawMaze(index);
            requestAnimationFrame( function() {
                solveMaze2New(index, test);
            } );
            return;
        }
    }
    
    incrLabel(index, test);

    var neighbours = getFNeighboursNew2( index, start[index].x, start[index].y, 0 );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = 2;
    } else {
        if(stacks[index].length == 0) {
            if(test == false || totalIterations[index] == testTime) {
                mazes[index][start[index].x][start[index].y] = 5;
                drawMaze(index);
                incrFinished();
                return;
            } else {
                totalIterations[index]++;
                incrLabel(index, test);
                for(var j = 0; j < cols; j++){
                    for( var k = 0; k < rows; k++) {
                        if(mazes[index][j][k] != 0 && mazes[index][j][k] != 1) {
                            mazes[index][j][k] = 0;
                        }    
                    }
                }
                getRandomStartNEnd(index);
                mazes[index][start[index].x][start[index].y] = 9;
                mazes[index][end[index].x][end[index].y] = 8;
                drawMaze(index);
                requestAnimationFrame( function() {
                    solveMaze2New(index, test);
                } );
                return;
            }
        }
        mazes[index][start[index].x][start[index].y] = 4;
        start[index] = stacks[index].pop();
    }
 
    if(document.getElementById("chkProcess").checked) {
        drawMaze(index);
    }
    // request a frame for animation, BUT THE CALLBACK FUNCTION WON'T BE CALLED IMMEDIATELY, hence the stack to simulate DFS
    requestAnimationFrame( function() {
        solveMaze2New(index, test);
    } );
}

function solveMaze1Euclid(index, test) {
    if(isInterrupting) {
        interrupt();
        return;
    }

    if( start[index].x == end[index].x && start[index].y == end[index].y) {
        if(test == false || totalIterations[index] == testTime) {
            for( var i = 0; i < cols; i++ ) {
                for( var j = 0; j < rows; j++ ) {
                    switch( mazes[index][i][j] ) {
                        case 2: mazes[index][i][j] = 3; break;
                    }
                }
            }
            drawMaze(index);
            incrFinished();
            return;
        } else {
            totalIterations[index]++;
            incrLabel(index, test);
            for(var j = 0; j < cols; j++){
                for( var k = 0; k < rows; k++) {
                    if(mazes[index][j][k] != 0 && mazes[index][j][k] != 1) {
                        mazes[index][j][k] = 0;
                    }    
                }
            }
            getRandomStartNEnd(index);
            
            mazes[index][start[index].x][start[index].y] = 9;
            mazes[index][end[index].x][end[index].y] = 8;
            drawMaze(index);
            requestAnimationFrame( function() {
                solveMaze1Euclid(index, test);
            } );
            return;
        }
    }

    incrLabel(index, test);

    var neighbours = getFNeighboursEuclid( index, start[index].x, start[index].y, 0 );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = 2;
    } else {
        mazes[index][start[index].x][start[index].y] = 4;
        start[index] = stacks[index].pop();
    }
 
    if(document.getElementById("chkProcess").checked) {
        drawMaze(index);
    }
    requestAnimationFrame( function() {
        solveMaze1Euclid(index, test);
    } );
}

function solveMaze2Euclid(index, test) {
    if(isInterrupting) {
        interrupt();
        return;
    }

    if( start[index].x == end[index].x && start[index].y == end[index].y) {
        if(test == false || totalIterations[index] == testTime) {
            for( var i = 0; i < cols; i++ ) {
                for( var j = 0; j < rows; j++ ) {
                    switch( mazes[index][i][j] ) {
                        case 2: mazes[index][i][j] = 3; break;
                    }
                }
            }
            drawMaze(index);
            incrFinished();
            return;
        } else {
            totalIterations[index]++;
            incrLabel(index, test);
            for(var j = 0; j < cols; j++){
                for( var k = 0; k < rows; k++) {
                    if(mazes[index][j][k] != 0 && mazes[index][j][k] != 1) {
                        mazes[index][j][k] = 0;
                    }    
                }
            }
            getRandomStartNEnd(index);
            
            mazes[index][start[index].x][start[index].y] = 9;
            mazes[index][end[index].x][end[index].y] = 8;
            drawMaze(index);
            requestAnimationFrame( function() {
                solveMaze2Euclid(index, test);
            } );
            return;
        }
    }

    incrLabel(index, test);

    var neighbours = getFNeighboursEuclid2( index, start[index].x, start[index].y, 0 );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = 2;
    } else {
        if(stacks[index].length == 0) {
            if(test == false || totalIterations[index] == testTime) {
                mazes[index][start[index].x][start[index].y] = 5;
                drawMaze(index);
                incrFinished();
                return;
            } else {
                totalIterations[index]++;
                incrLabel(index, test);
                for(var j = 0; j < cols; j++){
                    for( var k = 0; k < rows; k++) {
                        if(mazes[index][j][k] != 0 && mazes[index][j][k] != 1) {
                            mazes[index][j][k] = 0;
                        }    
                    }
                }
                getRandomStartNEnd(index);
                mazes[index][start[index].x][start[index].y] = 9;
                mazes[index][end[index].x][end[index].y] = 8;
                drawMaze(index);
                requestAnimationFrame( function() {
                    solveMaze2Euclid(index, test);
                } );
                return;
            }
        }
        mazes[index][start[index].x][start[index].y] = 4;
        start[index] = stacks[index].pop();
    }
 
    if(document.getElementById("chkProcess").checked) {
        drawMaze(index);
    }
    requestAnimationFrame( function() {
        solveMaze2Euclid(index, test);
    } );
}

function solveMaze1Astar(index, test) {
    if(isInterrupting) {
        interrupt();
        return;
    }

    if( start[index].x == end[index].x && start[index].y == end[index].y) {
        if(test == false || totalIterations[index] == testTime) {
            while(prev[start[index].x][start[index].y].x != start[index].x || prev[start[index].x][start[index].y].y != start[index].y) {
                var x = start[index].x;
                var y = start[index].y;
                mazes[index][x][y] = 3;
                start[index].x = prev[x][y].x;
                start[index].y = prev[x][y].y;
            }
            for( var i = 0; i < cols; i++ ) {
                for( var j = 0; j < rows; j++ ) {
                    switch( mazes[index][i][j] ) {
                        case 2: mazes[index][i][j] = 4; break;
                    }
                }
            }
            mazes[index][start[index].x][start[index].y] = 9;
            drawMaze(index);
            incrFinished();
            return;
        } else {
            totalIterations[index]++;
            incrLabel(index, test);
            for(var j = 0; j < cols; j++){
                for( var k = 0; k < rows; k++) {
                    if(mazes[index][j][k] != 0 && mazes[index][j][k] != 1) {
                        mazes[index][j][k] = 0;
                    }    
                }
            }
            getRandomStartNEnd(index);
            pq = new PriorityQueue();
            pq.enqueue({x: start[index].x, y: start[index].y, g: 0, f: getH(start[index], end[index])});
            prev = new Array(cols);
            for(var i = 0; i < prev.length; i++) {
                prev[i] = new Array(rows);
                for(var j = 0; j < prev.length; j++) {
                    prev[i] = {x: -1, y: -1};
                }
            }
            prev[start[index].x][start[index].y] = {x: start[index].x, y: start[index].y};
            mazes[index][start[index].x][start[index].y] = 9;
            mazes[index][end[index].x][end[index].y] = 8;
            drawMaze(index);
            requestAnimationFrame( function() {
                solveMaze1Astar(index, test);
            } );
            return;
        }
    }

    incrLabel(index, test);
 
    var cur = pq.dequeue();
    while(mazes[index][cur.x][cur.y] == 2) {
        cur = pq.dequeue();
    }
    start[index].x = cur.x;
    start[index].y = cur.y;
    if(prev[start[index].x][start[index].y].x != start[index].x || prev[start[index].x][start[index].y].y != start[index].y) {
        mazes[index][cur.x][cur.y] = 2;
    } else {
        mazes[index][cur.x][cur.y] = 9;
    }
    var neighbours = getFNeighbours( index, start[index].x, start[index].y, 0 );
    if(neighbours.length) {
        for(var i = 0; i < neighbours.length; i++) {
            pq.enqueue({x: neighbours[i].x, y: neighbours[i].y, g: cur.g + 1,f: (cur.g + 1) + getH(neighbours[i], end[index])});
            prev[neighbours[i].x][neighbours[i].y] = {x: start[index].x, y: start[index].y};
        }
    } else {
        mazes[index][start[index].x][start[index].y] = 4;
    }
    if(document.getElementById("chkProcess").checked) {
        drawMaze(index);
    }
    // request a frame for animation, BUT THE CALLBACK FUNCTION WON'T BE CALLED IMMEDIATELY, hence the stack to simulate DFS
    requestAnimationFrame( function() {
        solveMaze1Astar(index, test);
    } );
}

function solveMaze2Astar(index, test) {
    if(isInterrupting) {
        interrupt();
        return;
    }
    if( start[index].x == end[index].x && start[index].y == end[index].y) {
        if(test == false || totalIterations[index] == testTime) {
            while(prev[start[index].x][start[index].y].x != start[index].x || prev[start[index].x][start[index].y].y != start[index].y) {
                var x = start[index].x;
                var y = start[index].y;
                mazes[index][x][y] = 3;
                start[index].x = prev[x][y].x;
                start[index].y = prev[x][y].y;
            }
            for( var i = 0; i < cols; i++ ) {
                for( var j = 0; j < rows; j++ ) {
                    switch( mazes[index][i][j] ) {
                        case 2: mazes[index][i][j] = 4; break;
                    }
                }
            }
            mazes[index][start[index].x][start[index].y] = 9;
            drawMaze(index);
            incrFinished();
            return;
        } else {
            totalIterations[index]++;
            incrLabel(index, test);
            for(var j = 0; j < cols; j++){
                for( var k = 0; k < rows; k++) {
                    if(mazes[index][j][k] != 0 && mazes[index][j][k] != 1) {
                        mazes[index][j][k] = 0;
                    }    
                }
            }
            getRandomStartNEnd(index);
            
            pq = new PriorityQueue();
            pq.enqueue({x: start[index].x, y: start[index].y, g: 0, f: getH(start[index], end[index])});
            prev = new Array(cols);
            for(var i = 0; i < prev.length; i++) {
                prev[i] = new Array(rows);
                for(var j = 0; j < prev.length; j++) {
                    prev[i] = {x: -1, y: -1};
                }
            }
            prev[start[index].x][start[index].y] = {x: start[index].x, y: start[index].y};
            mazes[index][start[index].x][start[index].y] = 9;
            mazes[index][end[index].x][end[index].y] = 8;
            drawMaze(index);
            requestAnimationFrame( function() {
                solveMaze2Astar(index, test);
            } );
            return;
        }
    }
    incrLabel(index, test);
 
    if(pq.isEmpty()) {
        if(test == false || totalIterations[index] == testTime) {
            mazes[index][start[index].x][start[index].y] = 5;
            drawMaze(index);
            incrFinished();
            return;
        } else {
            totalIterations[index]++;
            incrLabel(index, test);
            for(var j = 0; j < cols; j++){
                for( var k = 0; k < rows; k++) {
                    if(mazes[index][j][k] != 0 && mazes[index][j][k] != 1) {
                        mazes[index][j][k] = 0;
                    }    
                }
            }
            getRandomStartNEnd(index);
            
            pq = new PriorityQueue();
            pq.enqueue({x: start[index].x, y: start[index].y, g: 0, f: getH(start[index], end[index])});
            prev = new Array(cols);
            for(var i = 0; i < prev.length; i++) {
                prev[i] = new Array(rows);
                for(var j = 0; j < prev.length; j++) {
                    prev[i] = {x: -1, y: -1};
                }
            }
            prev[start[index].x][start[index].y] = {x: start[index].x, y: start[index].y};
            mazes[index][start[index].x][start[index].y] = 9;
            mazes[index][end[index].x][end[index].y] = 8;
            drawMaze(index);
            requestAnimationFrame( function() {
                solveMaze2Astar(index, test);
            } );
            return;
        }
    }
    var cur = pq.dequeue();
    while(mazes[index][cur.x][cur.y] == 2) {
        if(pq.isEmpty()) {
            if(test == false || totalIterations[index] == testTime) {
                mazes[index][start[index].x][start[index].y] = 5;
                drawMaze(index);
                incrFinished();
                return;
            } else {
                totalIterations[index]++;
                incrLabel(index, test);
                for(var j = 0; j < cols; j++){
                    for( var k = 0; k < rows; k++) {
                        if(mazes[index][j][k] != 0 && mazes[index][j][k] != 1) {
                            mazes[index][j][k] = 0;
                        }    
                    }
                }
                getRandomStartNEnd(index);
                
                pq = new PriorityQueue();
                pq.enqueue({x: start[index].x, y: start[index].y, g: 0, f: getH(start[index], end[index])});
                prev = new Array(cols);
                for(var i = 0; i < prev.length; i++) {
                    prev[i] = new Array(rows);
                    for(var j = 0; j < prev.length; j++) {
                        prev[i] = {x: -1, y: -1};
                    }
                }
                prev[start[index].x][start[index].y] = {x: start[index].x, y: start[index].y};
                mazes[index][start[index].x][start[index].y] = 9;
                mazes[index][end[index].x][end[index].y] = 8;
                drawMaze(index);
                requestAnimationFrame( function() {
                    solveMaze2Astar(index, test);
                } );
                return;
            }
        }
        cur = pq.dequeue();
    }
    start[index].x = cur.x;
    start[index].y = cur.y;
    if(prev[start[index].x][start[index].y].x != start[index].x || prev[start[index].x][start[index].y].y != start[index].y) {
        mazes[index][cur.x][cur.y] = 2;
    } else {
        mazes[index][cur.x][cur.y] = 9;
    }
    var neighbours = getFNeighbours2( index, start[index].x, start[index].y, 0 );
    if(neighbours.length) {
        for(var i = 0; i < neighbours.length; i++) {
            pq.enqueue({x: neighbours[i].x, y: neighbours[i].y, g: cur.g + 1,f: (cur.g + 1) + getH(neighbours[i], end[index])});
            prev[neighbours[i].x][neighbours[i].y] = {x: start[index].x, y: start[index].y};
        }
    } else {
        mazes[index][start[index].x][start[index].y] = 4;
    }
    if(document.getElementById("chkProcess").checked) {
        drawMaze(index);
    }
    // request a frame for animation, BUT THE CALLBACK FUNCTION WON'T BE CALLED IMMEDIATELY, hence the stack to simulate DFS
    requestAnimationFrame( function() {
        solveMaze2Astar(index, test);
    } );
}

function getCursorPos( event ) {
    var rect = this.getBoundingClientRect();
    var x = Math.floor( ( event.clientX - rect.left ) / grid / s), 
        y = Math.floor( ( event.clientY - rect.top  ) / grid / s);
    
    // if the end poi
    if(end[0].x != -1) {
        onClear();
    }

    if( mazes[0][x][y] ) return;
    if( start[0].x == -1 ) {
        resetIterations();
        for(var i = 0; i < count; i++) {
            start[i] = {x: x, y: y};
            mazes[i][start[i].x][start[i].y] = 9;
            resetNDisplayLabel(i);
        }
        
        for(var i = 0; i < count; i++) {
            drawMaze(i); 
        }
    } else {
        for(var i = 0; i < count; i++) {
            end[i] = {x: x, y: y};
            mazes[i][end[i].x][end[i].y] = 8;
        }
        
        startTime = performance.now();
        endTime = new Array(count);
        document.getElementById("btnClear").setAttribute("disabled", "disabled");
        document.getElementById("btnCreateMaze").setAttribute("disabled", "disabled");
        document.getElementById("btnInterrupt").removeAttribute("disabled");

        var mazeType = document.getElementById("sltType").value;
        if(mazeType == "Maze1") {
            solveMaze1(0, false);
            solveMaze1New(1, false);
            solveMaze1Euclid(2, false);
        } else {
            solveMaze2(0, false);
            solveMaze2New(1, false);
            solveMaze2Euclid(2, false);
        }
        pq = new PriorityQueue();
        pq.enqueue({x: start[3].x, y: start[3].y, g: 0, f: getH(start[3], end[3])});
        prev = new Array(cols);
        for(var i = 0; i < prev.length; i++) {
            prev[i] = new Array(rows);
            for(var j = 0; j < prev.length; j++) {
                prev[i] = {x: -1, y: -1};
            }
        }
        prev[start[3].x][start[3].y] = {x: start[3].x, y: start[3].y};
        if(mazeType == "Maze1") {
            solveMaze1Astar(3, false);
        } else {
            solveMaze2Astar(3, false);
        }
    }
}

function getH(p1, p2) {
    return Math.pow(manhattanDist(p1, p2), 2);
}

function manhattanDist(p1, p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

// used in creating
// a==1: return start point or wall
function getNeighbours( index, sx, sy, a ) {
    var n = [];
    if( sx - 1 > 0 && mazes[index][sx - 1][sy] == a && sx - 2 > 0 && mazes[index][sx - 2][sy] == a ) {
        n.push( { x:sx - 1, y:sy } ); n.push( { x:sx - 2, y:sy } );
    }
    if( sx + 1 < cols - 1 && mazes[index][sx + 1][sy] == a && sx + 2 < cols - 1 && mazes[index][sx + 2][sy] == a ) {
        n.push( { x:sx + 1, y:sy } ); n.push( { x:sx + 2, y:sy } );
    }
    if( sy - 1 > 0 && mazes[index][sx][sy - 1] == a && sy - 2 > 0 && mazes[index][sx][sy - 2] == a ) {
        n.push( { x:sx, y:sy - 1 } ); n.push( { x:sx, y:sy - 2 } );
    }
    if( sy + 1 < rows - 1 && mazes[index][sx][sy + 1] == a && sy + 2 < rows - 1 && mazes[index][sx][sy + 2] == a ) {
        n.push( { x:sx, y:sy + 1 } ); n.push( { x:sx, y:sy + 2 } );
    }
    return n;
}

// create 3D array, all wall
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

function createMaze1() {
    var neighbours = getNeighbours( 0, start[0].x, start[0].y, 1 ), l;
    if( neighbours.length < 1 ) {
        if( stacks[0].length < 1 ) {

            for(var i = 0; i < count; i++) {
                drawMaze(i); 
            }

            stacks = new Array(count);
            for(var i = 0; i < count; i++) {
                stacks[i] = [];
            }
            
            start[0].x = start[0].y = -1;
            document.getElementById( "canvas1" ).addEventListener( "mousedown", getCursorPos, false );
            document.getElementById("btnCreateMaze").removeAttribute("disabled");
            document.getElementById("btnClear").removeAttribute("disabled");
            document.getElementById("btnAutoTest").removeAttribute("disabled");
            return;
        }
        start[0] = stacks[0].pop();
    } else {
        var i = 2 * Math.floor( Math.random() * ( neighbours.length / 2 ) )
        l = neighbours[i]; 
        for(var j = 0; j < count; j++) {
            mazes[j][l.x][l.y] = 0;
        }

        l = neighbours[i + 1]; 

        for(var j = 0; j < count; j++) {
            mazes[j][l.x][l.y] = 0;
        }

        start[0] = l

        stacks[0].push( start[0] )
    }
    for(var i = 0; i < count; i++) {
        drawMaze(i); 
    }
    
    requestAnimationFrame( createMaze1 );
}

function createMaze1NonAni(ctx) {

    while(true) {

        var neighbours = getNeighbours( 0, start[0].x, start[0].y, 1 ), l;
        if( neighbours.length < 1 ) {
            if( stacks[0].length < 1 ) {
                for(var i = 0; i < count; i++) {
                    drawMaze(i); 
                    drawMaze(i);    
                }
    
                for(var i = 0; i < count; i++) {
                    drawMaze(i); 
                    drawMaze(i);    
                }
    
                stacks = new Array(count);
                for(var i = 0; i < count; i++) {
                    stacks[i] = [];
                }
                
                start[0].x = start[0].y = -1;
                document.getElementById( "canvas1" ).addEventListener( "mousedown", getCursorPos, false );
                document.getElementById("btnCreateMaze").removeAttribute("disabled");
                document.getElementById("btnClear").removeAttribute("disabled");
                document.getElementById("btnAutoTest").removeAttribute("disabled");
                return;
            }
            start[0] = stacks[0].pop();
        } else {
            var i = 2 * Math.floor( Math.random() * ( neighbours.length / 2 ) )
            l = neighbours[i]; 
            for(var j = 0; j < count; j++) {
                mazes[j][l.x][l.y] = 0;
            }

            l = neighbours[i + 1]; 
            for(var j = 0; j < count; j++) {
                mazes[j][l.x][l.y] = 0;
            }
    
            start[0] = l
            stacks[0].push( start[0] )
        }    
    }
    document.getElementById("btnCreateMaze").removeAttribute("disabled");
}

function createMaze2(ctx) {

    var r = Math.random();

    for(var i = 0; i < count; ++i) {
        mazes[i][start[0].x][start[0].y] = r < density ? 0 : 1;
    } 
    
    for(var i = 0; i < count; ++i) {
        drawMaze(i);
    }

    if(start[0].x == (cols - 1) && start[0].y == (rows - 1)){
        start[0].x = start[0].y = -1;
        document.getElementById( "canvas1" ).addEventListener( "mousedown", getCursorPos, false );
        document.getElementById("btnCreateMaze").removeAttribute("disabled");
        document.getElementById("btnClear").removeAttribute("disabled");
        document.getElementById("btnAutoTest").removeAttribute("disabled");
        return;
    }

    start[0].x = start[0].x + 1;
    if(start[0].x == cols){
        start[0].x = 0;
        start[0].y = start[0].y + 1;
    }

    requestAnimationFrame(createMaze2);
}

function createMaze2NonAni() {

    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            flag = Math.random();
            for(var k = 0; k < count; ++k) {
                mazes[k][i][j] = flag < density ? 0 : 1;
            } 
        }
    }

    for(var i = 0; i < count; ++i) {
        drawMaze(i);
    }
    start[0].x = start[0].y = -1;
    document.getElementById( "canvas1" ).addEventListener( "mousedown", getCursorPos, false );
    document.getElementById("btnCreateMaze").removeAttribute("disabled");
    document.getElementById("btnClear").removeAttribute("disabled");
    document.getElementById("btnAutoTest").removeAttribute("disabled");
}

function createCanvas(count) {

    ctxs = new Array(count);
    mazes = new Array(count);

    for(var i = 0; i < count; i++) {
        var canvas = document.createElement( "canvas" );
        wid = document.getElementById("maze" + (i + 1)).offsetWidth - padding;
        hei = 400;
        
        canvas.width = wid; canvas.height = 400;
        canvas.id = "canvas" + (i + 1);
        ctxs[i] = canvas.getContext( "2d" );
        ctxs[i].fillStyle = "gray"; 
        var div = document.getElementById("maze" + (i + 1))
        div.appendChild( canvas );    
    }
    
    for(var i = 0; i < count; i++) {
        ctxs[i].fillRect( 0, 0, wid, hei );
    }
}

function init() {
    createCanvas(count);
    document.getElementById("btnInterrupt").setAttribute("disabled", "disabled");
    document.getElementById("btnClear").setAttribute("disabled", "disabled");
    for(var i = 0; i < count; i++) {
        start.push({x: -1, y: -1});
        end.push({x: -1, y: -1});
    }
}

function onCreate() {
    finished = 0;
    resetIterations();
    
    stacks = new Array(count);
    for(var i = 0; i < count; i++) {
        stacks[i] = [];
        resetNDisplayLabel(i);
    }

    document.getElementById("btnCreateMaze").setAttribute("disabled", "disabled");
    document.getElementById("btnClear").setAttribute("disabled", "disabled");
    document.getElementById("btnAutoTest").setAttribute("disabled", "disabled");
    wid = document.getElementById("maze1").offsetWidth - padding; 
    hei = 400;

    cols = eval(document.getElementById("cols").value); 
    rows = eval(document.getElementById("rows").value);

    var mazeType = document.getElementById("sltType").value;

    if(mazeType == "Maze1") {
        cols = cols + 1 - cols % 2;
        rows = rows + 1 - rows % 2;    
    }

    mazes = createArray( cols, rows );

    for(var i = 0; i < count; i++) {

        var canvas = document.getElementById("canvas" + (i + 1));
        canvas.width = wid;
        canvas.height = hei;
        s = canvas.width / (grid * cols);
        canvas.height = s * grid * rows;
        ctxs[i].scale(s, s);
    }

    if(mazeType == "Maze1") {

        start[0].x = Math.floor( Math.random() * ( cols / 2 ) );
        start[0].y = Math.floor( Math.random() * ( rows / 2 ) );
        if( !( start[0].x & 1 ) ) start[0].x++; if( !( start[0].y & 1 ) ) start[0].y++;
        
        for(var i = 0; i < count; i++) {

            mazes[i][start[0].x][start[0].y] = 0;
        }

        if(document.getElementById("chkAnimated").checked) {

            createMaze1();
        }
        else {

            createMaze1NonAni();
        }
    }
    else {

        density = document.getElementById("density").value / 100;
        start[0].x = 0;
        start[0].x = 0;

        if(document.getElementById("chkAnimated").checked) {

            createMaze2();
        }
        else {

            createMaze2NonAni();
        }
    }
}

// density is enabled only for maze2
function onSltType() {
    if(document.getElementById("sltType").value == "Maze2") {
        document.getElementById("density").removeAttribute("disabled");
    }
    else {
        document.getElementById("density").setAttribute("disabled", "disabled");
    }
}

function resetIterations() {
    for(var i = 0; i < count; i++) {
        iterations[i] = 0;
    }
}

// clear solution on the maze
// redraw the maze, the second loop is to clear the edge of yellow rectangles
// reset start point and end point
function onClear() {

    finished = 0;
    resetIterations();
    
    for(var i = 0; i < count; i++) {
        resetNDisplayLabel(i);
    }

    for(var i = 0; i < count; i++){
        for(var j = 0; j < cols; j++){
            for( var k = 0; k < rows; k++) {
                if(mazes[i][j][k] != 0 && mazes[i][j][k] != 1) {
                    mazes[i][j][k] = 0;
                }    
            }
        }
    }
    
    for(var i = 0; i < count; i++) {
        drawMaze(i); 
    }
    for(var i = 0; i < count; i++) {
        drawMaze(i); 
    }

    stacks = new Array(count);
    
    for(var i = 0; i < count; i++) {
        stacks[i]=[];
        start[i].x = start[i].y = -1;
        end[i].x = end[i].y = -1;
    }
}

function onInterrupt() {
    isInterrupting = true;
    onClear();
}

function interrupt() {
    interrupted++;
    if(interrupted == count) {
        document.getElementById("btnInterrupt").setAttribute("disabled", "disabled");
        document.getElementById("btnClear").removeAttribute("disabled");
        document.getElementById("btnCreateMaze").removeAttribute("disabled");
        document.getElementById("btnAutoTest").removeAttribute("disabled");
        interrupted = 0;
        isInterrupting = false;
    }
}

function onTest() {
    onClear();
    document.getElementById("btnCreateMaze").setAttribute("disabled", "disabled");
    document.getElementById("btnClear").setAttribute("disabled", "disabled");
    document.getElementById("btnAutoTest").setAttribute("disabled", "disabled");
    document.getElementById("btnInterrupt").removeAttribute("disabled");
    totalIterations = new Array(count);
    for(var i = 0; i < count; i++) {
        totalIterations[i] = 0;
        getRandomStartNEnd(i);
        mazes[i][start[i].x][start[i].y] = 9;
        mazes[i][end[i].x][end[i].y] = 8;
        drawMaze(i);
    }
    startTime = performance.now();
    
    var mazeType = document.getElementById("sltType").value;
        if(mazeType == "Maze1") {
            solveMaze1(0, true);
            solveMaze1New(1, true);
            solveMaze1Euclid(2, true);
        } else {
            solveMaze2(0, true);
            solveMaze2New(1, true);
            solveMaze2Euclid(2, true);
        }
        pq = new PriorityQueue();
        pq.enqueue({x: start[3].x, y: start[3].y, g: 0, f: getH(start[3], end[3])});
        prev = new Array(cols);
        for(var i = 0; i < prev.length; i++) {
            prev[i] = new Array(rows);
            for(var j = 0; j < prev.length; j++) {
                prev[i] = {x: -1, y: -1};
            }
        }
        prev[start[3].x][start[3].y] = {x: start[3].x, y: start[3].y};
        if(mazeType == "Maze1") {
            solveMaze1Astar(3, true);
        } else {
            solveMaze2Astar(3, true);
        }
}

function getRandomStartNEnd(index) {
    do {
        start[index].x = parseInt(Math.random() * cols);
        start[index].y = parseInt(Math.random() * rows);;
        end[index].x = parseInt(Math.random() * cols);;
        end[index].y = parseInt(Math.random() * rows);;
    } while(mazes[index][start[index].x][start[index].y] || mazes[index][end[index].x][end[index].y]);
}

function onDisplayProcess() {
    for(var index = 0; index < count; index++) {
        for( var i = 0; i < cols; i++ ) {
            for( var j = 0; j < rows; j++ ) {
                switch( mazes[index][i][j] ) {
                    case 2: 
                    case 4: 
                    case 0: ctxs[index].fillStyle = "black"; break;
                    case 1: ctxs[index].fillStyle = "gray"; break;
                    case 3: ctxs[index].fillStyle = "yellow"; break;
                    case 5: ctxs[index].fillStyle = "purple"; break;
                    case 8: ctxs[index].fillStyle = "blue"; break;
                    case 9: ctxs[index].fillStyle = "gold"; break;
                }
                ctxs[index].fillRect( grid * i, grid * j, grid, grid  );
            }
        }
    }
}