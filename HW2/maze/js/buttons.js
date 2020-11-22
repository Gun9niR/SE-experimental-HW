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

function onSltType() {
    if(document.getElementById("sltType").value == "Maze2") {
        $("#density").removeAttr("disabled");
    }
    else {
        $("#density").prop("disabled", true);
    }
}

function onInterrupt() {
    isInterrupting = true;
    onClear();
}

function onTestIter() {
    onClear();
    $("#btnCreateMaze, #btnClear").prop("class", "nav-link disabled")
    $("#testDropDown").prop("class", "nav-link dropdown-toggle disabled");
    $("#btnInterrupt").prop("class", "nav-link");
    totalIterations = new Array(count);
    for(var i = 0; i < count; i++) {
        totalIterations[i] = 1;
        getRandomStartNEnd(i);
        mazes[i][start[i].x][start[i].y] = 9;
        mazes[i][end[i].x][end[i].y] = 8;
        drawMaze(i);
    }
    startTime = performance.now();
    
    var mazeType = document.getElementById("sltType").value;
        if(mazeType == "Maze1") {
            solveMaze(0, 1, 0);
            solveMazeNew(1, 1, 0);
        } else {
            solveMaze(0, 1, 1);
            solveMazeNew(1, 1, 1);
        }
        
        initAstar(2);
        if(mazeType == "Maze1") {
            solveMazeAstar(2, 1, 0);
        } else {
            solveMazeAstar(2, 1, 1);
        }
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

function onTestTime() {
    testingTime = true;
    onClear();
    $("#btnCreateMaze, #btnClear").prop("class", "nav-link disabled")
    $("#testDropDown").prop("class", "nav-link dropdown-toggle disabled");
    $("#btnInterrupt").prop("class", "nav-link");
    var mazeType = document.getElementById("sltType").value;
    totalIterations = new Array(count);
    for(var i = 0; i < count; i++) {
        totalIterations[i] = 1;
    }

    getRandomStartNEnd(0);
    mazes[0][start[0].x][start[0].y] = 9;
    mazes[0][end[0].x][end[0].y] = 8;
    drawMaze(0);
    startTime = performance.now();
    if(mazeType == "Maze1") {
        solveMaze(0, 2, 0);
    } else {
        solveMaze(0, 2, 1);
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

    $("#btnCreateMaze, #btnClear, #btnInterrupt").prop("class", "nav-link disabled")
    $("#testDropDown").prop("class", "nav-link dropdown-toggle disabled");

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
    
    document.getElementById( "canvas1" ).addEventListener( "mousedown", getCursorPos, false );
}