import tornado.gen
import collections
import webterm.collection
import abc

from tornado.gen import Return

class DBConnection(object):
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
        

class DBMapper(object):
    def __init__(self, conn):
        super(DBMapper, self).__init__()
        self.conn = conn

    def _return(self, result):
        raise Return(result)


class DB(object):

    def __init__(self, conn):
        super(DB, self).__init__()
        self.conn = conn
        self.mappers = webterm.collection.Collection("DBMapper")

    def add_mapper(self, name, mapper_type, *args):
        self.mappers.add(name, mapper_type(self.conn, *args))

    def finalize():
        self.mappers = self.mappers.pack()