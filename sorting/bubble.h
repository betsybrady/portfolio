#ifndef __BUBBLE_H__
#define __BUBBLE_H__

#include <inttypes.h>
#include <stdbool.h>

extern uint32_t bubble_moves;
extern uint32_t bubble_compares;

void bubble_sort(uint32_t array[], uint32_t array_size);

#endif
