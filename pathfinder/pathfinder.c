#include "stack.h"
#include <ctype.h>
#include <getopt.h>
#include <inttypes.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define OPTIONS "dumi:"

#define MATRIX_LENGTH 26

uint32_t adj_matrix[MATRIX_LENGTH][MATRIX_LENGTH];

// Function to initialize matrix
// No input
// No output
void initialize_matrix(void) {
  for (uint32_t i = 0; i < MATRIX_LENGTH; i++) {
    for (uint32_t j = 0; j < MATRIX_LENGTH; j++) {
      adj_matrix[i][j] = 0;
    }
  }
}

// Function to add pair to matrix
// Input - first node, second node
// No output
void add_pair(uint32_t node_1, uint32_t node_2, bool directed) {
  if (!directed) {
    adj_matrix[node_2][node_1] = 1;
  }
  adj_matrix[node_1][node_2] = 1;
}

uint32_t adj_pair[2] = {0, 0};

// Function to sort through input
// Input - character from input
// Output - number of characters sorted since last pair
uint32_t char_sort(char character, uint32_t char_count) {
  if (isalpha(character)) {
    if (char_count < 2) {
      uint32_t int_character = toupper(character) - 'A';
      adj_pair[char_count] = int_character;
      char_count++;
    } else {
      printf("Error: Improperly formatted input!\n");
      exit(-1);
    }
  } else if (character == '\n') {
    if (char_count != 2) {
      printf("Error: Improperly formatted input!\n");
      exit(-1);
    }
    char_count = 0;
  }
  return char_count;
}

// Function to print matrix
// Input - pointer to matrix
// No output
void print_matrix(void) {
  // Print header line
  char character = 0;
  printf("  ");
  for (; character < MATRIX_LENGTH; character++) {
    printf("%c ", (character + 'A'));
  }
  character = 'A';
  for (uint32_t i = 0; i < MATRIX_LENGTH; i++) {
    // Prints line header
    printf("\n%c ", character);
    character++;
    for (uint32_t j = 0; j < MATRIX_LENGTH; j++) {
      printf("%d ", adj_matrix[i][j]);
    }
  }
  printf("\n");
  return;
}

// Creates array to remember visited nodes
uint32_t visited[MATRIX_LENGTH];

uint32_t old = 0;
uint32_t *old_node = &old;

uint32_t path_num = 0;
uint32_t *path_ptr = &path_num;

uint32_t short_path = MATRIX_LENGTH;
uint32_t *short_ptr = &short_path;

// Function to search through maze
// Input - current node, pointer to stack
// No output
void dfs(uint32_t node, Stack *s) {
  visited[node] = 1;
  // Checks if at exit
  if (node == 25) {
    visited[node] = 0;
    *path_ptr += 1;
    printf("Found path: ");
    stack_print(s);
    // Checks if shortest path
    uint32_t path_len = stack_size(s) + 1;
    if (path_len < *short_ptr) {
      *short_ptr = path_len;
    }
    printf("Z\n");
    return;
  }

  // Checks which future nodes are possible
  for (uint32_t i = 0; i < MATRIX_LENGTH; i++) {
    if ((adj_matrix[node][i]) && (!(visited[i]))) {
      // Explores future node
      stack_push(s, node);
      // Checks for realloc error
      if (!s->items) {
        printf("Error: realloc didn't execute properly!");
        exit(-1);
      }
      dfs(i, s);
      stack_pop(s, old_node);
    }
  }
  visited[node] = 0;
  return;
}

int main(int argc, char **argv) {

  Stack *path = stack_create();
  // Checks if malloc worked
  if (!path) {
    printf("Error: malloc didn't execute properly!");
    exit(-1);
  }

  int command = 0;
  bool directed = false;
  bool undirected = false;
  bool input = false;
  bool print = false;
  char *input_file = NULL;

  initialize_matrix();

  // Initalize visted array
  for (uint32_t i = 0; i < MATRIX_LENGTH; i++) {
    visited[i] = 0;
  }

  while ((command = getopt(argc, argv, OPTIONS)) != -1) {
    // Checks if input file provided and saves it
    if (command == 'i') {
      input = true;
      input_file = optarg;
    }
    // Checks if it is directed or undirected
    if (command == 'd') {
      directed = true;
      if (undirected) {
        printf("Error: the labyruint32_th cannot be both directed and "
               "undirected!\n");
      }
    }
    if (command == 'u') {
      undirected = true;
      if (directed) {
        printf("Error: The labyruint32_th cannot be both directed and "
               "undirected!\n");
        exit(-1);
      }
    }
    if (command == 'm') {
      print = true;
    }
  }
  if (input && !input_file) {
    printf("Error: input file must be provided!\n");
    exit(-1);
  }

  char character = 0;
  uint32_t char_count = 0;

  if (input) {
    FILE *file_ptr = fopen(input_file, "r");
    // Check if file opened
    if (file_ptr == NULL) {
      printf("Error: could not open file\n");
      exit(-1);
    }

    // Scan through and sort characters
    while ((character = fgetc(file_ptr)) != EOF) {
      char_count = char_sort(character, char_count);
      if (char_count == 0) {
        add_pair(adj_pair[0], adj_pair[1], directed);
      }
    }
    fclose(file_ptr);
    // Use stdin
  } else {
    // Scan through input
    while ((character = getchar()) != EOF) {
      char_count = char_sort(character, char_count);
      if (char_count == 0) {
        add_pair(adj_pair[0], adj_pair[1], directed);
      }
    }
  }

  if (print) {
    print_matrix();
  }

  // Search maze
  dfs(0, path);

  if (*path_ptr == 0) {
    printf("No paths found!");
  } else {
    printf("Number of paths found: %d\n", *path_ptr);
    printf("Length of shortest path found: %d\n", *short_ptr);
  }

  stack_delete(path);

  return 0;
}
