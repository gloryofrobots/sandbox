
void bin(unsigned n)
{
    unsigned i;
    for (i = 1 << 31; i > 0; i = i / 2) {
      printf("%d %d\n", n & i, i);
    }
    printf("\n\n");
    for (i = 1 << 31; i > 0; i = i / 2) {
      (n & i)? printf("1"): printf("0");
    }
}

void main(const char* args, int lenght){
  bin(3);
}