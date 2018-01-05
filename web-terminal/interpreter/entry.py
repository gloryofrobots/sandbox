import sys
import multiprocessing
import time
import threading
import zmq
import bson
import scheme

def evalcode(code):
    block = "(begin %s )" % code
    return scheme.eval.Eval(code)

def encode(dct):
    return bson.dumps(dct)

def decode(string):
    return bson.loads(string)

def worker_routine(worker_url, context=None):
    """Worker routine"""
    context = context or zmq.Context.instance()
    # Socket to talk to dispatcher
    socket = context.socket(zmq.REP)

    socket.connect(worker_url)

    while True:
        string  = socket.recv()
        req = decode(string)
        print("Received request: [ %s ]" % (req))

        try:
            result = evalcode(req["code"])
            socket.send(encode(dict(status="OK", result=result)))
        except Exception as e:
            socket.send(encode(dict(status="ERROR", error=e)))
        

def main():
    """Server routine"""

    url_worker = "inproc://workers"
    url_client = "tcp://*:5555"

    # Prepare our context and sockets
    context = zmq.Context.instance()

    # Socket to talk to clients
    clients = context.socket(zmq.ROUTER)
    clients.bind(url_client)

    # Socket to talk to workers
    workers = context.socket(zmq.DEALER)
    workers.bind(url_worker)

    # Launch pool of worker threads
    for i in range(5):
        thread = threading.Thread(target=worker_routine, args=(url_worker,))
        thread.start()

    zmq.proxy(clients, workers)

    # We never get here but clean up anyhow
    clients.close()
    workers.close()
    context.term()

if __name__ == "__main__":
    print sys.args
    main()