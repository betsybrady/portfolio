CFLAGS=-Wall -Wextra -Werror -Wpedantic
CC=clang $(CFLAGS)
SOURCES = pathfinder.c stack.c
OBJECTS = $(SOURCES:%.c=%.o)

all		: pathfinder

pathfinder	: $(OBJECTS)
		$(CC) -o pathfinder $(OBJECTS)

pathfinder.o	:	pathfinder.c
		$(CC) $(CFLAGS)  -c pathfinder.c
stack.o		:	stack.c
		$(CC) $(CFLAGS) -c stack.c

clean		:
		rm -f pathfinder $(OBJECTS)
infer		:
		make clean; infer-capture -- make; infer-analyze -- make
