#include <inttypes.h>

#include "binary.h"

uint32_t binary_moves = 0;
uint32_t binary_compares = 0;

void binary_insertion_sort(uint32_t array[], uint32_t size) {
  for (uint32_t i = 1; i < size; i++) {
    uint32_t value = array[i];
    uint32_t left = 0;
    uint32_t right = i;

    while (left < right) {
      uint32_t mid = left + ((right - left) / 2);
      binary_compares++;
      if (value >= array[mid]) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    for (uint32_t j = i; j > left; j--) {
      uint32_t temp = array[j];
      array[j] = array[j - 1];
      array[j - 1] = temp;
      binary_moves += 3;
    }
  }

  return;
}
