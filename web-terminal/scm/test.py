import scheme
CODE = """
(begin
    (let ((x 4))
        (- 2 x)))
"""

print scheme.eval.Eval(CODE)