# Issues
- ~~Clicking "clear" when drawing canvas will cause the program to crash.~~
- ~~`drawBlock()` is never used.~~
- ~~Clicking "create" when solving the puzzle will cause messed-up color~~
- ~~Clicking "clear" when solving the puzzle will only clear existing path~~
- ~~All the `createMaze` functions and `getCursorPos()` are prone to change of `count`~~
- Code is extremely repetitive and messy (I did it, not the teacher)

# Change log
## 11/12
- Disable "clear" when drawing the canvas and enable it once it's done
- Disable "create" and "clear" when solving the canvas and enable it once it's done 
- Make all functions extensible
- Add the third canvas, implementing DFS but with Euclidean distance as the cost
- Add the fourth canvas, implementing A* algorithm
- Add timer for each algorithm
- Temporarily remove side bar
- Add "Interrupt" button

## 11/13
- Add solution for Maze2
- Add a "Help" prompt
- Add counter of iterations for each algorithm

## 11/14
- Add auto test for both mazes
- Add a check box to toggle on/off animation of solving the maze in order to increase speed during testing
- Refine "Help" prompt

# To-do
- [x] Try out A-star algorithm
- [x] Use Euclidean distance as cost
- [x] Display the time consumed for each algorithm
- [x] Solve the maze for Maze2
- [x] Disable "Clear" when drawing canvas
- [x] Add an "Interrupt" button
- [x] Remove side bar and replace it with a promt dialogue
- [x] Add auto test to evaluate all algorithms
- [x] Count the number of blocks visited besides time
- [ ] Tidy up the code
- [x] Togglable animation
- [ ] Try out other H for A*

# Comparison of algorithms
Efficiency is measured by the number of iterations for solving the same maze with different starting and finishing point 100 times.

## Maze1
### Size=20*20
Algorithm|Time(s)| Iterations|Improvement
:---:|:---:|:---:|:---:
DFS|197.62|11837| 100%
DFS picking the closest point to finishing point|161.78|9686| 122%
DFS with Euclidean distance as cost|170.24|10194| 116%
A* ( h = (Manhattan Distance) ^ 2 )|111.06|6651| 178%

### Size=50*50
Algorithm|Time(s)| Iterations|Improvement
:---:|:---:|:---:|:---:
DFS|2688.42|98624| 100%
DFS picking the closest point to finishing point|2188.48|79280|124% 
DFS with Euclidean distance as cost|2045.44|70741| 139%
A* ( h = (Manhattan Distance) ^ 2 )|1426.28|42865| 230%

### Size=100*100
Algorithm|Time(s)| Iterations|Improvement
:---:|:---:|:---:|:---:
DFS|29956.20|414812| 100%
DFS picking the closest point to finishing point|26937.59|308430| 134%
DFS with Euclidean distance as cost|27501.27|319929| 130%
A* ( h = (Manhattan Distance) ^ 2 )|17135.26|173041| 240%

## Maze2
### Size=20*20
Algorithm|Time(s)| Iterations|Improvement
:---:|:---:|:---:|:---:
DFS|143.16|8625| 100%
DFS picking the closest point to finishing point|129.94|7829|110%
DFS with Euclidean distance as cost|135.30|8155|106% 
A* ( h = (Manhattan Distance) ^ 2 )|57.03|3499| 246%

### Size=50*50
Algorithm|Time(s)| Iterations|Improvement
:---:|:---:|:---:|:---:
DFS|4200.59|122484| 100%
DFS picking the closest point to finishing point|2929.76|77060|159%
DFS with Euclidean distance as cost|3139.05|86488|142%
A* ( h = (Manhattan Distance) ^ 2 )|1605.79|30168|406%

### Size=100*100
Algorithm|Time(s)| Iterations|Improvement
:---:|:---:|:---:|:---:
DFS|20374.08|163469| 100%
DFS picking the closest point to finishing point|19814.87|145236|113%
DFS with Euclidean distance as cost|20035.66|149806|109%
A* ( h = (Manhattan Distance) ^ 2 )|7517.82|63057|259%

# Other thoughts
- Using deep learning to obtain H for each maze & starting/finishing point may accelerate A* even more.