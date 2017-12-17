import tornado.ioloop
import tornado.web
import tornado.gen
import sys
import motor.motor_tornado
import pydenticon
import hashlib
import concurrent.futures
import bson.binary


def generate_identicon(identicon, foreground, background):
    # Instantiate a generator that will create 5x5 block identicons using SHA1
    generator = pydenticon.Generator(identicon["rows"],
                                     identicon["columns"],
                                     digest=hashlib.sha1,
                                     foreground=foreground,
                                     background=background)

    image = generator.generate(identicon["name"],
                               identicon["width"],
                               identicon["height"],
                               output_format=identicon["format"])
    return image


class IdenticonHandler(tornado.web.RequestHandler):
    executor = concurrent.futures.ThreadPoolExecutor(max_workers=2)

    def initialize(self, config):
        self.config = config

    def create_identicon(self, name, width, height, img_format):
        return dict(
            name=name,
            width=width,
            height=height,
            format=img_format,
            rows=self.config.BLOCK_SIZE,
            columns=self.config.BLOCK_SIZE,
        )

    def get_storage(self):
        db = self.settings["db"]
        identicons = db.identicons
        return identicons

    @tornado.gen.coroutine
    def save_identicon(self, identicon):
        storage = self.get_storage()
        identicon["data"] = bson.binary.Binary(identicon["data"])
        yield storage.insert_one(identicon)

    def create_identicon_from_query(self, name):
        img_format = self.get_query_argument(
            "format", self.config.DEFAULT_FORMAT)
        if img_format not in self.config.FORMATS:
            raise tornado.web.HTTPError(
                log_message="Unsupported output format")

        width_str = self.get_query_argument("width", self.config.DEFAUT_SIZE)
        height_str = self.get_query_argument("height", self.config.DEFAUT_SIZE)
        try:
            width = int(width_str)
            height = int(height_str)
        except ValueError:
            raise tornado.web.HTTPError(
                log_message="Invalid type for size attribute")

        # size validation
        if width > config.MAX_SIZE or height > self.config.MAX_SIZE:
            raise tornado.web.HTTPError(
                log_message="Requested size is too big")

        if width < config.MIN_SIZE or height < self.config.MIN_SIZE:
            raise tornado.web.HTTPError(
                log_message="Requested size is too small")

        identicon = self.create_identicon(
            name, width, height, img_format)
        return identicon

    @tornado.gen.coroutine
    def create_identicon_image(self, identicon):
        image = yield self.executor.submit(generate_identicon,
                                           identicon,
                                           self.config.FOREGROUND,
                                           self.config.BACKGROUND)

        identicon["data"] = image
        raise tornado.gen.Return(identicon)

    @tornado.gen.coroutine
    def load_identicon(self, identicon):
        """
        :param identicon: dictionary containing all  necessary query data
        """
        storage = self.get_storage()
        count = yield storage.find().count()
        print ">>> IDENTICONS IN STORAGE %d" % count
        # yield storage.find_one(identicon)
        first= yield storage.find_one()
        print "LOAD", identicon
        print "FIRST", first
        # cached = yield storage.find_one(dict(
        #     name=identicon["name"],
        # ))
        cached = yield storage.find_one(identicon)
        # print "CACHED", cached
        raise tornado.gen.Return(cached)
        # yield storage.find_one(dict(name=identicon["name"]))

    @tornado.gen.coroutine
    def get(self, name):
        # input data
        identicon_query = self.create_identicon_from_query(name)
        cached_identicon = yield self.load_identicon(identicon_query)
        identicon = None
        if cached_identicon is None:
            print "GENERATE NEW"
            identicon = yield self.create_identicon_image(identicon_query)
        else:
            print "LOAD CACHED"
            identicon = cached_identicon

        self.write(identicon["data"])
        # self.set_status(200)
        self.set_header("Content-Type", "image/%s" % identicon["format"])
        self.set_header("Content-Length", len(identicon["data"]))
        self.finish()

        if cached_identicon is None:
            yield self.save_identicon(identicon)


def main(config):
    client = motor.motor_tornado.MotorClient(config.MONGODB_HOST)
    # client.drop_database("identicons")
    db = client.identicons

    app = tornado.web.Application([
        (r"/gen/(.*)", IdenticonHandler, dict(config=config)),
    ],
        debug=config.DEBUG,
        db=db)

    app.listen(config.TORNADO_PORT)
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    import config
    main(config)
