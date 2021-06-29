#include <inttypes.h>
#include <stdbool.h>

#include "bubble.h"

uint32_t bubble_compares = 0;
uint32_t bubble_moves = 0;

void bubble_sort(uint32_t array[], uint32_t array_size) {
  for (uint32_t i = 0; i < array_size; i++) {
    bool swapped = false;
    uint32_t j = array_size - 1;

    while (j > i) {
      bubble_compares++;
      if (array[j] < array[j - 1]) {
        uint32_t temp = array[j];
        array[j] = array[j - 1];
        array[j - 1] = temp;
        bubble_moves += 3;

        swapped = true;
      }
      j--;
    }

    if (!swapped) {
      return;
    }
  }

  return;
}
