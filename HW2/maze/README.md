# Issues
- ~~Clicking "clear" when drawing canvas will cause the program to crash.~~
- ~~`drawBlock()` is never used.~~
- ~~Clicking "create" when solving the puzzle will cause messed-up color~~
- ~~Clicking "clear" when solving the puzzle will only clear existing path~~
- ~~All the `createMaze` functions and `getCursorPos()` are prone to change of `count`~~
- Extreme repetition in the code (I did it, not the teacher)

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
- Add a "Help" prompt dialogue

# To-do
- [x] Try out A-star algorithm
- [x] Use Euclidean distance as cost
- [x] Display the time consumed for each algorithm
- [x] Solve the maze for Maze2
- [x] Disable "Clear" when drawing canvas
- [x] Add an "Interrupt" button
- [x] Remove side bar and replace it with a promt dialogue
- [ ] Add auto test to evaluate all algorithms
- [ ] Count the number of blocks visited besides time
- [ ] Use call back functions to optimize the code

# Comparison of algorithms