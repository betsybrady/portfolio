pathfinder.c is a program that searches through a provided labyrinth and finds
all possible paths to the exit. The program prints every possible path, the
number of paths, and the length of the shortest path.

To create the executable, type make or make all.

To run the program, type ./pathfinder and any desired command line arguments.

-i includes an input file, and must be typed in the format -i <input file>.
The input file must be formatted with each edge (ie AB, if A is connected to B)
followed by a \n character. If no input file is provided, the program will take
input when run, and the input must be formatted the same way as described for
input files.

-d will specify that the labyrinth is directed, meaning that if AB is given, A
will lead to B, but B cannot go back to A. -u specifies that the labyrinth is
undirected, meaning that giving AB will mean A leads to B and B leads to A.
Only one of these two flags can be used at once. If neither is given, the 
program will default to undirected.

-m will print the adjacency matrix for the input to the screen.

Clear compiler generated files by typing make clean.

Created by Betsy Brady February 2020
