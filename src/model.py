from google.appengine.ext import ndb


class Guest(ndb.Model):
    user = ndb.StringProperty()
    key = ndb.StringProperty()

class Driver(Guest):
    seats = ndb.IntegerProperty()

class Passenger(Guest):
    age = ndb.IntegerProperty()

class Carpool(ndb.Model):
    key = ndb.KeyProperty()
    driver = ndb.StructuredProperty(Driver)
    passengers = ndb.StructuredProperty(Passenger, repeated = True)

class Event(ndb.Model):
    key = ndb.KeyProperty()
    eventTimeAndDate = ndb.DateTimeProperty()
    host = ndb.StructuredProperty(Guest)
    guests = ndb.StructuredProperty(Guest, repeated = True)
