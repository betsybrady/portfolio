sorting is a program that runs different sorts and prints their results and 
data about them. The sorts included are Bubble Sort, Shell Sort, Quick Sort,
and Binary Insertion Sort.

To create the executable, type make or make all.

To run the program, type ./sorting and any desired command line arguments.

-A runs all four sorts included in the program.
-b runs Bubble Sort
-s runs Shell Sort
-q runs Quick Sort
-i runs Binary Insertion Sort
-p <number> specifies the number of elements to print. The default number is
100.
-r <number> specifies the random seed to use. The default is 8222022.
-n <number> specifies the number of elements to generate and sort. The default
is 100.

Clear compiler generated files by typing make clean.

Run infer or valgrind by typing make infer or make valgrind.

Created by Betsy Brady February 2020
