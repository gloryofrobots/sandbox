import sys
import logging
import tornado.options
import tornado.ioloop
import tornado.web
import sockjs.tornado
import webterm.connection
import webterm.component
import webterm.context


######################################################

# import tornado.gen
# @tornado.gen.coroutine
# def test_db(db):
#     users = yield db.get_mapper("user").get_users()
#     print users
######################################################
######################################################
######################################################

def __get_components():
    from webterm.component.user import user
    from webterm.component.error import error
    from webterm.component.basic import basic
    from webterm.component.scm import scm
    return [
        ("BASIC", basic),
        ("USER", user),
        ("ERROR", error),
        ("SCM", scm),
    ]


def main(config):
    # initialize file logging
    if config.DEBUG:
        tornado.options.options['logging'] = "debug"

    if config.LOG_FILE is not None:
        tornado.options.options['log_file_prefix'] = config.LOG_FILE
        # this will enable logging options
        tornado.options.parse_command_line()
    # print protocol.base.PingProtocol
    components = __get_components()

    ioloop = tornado.ioloop.IOLoop.current()
    ctx = webterm.context.create_context(components, config, ioloop)

    # tornado.ioloop.IOLoop.current().spawn_callback(test_db, db)
    router = sockjs.tornado.SockJSRouter(
        webterm.connection.make_connection(components, ctx), '/api')

    application = tornado.web.Application(router.urls,
                                          debug=config.DEBUG,
                                          config=config,
                                          ctx=ctx)

    try:
        application.listen(config.PORT)
        ioloop.start()
    except Exception as e:
        logging.error("Uncaught Error %s", e)
        try:
            ctx.destroy()
        except Exception as e:
            logging.error("Error while destroying context %s", e)
        
            


if __name__ == "__main__":
    import config
    main(config)
