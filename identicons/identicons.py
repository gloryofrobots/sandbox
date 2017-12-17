import sys
import pydenticon
import hashlib
import concurrent.futures
import bson.binary
import copy
import logging
import tornado.options 
import tornado.ioloop
import tornado.web
import tornado.gen
import motor.motor_tornado


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

    def create_identicon_meta(self, name, width, height, img_format):
        """
        returns identicon dictionary
        "data" field with actual image data must be added later
        """
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
    def save_identicon(self, query, image):
        storage = self.get_storage()
        # copying query to make code more clean and prevent side effects
        identicon = copy.copy(query)
        identicon["data"] = bson.binary.Binary(image)
        yield storage.insert_one(identicon)

    def create_query(self, name):
        """
        gathers data from GET query and packs it to dict which itself maps to db structure
        """
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

        identicon = self.create_identicon_meta(
            name, width, height, img_format)
        return identicon

    @tornado.gen.coroutine
    def create_identicon_image(self, identicon):
        image = yield self.executor.submit(generate_identicon,
                                           identicon,
                                           self.config.FOREGROUND,
                                           self.config.BACKGROUND)

        raise tornado.gen.Return(image)

    @tornado.gen.coroutine
    def load_identicon_image(self, query):
        """
        :param query: dict containing all necessary query data
        :return cached identicon dict with image data from database
        """
        storage = self.get_storage()
        # count = yield storage.find().count()
        # print ">>> IDENTICONS IN STORAGE %d" % count
        # yield storage.find_one(identicon)
        # first= yield storage.find_one()
        # print "LOAD", query
        # print "FIRST", first
        # cached = yield storage.find_one(dict(
        #     name=identicon["name"],
        # ))
        cached = yield storage.find_one(query)
        if cached is not None:
            image = cached["data"]
            raise tornado.gen.Return(image)
        # yield storage.find_one(dict(name=identicon["name"]))

    @tornado.gen.coroutine
    def get(self, name):
        # input data
        query = self.create_query(name)
        cached_image = yield self.load_identicon_image(query)

        if cached_image is None:
            image = yield self.create_identicon_image(query)
            logging.info("generate new image for %s" % name)
        else:
            image = cached_image
            logging.info("load cached image for %s" % name)

        self.write(image)
        self.set_header("Content-Type", "image/%s" % query["format"])
        self.set_header("Content-Length", len(image))

        # finish request here to release connection and save image to db
        self.finish()

        if cached_image is None:
            yield self.save_identicon(query, image)


def main(config):
    # initialize file logging
    if config.LOG_FILE is not None:
        tornado.options.options['log_file_prefix'] = config.LOG_FILE
        tornado.options.parse_command_line()

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
