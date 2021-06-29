#include <inttypes.h>
#include <stdbool.h>

#include "quick.h"

uint32_t quick_moves = 0;
uint32_t quick_compares = 0;

uint32_t partition(uint32_t array[], uint32_t left, uint32_t right) {
  uint32_t pivot = array[left];
  uint32_t lo = left + 1;
  uint32_t hi = right;

  while (true) {
    quick_compares++;
    while ((lo <= hi) && (array[hi] >= pivot)) {
      hi--;
    }
    quick_compares++;
    while ((lo <= hi) && (array[lo] <= pivot)) {
      lo++;
    }

    if (lo < hi) {
      uint32_t temp = array[lo];
      array[lo] = array[hi];
      array[hi] = temp;
      quick_moves += 3;
    } else {
      break;
    }
  }
  uint32_t temp = array[left];
  array[left] = array[hi];
  array[hi] = temp;
  quick_moves += 3;

  return hi;
}

void quick_sort(uint32_t array[], uint32_t left, uint32_t right) {
  if (left < right) {
    uint32_t index = partition(array, left, right);
    if (index > 0) {
      quick_sort(array, left, index - 1);
    } else {
      quick_sort(array, left, index);
    }
    quick_sort(array, index + 1, right);
  }
  return;

  return;
}
