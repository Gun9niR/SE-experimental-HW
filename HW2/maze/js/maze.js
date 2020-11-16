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

function init() {
    createCanvas(count);
    document.getElementById("btnInterrupt").setAttribute("disabled", "disabled");
    document.getElementById("btnClear").setAttribute("disabled", "disabled");
    document.getElementById("btnInterrupt").setAttribute("disabled", "disabled");
    document.getElementById("btnAutoTest").setAttribute("disabled", "disabled");
    document.getElementById("btnAutoTestTime").setAttribute("disabled", "disabled");
    for(let i = 0; i < count; i++) {
        start.push({x: -1, y: -1});
        end.push({x: -1, y: -1});
    }
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
    prev[start[index].x][start[3].y] = {x: start[index].x, y: start[index].y};
}

function createCanvas(count) {

    ctxs = new Array(count);
    mazes = new Array(count);

    for(let i = 0; i < count; i++) {
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
    
    for(let i = 0; i < count; i++) {
        ctxs[i].fillRect( 0, 0, wid, hei );
    }
}

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

function getFNeighbours( index, sx, sy, a, offset) {
    var n = [];
    if( sx - 1 + offset> 0 && mazes[index][sx - 1][sy] % 8 == a ) {
        n.push( { x:sx - 1, y:sy } );
    }
    if( sx + 2 - offset < cols && mazes[index][sx + 1][sy] % 8 == a ) {
        n.push( { x:sx + 1, y:sy } );
    }
    if( sy - 1 + offset > 0 && mazes[index][sx][sy - 1] % 8 == a ) {
        n.push( { x:sx, y:sy - 1 } );
    }
    if( sy + 2 - offset < rows && mazes[index][sx][sy + 1] % 8 == a ) {
        n.push( { x:sx, y:sy + 1 } );
    }
    return n;
}

function getFNeighboursNew(index, sx, sy, a) {

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

function getFNeighboursEuclid(index, sx, sy, a, offset) {
    var n = [], dist = [];
    if( sx - 1 + offset> 0 && mazes[index][sx - 1][sy] % 8 == a ) {
        n.push( { x:sx - 1, y:sy } );
        dist.push(euclidDist({x: sx - 1, y: sy}, end[index]));
    }
    if( sx + 2 - offset < cols && mazes[index][sx + 1][sy] % 8 == a ) {
        n.push( { x:sx + 1, y:sy } );
        dist.push(euclidDist({x: sx + 1, y: sy}, end[index]));
    }
    if( sy - 1 + offset > 0 && mazes[index][sx][sy - 1] % 8 == a ) {
        n.push( { x:sx, y:sy - 1 } );
        dist.push(euclidDist({x: sx, y: sy - 1}, end[index]));
    }
    if( sy + 2 - offset < rows && mazes[index][sx][sy + 1] % 8 == a ) {
        n.push( { x:sx, y:sy + 1 } );
        dist.push(euclidDist({x: sx, y: sy + 1}, end[index]));
    }
    return insertionSort(n, dist);
}

function finishAlgorithm(index, test, mazeType, curAlgorithm, nextAlgorithm) {
    if( start[index].x == end[index].x && start[index].y == end[index].y) {
        if(test == 0 || totalIterations[index] == numOfTests) {
            for( var i = 0; i < cols; i++ ) {
                for( var j = 0; j < rows; j++ ) {
                    switch( mazes[index][i][j] ) {
                        case 2: mazes[index][i][j] = 3; break;
                    }
                }
            }
            drawMaze(index);
            incrFinished();
            if(test == 2) {
                testNext(index + 1, nextAlgorithm, mazeType);
            }
            throw 0;
        } else {
            totalIterations[index]++;
            incrLabel(index, test);
            for(let j = 0; j < cols; j++){
                for( var k = 0; k < rows; k++) {
                    if(mazes[index][j][k] != 0 && mazes[index][j][k] != 1) {
                        mazes[index][j][k] = 0;
                    }    
                }
            }
            drawNewStartNEnd(index);
            requestAnimationFrame( function() {
                curAlgorithm(index, test, mazeType);
            } );
            throw 0;
        }
    }
}

function chkNoSolution(index, test, mazeType, curAlgorithm, nextAlgorithm) {
    if(stacks[index].length == 0) {
        if(test == 0 || totalIterations[index] == numOfTests) {
            mazes[index][start[index].x][start[index].y] = 5;
            drawMaze(index);
            incrFinished();
            if(test == 2) {
                testNext(index + 1, nextAlgorithm, mazeType);
            }
            throw 0;
        } else {
            totalIterations[index]++;
            for(let j = 0; j < cols; j++){
                for( var k = 0; k < rows; k++) {
                    if(mazes[index][j][k] != 0 && mazes[index][j][k] != 1) {
                        mazes[index][j][k] = 0;
                    }    
                }
            }
            drawNewStartNEnd(index);
            incrLabel(index, test);
            requestAnimationFrame( function() {
                curAlgorithm(index, test, mazeType);
            } );
            throw 0;
        }
    }
}

function solveMaze(index, test, mazeType) {
    if(isInterrupting) {
        interrupt();
        return;
    }
    
    try {
        finishAlgorithm(index, test, mazeType, solveMaze, solveMazeNew);
    } catch(finished) {
        return;
    }
    incrLabel(index, test);

    var neighbours = getFNeighbours( index, start[index].x, start[index].y, 0, mazeType);
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = 2;
    } else {
        if(mazeType == 1) {
            try {
                chkNoSolution(index, test, mazeType, solveMaze, solveMazeNew);
            } catch(err) {
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
        solveMaze(index, test, mazeType);
    } );
}

function solveMazeNew(index, test, mazeType) {
    if(isInterrupting) {
        interrupt();
        return;
    }
    try {
        finishAlgorithm(index, test, mazeType, solveMazeNew, solveMazeEuclid);
    } catch(finished) {
        return;
    }
    
    incrLabel(index, test);

    var neighbours = getFNeighboursNew( index, start[index].x, start[index].y, 0 );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = 2;
    } else {
        if(mazeType == 1) {
            try {
                chkNoSolution(index, test, mazeType, solveMazeNew, solveMazeEuclid);
            } catch(err) {
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
        solveMazeNew(index, test, mazeType);
    } );
}

function solveMazeEuclid(index, test, mazeType) {
    if(isInterrupting) {
        interrupt();
        return;
    }

    try {
        finishAlgorithm(index, test, mazeType, solveMazeEuclid, solveMazeAstar);
    } catch(finished) {
        return;
    }

    incrLabel(index, test);

    var neighbours = getFNeighboursEuclid(index, start[index].x, start[index].y, 0, mazeType);
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = 2;
    } else {
        if(mazeType == 1) {
            try {
                chkNoSolution(index, test, mazeType, solveMazeEuclid, solveMazeAstar);
            } catch(err) {
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
        solveMazeEuclid(index, test, mazeType);
    } );
}

function solveMazeAstar(index, test, mazeType) {
    function chkAstarNoSolution() {
        if(pq.isEmpty()) {
            if(test == 0 || totalIterations[index] == numOfTests) {
                mazes[index][start[index].x][start[index].y] = 5;
                drawMaze(index);
                incrFinished();
                throw 0;
            } else {
                totalIterations[index]++;
                incrLabel(index, test);
                for(let j = 0; j < cols; j++){
                    for( var k = 0; k < rows; k++) {
                        if(mazes[index][j][k] != 0 && mazes[index][j][k] != 1) {
                            mazes[index][j][k] = 0;
                        }    
                    }
                }
                drawNewStartNEnd(index);
                initAstar(index);
    
                requestAnimationFrame( function() {
                    solveMazeAstar(index, test, mazeType);
                } );
                throw 0;
            }
        }
    }
    if(isInterrupting) {
        interrupt();
        return;
    }

    if( start[index].x == end[index].x && start[index].y == end[index].y) {
        if(test == 0 || totalIterations[index] == numOfTests) {
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
            testingTime = false;
            return;
        } else {
            totalIterations[index]++;
            incrLabel(index, test);
            for(let j = 0; j < cols; j++){
                for( var k = 0; k < rows; k++) {
                    if(mazes[index][j][k] != 0 && mazes[index][j][k] != 1) {
                        mazes[index][j][k] = 0;
                    }    
                }
            }
            drawNewStartNEnd(index);
            initAstar(index);

            requestAnimationFrame( function() {
                solveMazeAstar(index, test, mazeType);
            } );
            return;
        }
    }
    try {
        chkAstarNoSolution();
    } catch(err) {
        return;
    }
    incrLabel(index, test);
 
    var cur = pq.dequeue();
    while(mazes[index][cur.x][cur.y] == 2) {
        try {
            chkAstarNoSolution();
        } catch(err) {
            return;
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
    var neighbours = getFNeighbours( index, start[index].x, start[index].y, 0, mazeType);
    if(neighbours.length) {
        for(let i = 0; i < neighbours.length; i++) {
            pq.enqueue({x: neighbours[i].x, y: neighbours[i].y, g: cur.g + 1,f: (cur.g + 1) + getH(neighbours[i], end[index])});
            prev[neighbours[i].x][neighbours[i].y] = {x: start[index].x, y: start[index].y};
        }
    } else {
        mazes[index][start[index].x][start[index].y] = 4;
    }
    if(document.getElementById("chkProcess").checked) {
        drawMaze(index);
    }

    requestAnimationFrame( function() {
        solveMazeAstar(index, test, mazeType);
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
        for(let i = 0; i < count; i++) {
            start[i] = {x: x, y: y};
            mazes[i][start[i].x][start[i].y] = 9;
            resetNDisplayLabel(i);
        }
        
        for(let i = 0; i < count; i++) {
            drawMaze(i); 
        }
    } else {
        for(let i = 0; i < count; i++) {
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
            solveMaze(0, 0, 0);
            solveMazeNew(1, 0, 0);
            solveMazeEuclid(2, 0, 0);
        } else {
            solveMaze(0, 0, 1);
            solveMazeNew(1, 0, 1);
            solveMazeEuclid(2, 0, 1);
        }
        initAstar(3);
        if(mazeType == "Maze1") {
            solveMazeAstar(3, 0, 0);
        } else {
            solveMazeAstar(3, 0, 1);
        }
    }
}

function createMaze1() {
    var neighbours = getNeighbours( 0, start[0].x, start[0].y, 1 ), l;
    if( neighbours.length < 1 ) {
        if( stacks[0].length < 1 ) {

            for(let i = 0; i < count; i++) {
                drawMaze(i); 
            }

            stacks = new Array(count);
            for(let i = 0; i < count; i++) {
                stacks[i] = [];
            }
            
            start[0].x = start[0].y = -1;
            return;
        }
        start[0] = stacks[0].pop();
    } else {
        var i = 2 * Math.floor( Math.random() * ( neighbours.length / 2 ) )
        l = neighbours[i]; 
        for(let j = 0; j < count; j++) {
            mazes[j][l.x][l.y] = 0;
        }

        l = neighbours[i + 1]; 

        for(let j = 0; j < count; j++) {
            mazes[j][l.x][l.y] = 0;
        }

        start[0] = l

        stacks[0].push( start[0] )
    }
    for(let i = 0; i < count; i++) {
        drawMaze(i); 
    }
    
    requestAnimationFrame( createMaze1 );
}

function createMaze1NonAni(ctx) {
    while(true) {
        var neighbours = getNeighbours( 0, start[0].x, start[0].y, 1 ), l;
        if( neighbours.length < 1 ) {
            if( stacks[0].length < 1 ) {
                for(let i = 0; i < count; i++) {
                    drawMaze(i); 
                    drawMaze(i);    
                }
    
                for(let i = 0; i < count; i++) {
                    drawMaze(i); 
                    drawMaze(i);    
                }
    
                stacks = new Array(count);
                for(let i = 0; i < count; i++) {
                    stacks[i] = [];
                }
                
                start[0].x = start[0].y = -1;
                return;
            }
            start[0] = stacks[0].pop();
        } else {
            var i = 2 * Math.floor( Math.random() * ( neighbours.length / 2 ) )
            l = neighbours[i]; 
            for(let j = 0; j < count; j++) {
                mazes[j][l.x][l.y] = 0;
            }

            l = neighbours[i + 1]; 
            for(let j = 0; j < count; j++) {
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

    for(let i = 0; i < count; ++i) {
        mazes[i][start[0].x][start[0].y] = r < density ? 0 : 1;
    } 
    
    for(let i = 0; i < count; ++i) {
        drawMaze(i);
    }

    if(start[0].x == (cols - 1) && start[0].y == (rows - 1)){
        start[0].x = start[0].y = -1;
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

    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            flag = Math.random();
            for(let k = 0; k < count; ++k) {
                mazes[k][i][j] = flag < density ? 0 : 1;
            } 
        }
    }

    for(let i = 0; i < count; ++i) {
        drawMaze(i);
    }
    start[0].x = start[0].y = -1;
}

function drawNewStartNEnd(index) {
    getRandomStartNEnd(index);
    mazes[index][start[index].x][start[index].y] = 9;
    mazes[index][end[index].x][end[index].y] = 8;
    drawMaze(index);
}

function testNext(index, method, mazeType) {
    switch(method) {
        case solveMazeNew:
        case solveMazeEuclid:
            drawNewStartNEnd(index);
            startTime = performance.now();
            method(index, 2, mazeType);
            break;
        case solveMazeAstar:
            drawNewStartNEnd(index);
            startTime = performance.now();
            initAstar(index);
            method(index, 2, mazeType);
            break;
    }
}