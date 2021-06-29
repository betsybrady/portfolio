#include <inttypes.h>
#include <math.h>
#include <stdio.h>

#include "shell.h"

uint32_t shell_moves = 0;
uint32_t shell_compares = 0;

void gap(uint32_t length, uint32_t gaps[]) {
  uint32_t i = 0;
  while (length > 1) {
    if (length <= 2) {
      length = 1;
    } else {
      length = 5 * length / 11;
    }
    gaps[i] = length;
    i++;
  }
  return;
}

void shell_sort(uint32_t array[], uint32_t size) {
  uint32_t gap_amount = log10(size) * 3;

  uint32_t gaps[gap_amount];

  gap(size, gaps);

  for (uint32_t s = 0; s < gap_amount; s++) {
    if ((gaps[s] > 0) && (gaps[s] <= gaps[0])) {
      uint32_t step = gaps[s];
      for (uint32_t i = step; i < size; i++) {
        for (uint32_t j = i; j >= step; j -= step) {
          shell_compares++;
          if (array[j] < array[j - step]) {
            uint32_t temp = array[j];
            array[j] = array[j - step];
            array[j - step] = temp;
            shell_moves += 3;
          }
        }
      }
    } else {
      return;
    }
  }

  return;
}
