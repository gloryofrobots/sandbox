
import zmq
import sys
import bson


REQUESTS = map(
    lambda s: bson.dumps(dict(code=s)),
        [
            "(+ 1 2)",
            "(- 1 2)",
            "(* 1 2)",
            "(/ 1 2)",
        ]
)

def main(requests):
    """Server routine"""
    url = "tcp://localhost:5555"
    context = zmq.Context.instance()
    socket = context.socket(zmq.REQ)
    socket.connect(url)
    for request in requests:
        socket.send(request)
        message = socket.recv()
        message = bson.loads(message)
        print "RECIEVED REPLY", message

    # We never get here but clean up anyhow
    socket.close()
    context.term()

if __name__ == "__main__":
    main(REQUESTS)