# Issues
- Clicking "clear" when drawing canvas will cause the program to crash.
- `drawBlock()` is never used.
- Clicking "create" when solving the puzzle will cause messed-up color
- Clicking "clear" when solving the puzzle will only clear existing path
- All the `createMaze` functions and `getCursorPos()` are prone to change of `count`

# Change log
## 11/12
- Disable "clear" when drawing the canvas and enable it once it's done
- Disable "create" and "clear" when solving the canvas and enable it once it's done 
- Make all functions extensible
- Add the third canvas, using DFS but with Euclidean distance as the cost

# To-do
- [ ] Try out A-star algorithm
- [x] Use Euclidean distance as cost
- [ ] Add a page for introduction
- [ ] Display the time consumed for each algorithm
- [ ] Solve the maze for Maze2
- [x] Disable "clear" when drawing canvas
- [ ] Add an interrupt option
- [ ] Change content on the side bar