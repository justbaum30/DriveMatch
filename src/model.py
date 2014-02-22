from google.appengine.ext import ndb

class Account(ndb.Model):
    user = ndb.UserProperty()
    hostedEvents = ndb.StructuredProperty(Event, repeated = True)
    attendedEvents = ndb.StructuredProperty(Event, repeated = True)

class Guest(ndb.Model):
    account = ndb.StructuredProperty(Account)
    nickname = ndb.StringProperty()
    canDrive = ndb.BooleanProperty()
    isDriving = ndb.BooleanProperty()
    seats = ndb.IntegerProperty()
    milesPerGallon = ndb.FloatProperty()

class Carpool(ndb.Model):
    name = ndb.StringProperty()
    driver = ndb.StructuredProperty(Guest)
    passengers = ndb.StructuredProperty(Guest, repeated = True)
    
    departureTime = ndb.DateTimeProperty()
    departureLocation = nbd.StringProperty()
    returnTime = ndb.DateTimeProperty()
    returnLocation = nbd.StringProperty()

class Event(ndb.Model):
    name = ndb.StringProperty()
    eventLocation = nbd.StringProperty()

    departureTime = ndb.DateTimeProperty()
    departureLocation = nbd.StringProperty()
    returnTime = ndb.DateTimeProperty()
    returnLocation = nbd.StringProperty()

    host = ndb.StructuredProperty(Guest)
    guests = ndb.StructuredProperty(Guest, repeated = True)
    carpools = ndb.StructuredProperty(Carpool, repeated = True)
