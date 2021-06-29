#ifndef __QUICK_H__
#define __QUICK_H__

#include <inttypes.h>

extern uint32_t quick_moves;
extern uint32_t quick_compares;

void quick_sort(uint32_t array[], uint32_t left, uint32_t right);

#endif
