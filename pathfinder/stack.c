#include "stack.h"
#include <inttypes.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

// Code by DDEL
// Function to create stack
// No input
// Returns pointer to stack
Stack *stack_create(void) {
  Stack *s = (Stack *)malloc(sizeof(Stack));

  // Check if malloc worked
  if (!s) {
    printf("Malloc error");
    exit(-1);
  }

  s->top = 0;
  s->capacity = MINIMUM;

  s->items = (item *)malloc(s->capacity * sizeof(item));

  return s;
}

// Function to delete stack
// Input stack to delete
// No output
void stack_delete(Stack *s) {
  free(s->items);
  free(s);
  return;
}

// Function to check if stack is empty
// Input - stack
// Output - true or false
bool stack_empty(Stack *s) {
  if (!s->top) {
    return true;
  } else {
    return false;
  }
}

// Function to check number of items on stack
// Input - stack
// Output - number of items on stack
uint32_t stack_size(Stack *s) { return s->top; }

// Derived from DDEL
// Function to push item to stack
// Input - stack, item to push
// Output - true/false if pusih successful
bool stack_push(Stack *s, uint32_t push_item) {
  if (s->top == s->capacity) {
    s->capacity *= 2;
    s->items = (item *)realloc(s->items, sizeof(item) * s->capacity);
  }
  s->items[s->top] = push_item;
  s->top++;
  return true;
}

// Derived from DDEL
// Function to pop item from stack
// Input - stack, pointer for popped item
// Output - true/false if pop successful or not
bool stack_pop(Stack *s, uint32_t *pop_item) {
  if (stack_empty(s)) {
    printf("stack empty\n");
    return false;
  } else {
    (s->top)--;
    *pop_item = s->items[s->top];
    return true;
  }
}

// Function to print stack
// Input - stack
// Output - nothing
void stack_print(Stack *s) {
  if (stack_empty(s)) {
    return;
  }
  for (uint32_t i = 0; i < s->top; i++) {
    char character = s->items[i] + 'A';
    printf("%c -> ", character);
  }
}
