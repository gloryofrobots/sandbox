import tornado.ioloop
import tornado.web
import tornado.gen
from concurrent.futures import ThreadPoolExecutor
import sys

def generate_identicon(name, size_x, size_y, output_format):
    import pydenticon
    import hashlib
    foreground = [ "rgb(45,79,255)",
                "rgb(254,180,44)",
                "rgb(226,121,234)",
                "rgb(30,179,253)",
                "rgb(232,77,65)",
                "rgb(49,203,115)",
                "rgb(141,69,170)" ]

    background = "rgb(224,224,224)"

    # Instantiate a generator that will create 5x5 block identicons using SHA1
    # digest.
    generator = pydenticon.Generator(5, 5, digest=hashlib.sha1,
                                    foreground=foreground, background=background)

    # Generate same identicon in three different formats.
    image = generator.generate(name, size_x, size_y,
                                    output_format=output_format)
    return image


class IdenticonHandler(tornado.web.RequestHandler):
    __FORMATS = ["gif", "png"]
    __DEFAULT_FORMAT = "png"
    __DEFAUT_SIZE = 200
    executor = ThreadPoolExecutor(max_workers=2)

    @tornado.gen.coroutine
    def get(self, name):
        out_format = self.get_query_argument("format", self.__DEFAULT_FORMAT)
        size_x = self.get_query_argument("size_x", self.__DEFAUT_SIZE)
        size_y = self.get_query_argument("size_y", self.__DEFAUT_SIZE)
        try:
            size_x = int(size_x)
            size_y = int(size_y)
        except ValueError:
            raise tornado.web.HTTPError(log_message="Invalid type for size attribute")
        if out_format not in self.__FORMATS:
            raise tornado.web.HTTPError(log_message="Unsupported output format")
            

        image = yield self.executor.submit(generate_identicon, name, size_x, size_y, out_format)
        # image = generate_identicon(name, size_x, size_y, out_format)

        self.write(image)
        self.set_status(200)
        self.set_header("Content-Type", "image/%s" % out_format)
        self.set_header("Content-Length", len(image))

def print_help():
    print "Usage: python identicons.py PORT"

def main():
    if len(sys.argv) != 2:
        print_help()
        return

    try:
        port = int(sys.argv[1])
    except:
        print_help()
        return
        
    app = tornado.web.Application([
        (r"/gen/(.*)", IdenticonHandler),
    ],
    debug=True)

    app.listen(port)
    tornado.ioloop.IOLoop.current().start()
    

if __name__ == "__main__":
    main()