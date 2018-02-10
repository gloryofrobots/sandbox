import tornado.gen
import collections
import webterm.collection
import abc

from tornado.gen import Return

class DBConfigurationError(Exception):
    pass


class Connection(object):
    __metaclass__ = abc.ABCMeta

    def _return(self, result):
        raise Return(result)

    @abc.abstractmethod
    def fetchall(self, query, args):
        pass

    @abc.abstractmethod
    def fetchone(self, query, args):
        pass

    @abc.abstractmethod
    def execute(self, query, args):
        pass
        

class Mapper(object):
    def __init__(self, conn):
        super(Mapper, self).__init__()
        self.conn = conn

    def _return(self, result):
        raise Return(result)


class DB(object):
    def __init__(self, dbtype, conn):
        super(DB, self).__init__()
        self.dbtype = dbtype
        self.conn = conn
        self.mappers = {}

    def choose_mapper(self, name, mappers, *args):
        try:
            mapper = mappers[self.dbtype]
        except KeyError:
            raise DBConfigurationError("Unsupported database type for component %s %s" % (self.dbtype, name))

        self._add_mapper(name, mapper, *args)

    def _add_mapper(self, name, mapper_type, *args):
        if name in self.mappers:
            raise DBConfigurationError("Mapper is already set", name)
            
        self.mappers[name]  = mapper_type(self.conn, *args)

    def get_mapper(self, name):
        return self.mappers.get(name, None)
