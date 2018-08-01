import sys


" ++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++."
"++++++++++[>+++++++>++++++++++>+++<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+."
PROG = """
"++++++++++[>+++++++>++++++++++>+++<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+."
"""

RIGHT = 0
LEFT = 1
INC = 2
DEC = 3
LOOP_OPEN = 4
LOOP_CLOSE = 5
PUTC= 6
GETC = 7

OP_BITS = 3
ARG_BITS = 32 - OP_BITS
OP_MAX = (1 << OP_BITS) - 1
ARG_MAX = (1 << ARG_BITS) - 1
OP_MASK = OP_MAX << ARG_BITS
ARG_MASK = ARG_MAX

def pack(op, arg):
    return (op << ARG_BITS) + arg


def unpack_op(code):
    return (code & OP_MASK) >> ARG_BITS

def unpack_arg(code):
    return code & ARG_MASK

 # ++[>-]
SYNTAX =  [">", "<", "+", "-", ".", ",", "[", "]"]
EOF = -1

class BF:
    def __init__(self):
        self.data = [0] * 30000
        self.code = []
        self.size = 0
        self.dp = 0
        self.cp = 0

    def run(self, txt):
        self.compile(txt)
        self.eval()

    def compile(self, txt):
        self.txt = list(filter(lambda c: c in SYNTAX, [c for c in txt]))

        self.size = len(self.txt)
        self.code = [0] * self.size
        self._compile(0, -1)

    def pack(self, index, op, arg):
        print("P", index, op, arg, pack(op, arg))
        self.code[index] = pack(op, arg)

    def _compile(self, start, jump):
        i = start
        while i < self.size:
            skip = False
            # print (i, start, jump)
            ch = self.txt[i]
            arg = 0
            if ch == ">":
                op = RIGHT
            elif ch == "<":
                op = LEFT
            elif ch == "+":
                op = INC
            elif ch =="-":
                op = DEC
            elif ch == ".":
                op = PUTC
            elif ch == ",":
                op = GETC
            elif ch == "[":
                op = LOOP_OPEN
                print("LO", i)
                i = self._compile(i + 1, i)
                skip = True
            elif ch == "]":
                if jump < 0:
                    raise SyntaxError("Unmatched jump")

                op = LOOP_CLOSE
                arg = jump
                print("LC",  arg, i)
                self.pack(arg, LOOP_OPEN, i)
                self.pack(i, op, arg)
                return i
                
            if not skip:
                self.pack(i, op, arg)
            else:
                print ("skip")
            i += 1
        # sys.exit(-1)

    def eval(self):
        while self.cp < self.size:
            code = self.code[self.cp]
            op = unpack_op(code)
            arg = unpack_arg(code)
            
            print("op", self.cp, op, arg, self.get())

            if op == RIGHT:
                self.dp += 1
            elif op == LEFT:
                self.dp -= 1
            elif op == INC:
                self.add(1)
            elif op == DEC:
                self.add(-1)

            elif op == PUTC:
                sys.stdout.write(chr(self.get()))
                sys.stdout.flush()
            elif op == GETC:
                ch = sys.stdin.read(1)
                self.set(ord(ch))

            elif op == LOOP_OPEN:
                # print ("LOOP")
                if self.get() == 0:
                    self.cp = arg
            elif op == LOOP_CLOSE:
                if self.get() != 0:
                    # print("JUMP TO", self.get(), arg)
                    self.cp = arg
                    
            self.cp += 1

    def get(self):
        return self.data[self.dp]

    def set(self, v):
        self.data[self.dp] = v

    def add(self, v):
        self.data[self.dp] += v
            

bf = BF()
bf.run(PROG)
# c  = pack(7, 128)
# print(unpack_op(c))
# print(unpack_arg(c))