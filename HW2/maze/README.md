# Maze Game
The webpage is hosted [here](https://gun9nir.github.io/Maze-Game/).

# Issues
- ~~Clicking "clear" when drawing canvas will cause the program to crash.~~
- ~~`drawBlock()` is never used.~~
- ~~Clicking "create" when solving the puzzle will cause messed-up color~~
- ~~Clicking "clear" when solving the puzzle will only clear existing path~~
- ~~All the `createMaze` functions and `getCursorPos()` are prone to change of `count`~~
- ~~Code is extremely repetitive and messy (I did it, not the teacher)~~

# Change log
## 11/12
- Disable "clear" when drawing the canvas and enable it once it's done
- Disable "create" and "clear" when solving the canvas and enable it once it's done 
- Add the third canvas, implementing DFS but with Euclidean distance as the cost
- Add the fourth canvas, implementing A* algorithm
- Add timer for each algorithm
- Temporarily remove side bar
- Add "Interrupt" button

## 11/13
- Add solution for Maze2
- Add a "Help" prompt
- Add iteration counters for each algorithm

## 11/14
- Add auto test for both mazes (iterations)
- Add a check box to toggle on/off animation of solving the maze in order to increase speed during testing
- Refine "Help" prompt
- Add auto test for both mazes (time)

## 11/15
- Collect test result in terms of time.
- Fix typo

## 11/16
- Reduce .js file size by about 40%
- Remove the invisible side bar on the right

# 11/17
- Tidy up the code

# 11/21
- Remove the second algorithm, since it's highly similar to the third
- Search in 8 directions when solving Maze2
- Further tidy up the code

# 11/22
- Refine UI using bootstrap

# To-do
- [x] Try out A-star algorithm
- [x] Use Euclidean distance as cost
- [x] Display the time consumed by each algorithm
- [x] Solve the maze for Maze2
- [x] Disable "Clear" when drawing canvas
- [x] Add an "Interrupt" button
- [x] Remove side bar and replace it with a promt
- [x] Count the number of blocks visited besides time
- [x] Tidy up the code
- [x] Togglable animation
- [x] Add auto test to evaluate all algorithms in terms of number of iterations
- [x] Add auto test to evaluate all algorithms in terms of time
- [x] Update code to match the new code base
- [x] Refine UI

# Comparison of algorithms (Iteration)
Efficiency is measured by the number of iterations for solving the same maze with different starting and finishing points 100 times.

## Maze1
### Size=20*20
Algorithm|Iterations|Improvement
:---:|:---:|:---:
DFS|11837| 100%
DFS picking the closest point to finishing point|9686| 122%
DFS with Euclidean distance as cost|10194| 116%
A* ( h = (Manhattan Distance) ^ 2 )|6651| 178%

### Size=50*50
Algorithm|Iterations|Improvement
:---:|:---:|:---:
DFS|98624| 100%
DFS picking the closest point to finishing point|79280|124% 
DFS with Euclidean distance as cost|70741| 139%
A* ( h = (Manhattan Distance) ^ 2 )|42865| 230%

### Size=100*100
Algorithm| Iterations|Improvement
:---:|:---:|:---:
DFS|2414812|100%
DFS picking the closest point to finishing point|308430| 134%
DFS with Euclidean distance as cost|319929| 130%
A* ( h = (Manhattan Distance) ^ 2 )|173041| 240%

## Maze2 (Density=60)
### Size=20*20
Algorithm|Iterations|Improvement
:---:|:---:|:---:
DFS|8625| 100%
DFS picking the closest point to finishing point|7829|110%
DFS with Euclidean distance as cost|8155|106% 
A* ( h = (Manhattan Distance) ^ 2 )|3499| 246%

### Size=50*50
Algorithm|Iterations|Improvement
:---:|:---:|:---:
DFS|122484| 100%
DFS picking the closest point to finishing point|77060|159%
DFS with Euclidean distance as cost|86488|142%
A* ( h = (Manhattan Distance) ^ 2 )|30168|406%

### Size=100*100
Algorithm|Iterations|Improvement
:---:|:---:|:---:
DFS|163469| 100%
DFS picking the closest point to finishing point|145236|113%
DFS with Euclidean distance as cost|149806|109%
A* ( h = (Manhattan Distance) ^ 2 )|63057|259%


# Comparison of algorithms (Time)
Efficiency is measured by the time consumed by solving the same maze with different starting and finishing points 100 times.

## Maze1
### Size=20*20
Algorithm|Time|Improvement
:---:|:---:|:---:
DFS|596.79| 100%
DFS picking the closest point to finishing point|413.18| 144%
DFS with Euclidean distance as cost|406.70| 147%
A* ( h = (Manhattan Distance) ^ 2 )|217.77| 274%

### Size=50*50
Algorithm|Time|Improvement
:---:|:---:|:---:
DFS|1850.74| 100%
DFS picking the closest point to finishing point|1299.12|142% 
DFS with Euclidean distance as cost|1322.38| 140%
A* ( h = (Manhattan Distance) ^ 2 )|923.90| 200%

### Size=100*100
Algorithm| Time|Improvement
:---:|:---:|:---:
DFS|6572.28|100%
DFS picking the closest point to finishing point|5580.00| 118%
DFS with Euclidean distance as cost|5134.33| 128%
A* ( h = (Manhattan Distance) ^ 2 )|3218.94| 204%

## Maze2 (Density=60)
### Size=20*20
Algorithm|Time|Improvement
:---:|:---:|:---:
DFS|382.65| 100%
DFS picking the closest point to finishing point|193.88|197%
DFS with Euclidean distance as cost|184.83|207% 
A* ( h = (Manhattan Distance) ^ 2 )|97.00| 394%

### Size=50*50
Algorithm|Time|Improvement
:---:|:---:|:---:
DFS|1612.71| 100%
DFS picking the closest point to finishing point|1119.43|144%
DFS with Euclidean distance as cost|1224.62|132%
A* ( h = (Manhattan Distance) ^ 2 )|546.07|295%

### Size=100*100
Algorithm|Time|Improvement
:---:|:---:|:---:
DFS|8363.82| 100%
DFS picking the closest point to finishing point|5952.92|140%
DFS with Euclidean distance as cost|5791.37|144%
A* ( h = (Manhattan Distance) ^ 2 )|2029.36|412%

# Other thoughts
- Use multithreading to solve Maze2. That is, to pick out a few points on/near the straight line between starting and finishing point and solve each segment in a separate thread.