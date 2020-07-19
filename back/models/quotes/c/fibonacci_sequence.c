#include <stdio.h>
#include <stdlib.h>

int* fibonacci_sequence(int n);
void print_integers(int*, int);

int main() {
	int n;
	scanf("%i", &n);

	print_integers(fibonacci_sequence(n), n);
}

int* fibonacci_sequence(int n) {
	int* sequence = malloc(sizeof(int));
	switch(n) {
		case 0: {
			return sequence;
		}
		case 1: {
			sequence[0] = 0;
			return sequence;
		}
		case 2: {
			sequence[0] = 0;
			sequence[1] = 1;
			return sequence;
		}
		default: {
			sequence[0] = 0;
			sequence[1] = 1;

			for(int i = 2; i < n; i++) {
				sequence[i] = sequence[i - 1] + sequence[i - 2];
			}

			return sequence;
		}
	}
}

void print_integers (int* integers, int length) {
	for(int i = 0; i < length; i++) {
		printf("%i\n", integers[i]);
	}
}