// All code from DDEL

#ifndef __STACK_H__
#define __STACK_H__

#include <inttypes.h>
#include <stdbool.h>

#define MINIMUM 32

typedef uint32_t item;

typedef struct Stack {
  uint32_t *items;
  uint32_t top;
  uint32_t capacity;
} Stack;

// Constructor for a stack
// Returns pointer to stack
Stack *stack_create(void);

// Destructor for a stack
// Returns void
void stack_delete(Stack *s);

// Checks if stack is empty
// Returns true if it is, false if it isn't
bool stack_empty(Stack *s);

// Checks stack size
// Returns number of items in stack
uint32_t stack_size(Stack *s);

// Pushes an item onto the stack
// Returns true if item pushed, false otherwise
bool stack_push(Stack *s, uint32_t item);

// Pops an item off the stack
// Item stored in pointer
// Returns true if item popped, false if not
bool stack_pop(Stack *s, uint32_t *item);

// Prints contents of stack
// Returns void
void stack_print(Stack *s);

#endif
