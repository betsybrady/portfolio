#include <getopt.h>
#include <inttypes.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#include "binary.h"
#include "bubble.h"
#include "quick.h"
#include "shell.h"

#define OPTIONS "Absqip:r:n:"
#define BIT_MASK 0x3FFFFFFF

void randomize_array(uint32_t array[], uint32_t seed, uint32_t size) {
  srand(seed);
  for (uint32_t i = 0; i < size; i++) {
    array[i] = rand() & BIT_MASK;
  }
  return;
}

void print_array(uint32_t array[], uint32_t size) {
  for (uint32_t i = 0; i < size; i++) {
    printf("%13d", array[i]);
    if ((i + 1) % 7 == 0) {
      printf("\n");
    }
  }
  printf("\n");
  return;
}

void print_header(char *sort_name, uint32_t size, uint32_t moves,
                  uint32_t compares) {
  printf("%s\n", sort_name);
  printf("%d elements, %d moves, %d compares\n", size, moves, compares);
}

int main(int argc, char **argv) {
  uint32_t seed = 8222022;
  uint32_t array_size = 100;
  uint32_t number_printed = 100;

  bool sorts[] = {false, false, false, false};
  int command = 0;
  while ((command = getopt(argc, argv, OPTIONS)) != -1) {
    if (command == 'A') {
      sorts[0] = true;
      sorts[1] = true;
      sorts[2] = true;
      sorts[3] = true;
    }
    if (command == 'b') {
      sorts[0] = true;
    }
    if (command == 's') {
      sorts[1] = true;
    }
    if (command == 'q') {
      sorts[2] = true;
    }
    if (command == 'i') {
      sorts[3] = true;
    }
    if (command == 'p') {
      number_printed = atoi(optarg);
    }
    if (command == 'r') {
      seed = atoi(optarg);
    }
    if (command == 'n') {
      array_size = atoi(optarg);
    }
  }

  if (number_printed > array_size) {
    number_printed = array_size;
  }

  uint32_t *array = (uint32_t *)calloc(array_size, sizeof(uint32_t));
  if (!array) {
    printf("Error: calloc didn't allocate properly!\n");
    exit(-1);
  }

  if (sorts[0]) {
    randomize_array(array, seed, array_size);
    bubble_sort(array, array_size);

    print_header("Bubble Sort", array_size, bubble_moves, bubble_compares);
    print_array(array, number_printed);
  }

  if (sorts[1]) {
    randomize_array(array, seed, array_size);
    shell_sort(array, array_size);

    print_header("Shell Sort", array_size, shell_moves, shell_compares);
    print_array(array, number_printed);
  }

  if (sorts[2]) {
    randomize_array(array, seed, array_size);
    quick_sort(array, 0, array_size - 1);

    print_header("Quick Sort", array_size, quick_moves, quick_compares);
    print_array(array, number_printed);
  }

  if (sorts[3]) {
    randomize_array(array, seed, array_size);
    binary_insertion_sort(array, array_size);

    print_header("Binary Insertion Sort", array_size, binary_moves,
                 binary_compares);
    print_array(array, number_printed);
  }

  free(array);
  return 0;
}
