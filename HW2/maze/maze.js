// count: the number of mazes
var ctxs, wid, hei, cols, rows, mazes, stacks = [], start = [{x:-1, y:-1}, {x:-1, y:-1}], end = [{x:-1, y:-1}, {x:-1, y:-1}],grid = 8, padding = 16, s, density=0.5, count=3;
function drawMaze(index) {
    for( var i = 0; i < cols; i++ ) {
        for( var j = 0; j < rows; j++ ) {
            switch( mazes[index][i][j] ) {
                case 0: ctxs[index].fillStyle = "black"; break;
                case 1: ctxs[index].fillStyle = "gray"; break;
                case 2: ctxs[index].fillStyle = "red"; break;
                case 3: ctxs[index].fillStyle = "yellow"; break;
                case 4: ctxs[index].fillStyle = "#500000"; break;
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
    console.log(dist);
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
// ordinary DFS
function solveMaze1(index) {
    if( start[index].x == end[index].x && start[index].y == end[index].y ) {
        for( var i = 0; i < cols; i++ ) {
            for( var j = 0; j < rows; j++ ) {
                switch( mazes[index][i][j] ) {
                    case 2: mazes[index][i][j] = 3; break;
                }
            }
        }
        drawMaze(index);
        document.getElementById("btnClear").removeAttribute("disabled");
        document.getElementById("btnCreateMaze").removeAttribute("disabled");
        return;
    }
    var neighbours = getFNeighbours( index, start[index].x, start[index].y, 0 );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = 2;
    } else {
        mazes[index][start[index].x][start[index].y] = 4;
        start[index] = stacks[index].pop();
    }
 
    drawMaze(index);
    requestAnimationFrame( function() {
        solveMaze1(index);
    } );
}

// DFS, but pick the point closer to the end point first
function solveMaze1New(index) {

    if( start[index].x == end[index].x && start[index].y == end[index].y ) {
        for( var i = 0; i < cols; i++ ) {
            for( var j = 0; j < rows; j++ ) {
                switch( mazes[index][i][j] ) {
                    case 2: mazes[index][i][j] = 3; break;
                }
            }
        }
        drawMaze(index);
        document.getElementById("btnClear").removeAttribute("disabled");
        document.getElementById("btnCreateMaze").removeAttribute("disabled");
        return;
    }
    var neighbours = getFNeighboursNew( index, start[index].x, start[index].y, 0 );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = 2;
    } else {
        mazes[index][start[index].x][start[index].y] = 4;
        start[index] = stacks[index].pop();
    }
 
    drawMaze(index);
    // request a frame for animation, BUT THE CALLBACK FUNCTION WON'T BE CALLED IMMEDIATELY, hence the stack to simulate DFS
    requestAnimationFrame( function() {
        solveMaze1New(index);
    } );
}

function solveMaze1Euclid(index) {
    if( start[index].x == end[index].x && start[index].y == end[index].y ) {
        for( var i = 0; i < cols; i++ ) {
            for( var j = 0; j < rows; j++ ) {
                switch( mazes[index][i][j] ) {
                    case 2: mazes[index][i][j] = 3; break;
                }
            }
        }
        drawMaze(index);
        document.getElementById("btnClear").removeAttribute("disabled");
        document.getElementById("btnCreateMaze").removeAttribute("disabled");
        return;
    }
    var neighbours = getFNeighboursEuclid( index, start[index].x, start[index].y, 0 );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = 2;
    } else {
        mazes[index][start[index].x][start[index].y] = 4;
        start[index] = stacks[index].pop();
    }
 
    drawMaze(index);
    requestAnimationFrame( function() {
        solveMaze1Euclid(index);
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
        for(var i = 0; i < count; i++) {
            start[i] = {x: x, y: y};
            mazes[i][start[i].x][start[i].y] = 9;
        }
        
        for(var i = 0; i < count; i++) {
            drawMaze(i); 
        }
    } else {
        for(var i = 0; i < count; i++) {
            end[i] = {x: x, y: y};
            mazes[i][end[i].x][end[i].y] = 8;
        }
        
        document.getElementById("btnClear").setAttribute("disabled", "disabled");
        document.getElementById("btnCreateMaze").setAttribute("disabled", "disabled");
        solveMaze1(0);
        solveMaze1New(1);
        solveMaze1Euclid(2);
    }
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

        document.getElementById("btnCreateMaze").removeAttribute("disabled");
        document.getElementById("btnClear").removeAttribute("disabled");
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

    document.getElementById("btnCreateMaze").removeAttribute("disabled");
    document.getElementById("btnClear").removeAttribute("disabled");
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
}

function onCreate() {

    stacks = new Array(count);
    for(var i = 0; i < count; i++) {
        stacks[i] = [];
    }

    document.getElementById("btnCreateMaze").setAttribute("disabled", "disabled");
    document.getElementById("btnClear").setAttribute("disabled", "disabled");
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

// clear solution on the maze
// redraw the maze, the second loop is to clear the edge of yellow rectangles
// reset start point and end point
function onClear() {
    for(var i = 0; i < count; i++){
        for(var j = 0; j < cols; j++){
            for( var k = 0; k < rows; k++) {
                if(mazes[i][j][k] == 3 || mazes[i][j][k] == 4 || mazes[i][j][k] == 8 || mazes[i][j][k] == 9) {
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