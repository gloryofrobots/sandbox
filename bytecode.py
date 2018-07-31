MAX_BIT_COUNT = 32
OP_BIT_COUNT = 6
ARG_BIT_COUNT = MAX_BIT_COUNT - OP_BIT_COUNT
OP_MAX = (1 << OP_BIT_COUNT) - 1
ARG_MAX = (1 << ARG_BIT_COUNT) - 1

OP_MASK = OP_MAX << ARG_BIT_COUNT
ARG_MASK = ARG_MAX


def num_to_bin_str(n):
    result = []
    for i in range(31, -1, -1):
        mask = 1 << i
        b = n & mask
        result.append(int(b > 0))
    return "".join(map(str, result))

def print_bin(n):
    print num_to_bin_str(n)

print_bin(33)

def pack(op, arg):
    code = (op << ARG_BIT_COUNT) + arg
    return code

def unpack_op(code):
    return (code & OP_MASK) >> ARG_BIT_COUNT

def unpack_arg(code):
    return code & ARG_MASK


op = 3
arg = 42
code = pack(op, arg)
op2 = unpack_op(code)
arg2 = unpack_arg(code)

# for i in range(31, -1, -1):
#     mask = 1 << i
#     print_bin(mask)

print op, op2, arg, arg2