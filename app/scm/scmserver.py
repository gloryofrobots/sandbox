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

def worker(worker_url, context):
    print "WORKER CREATED"
    """Worker routine"""
    # Socket to talk to dispatcher
    socket = context.socket(zmq.REP)

    socket.connect(worker_url)

    while True:
        try:
            string  = socket.recv()
            req = decode(string)
            print("Received request: [ %s ]" % (req))

            try:
                result = evalcode(req["code"])
                socket.send(encode(dict(status="OK", result=str(result))))
            except Exception as e:
                socket.send(encode(dict(status="ERR", error=str(e))))
        except KeyboardInterrupt:
            socket.close()
            return

def main(url):
    """Server routine"""

    url_worker = "inproc://workers"

    # Prepare our context and sockets
    context = zmq.Context.instance()

    # Socket to talk to clients
    clients = context.socket(zmq.ROUTER)
    clients.bind(url)

    # Socket to talk to workers
    workers = context.socket(zmq.DEALER)
    workers.bind(url_worker)

    # Launch pool of worker threads
    threads = []
    for i in range(5):
        thread = threading.Thread(target=worker, args=(url_worker, context))
        threads.append(thread)
        thread.start()
        # process = multiprocessing.Process(target=worker, args=(url_worker,context))
        # process.start()

    try:
        zmq.proxy(clients, workers)
    except KeyboardInterrupt:
        clients.close()
        workers.close()
        context.term()
    # We never get here but clean up anyhow
    # clients.close()
    # workers.close()
    # context.term()

if __name__ == "__main__":
    if len(sys.argv) == 1:
        url = "tcp://*:5555"
    else:
        url = sys.argv[1]
        
    main(url)