import sys
PROG = """
" ++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++."
"""

" ++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++."
 # ++[>-]
SYNTAX =  [">", "<", "+", "-", ".", ",", "[", "]"]
EOF = -1

class BF:
    def __init__(self):
        self.data = [0] * 30000
        self.code = []
        self.dp = 0
        self.cp = 0

    def run(self, txt):
        self.code = list(filter(lambda c: c in SYNTAX, [c for c in txt]))
        self.code.append(EOF)
        self.eval()

    def eval(self):
        self._eval(EOF)

    def _eval(self, goto):
        while True:
            op = self.code[self.cp]
            # print("op", self.cp, op, goto)
            if op == ">":
                self.dp += 1
            elif op == "<":
                self.dp -= 1
            elif op == "+":
                self.add(1)
            elif op == "-":
                self.add(-1)

            elif op == ".":
                sys.stdout.write(chr(self.get()))
                sys.stdout.flush()
            elif op == ",":
                ch = sys.stdin.read(1)
                self.set(ord(ch))

            elif op == "[":
                # print ("LOOP")
                if self.get() == 0:
                    # print("SKIPPING")
                    loop_count = 1
                    self.cp += 1
                    while True:
                        op = self.code[self.cp]
                        if op == "]":
                            loop_count -= 1
                            # print ("LOOP CLOSED")
                            if loop_count == 0:
                                break
                        elif op == EOF:
                            raise SyntaxError("UNCLOSED LOOP")
                        elif op == "[":
                            loop_count += 1

                        self.cp += 1
                    
                else:
                    # print("ENTER LOOP")
                    self.cp += 1
                    goto = self._eval(self.cp)

            elif op == "]":
                if self.get() != 0:
                    if goto == EOF:
                        raise SyntaxError("INVALID LOOP CONDITION")
                    # print("JUMP TO", goto)
                    self.cp = goto
                    return goto
                
            elif op == EOF:
                sys.stdout.flush()
                return
            self.cp += 1

    def get(self):
        return self.data[self.dp]

    def set(self, v):
        self.data[self.dp] = v

    def add(self, v):
        self.data[self.dp] += v
            

bf = BF()
bf.run(PROG)