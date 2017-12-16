import tornado.ioloop
import tornado.web
from StringIO import StringIO

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
    def get(self, name):
        out_format = self.get_query_argument("format", "png")
        size_x = self.get_query_argument("size_y", 200)
        size_y = self.get_query_argument("size_x", 200)
        try:
            size_x = int(size_x)
            size_y = int(size_y)
        except ValueError:
            raise tornado.web.HTTPError(log_message="Invalid type for size attribute")

        image = generate_identicon(name, 200, 200, "png")

        # strobj = StringIO()
        # strobj.write(image)
        # self.write(strobj.getvalue())
        self.write(str(image))
        # for line in strobj.getvalue():
        #     self.write(line)

        # self.write(image)
        self.set_status(200)
        self.set_header("Content-Type", "image/png")
        self.set_header("Content-Length", len(image))
        # self.set_header("Content-Type", "text/css")
        self.finish()
        print self._headers
        # self.write("Hello, world !! %s" % name)


def main():
    app = tornado.web.Application([
        (r"/gen/(.*)", IdenticonHandler),
    ],
    debug=True)

    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
    

if __name__ == "__main__":
    main()