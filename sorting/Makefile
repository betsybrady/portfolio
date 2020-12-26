CFLAGS=-Wall -Wextra -Werror -Wpedantic -Wshadow -std=c99
CC=clang $(CFLAGS)
SOURCES = sorting.c bubble.c shell.c quick.c binary.c
OBJECTS = $(SOURCES:%.c=%.o)

all		: sorting

sorting		: $(OBJECTS)
		$(CC) -o sorting $(OBJECTS) -lm

sorting.o	: sorting.c bubble.h shell.h quick.h binary.h
		$(CC) $(CFLAGS) -c sorting.c

bubble.o	: bubble.c bubble.h
		$(CC) $(CFLAGS) -c bubble.c

shell.o		: shell.c shell.h
		$(CC) $(CFLAGS) -c shell.c

quick.o		: quick.c quick.h
		$(CC) $(CFLAGS) -c quick.c


binary.o	: binary.c binary.h
		$(CC) $(CFLAGS) -c binary.c

valgrind	: sorting
		valgrind ./sorting

clean		:
		rm -f sorting $(OBJECTS)

infer		:
		make clean; infer-capture -- make; infer-analyze -- make
