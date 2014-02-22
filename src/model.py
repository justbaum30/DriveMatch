from google.appengine.ext import ndb
from google.appengine.api import users

class Account(ndb.Model):
    user = ndb.UserProperty()

    @classmethod
    def query_account_for_user(cls, queryUser):
        return Account.query(Account.user == queryUser)

class EventLocation(ndb.Model):
    streetAddress = ndb.StringProperty()
    city = ndb.StringProperty()
    state = ndb.StringProperty()
    latitude = ndb.FloatProperty()
    longitude = ndb.FloatProperty()

class Guest(ndb.Model):
    account = ndb.StructuredProperty(Account)
    email = ndb.StringProperty()
    nickname = ndb.StringProperty()
    canDrive = ndb.BooleanProperty()
    isDriving = ndb.BooleanProperty()
    availableSeats = ndb.IntegerProperty()
    totalSeats = ndb.IntegerProperty()
    milesPerGallon = ndb.FloatProperty()

    @classmethod
    def query_guest_instances_for_account(cls, queryAccount):
        return Guest.query(Guest.account == queryAccount)

class Carpool(ndb.Model):
    name = ndb.StringProperty()
    driver = ndb.StructuredProperty(Guest)
    passengers = ndb.StructuredProperty(Guest, repeated = True)
    
    departureTime = ndb.DateTimeProperty()
    departureLocation = ndb.StructuredProperty(EventLocation) 
    returnTime = ndb.DateTimeProperty()
    returnLocation = ndb.StructuredProperty(EventLocation)

    @classmethod
    def query_carpools_for_guest(cls, queryGuest):
        return Carpool.query(ndb.OR(Carpool.driver == queryGuest,
                                    Carpool.passengers.IN([queryGuest])))

    @classmethod
    def query_carpools_for_driver(cls, queryDriver):
        return Carpool.query(Carpool.driver == queryDriver)
    
    def seats_remaining():
        return (driver.availableSeats - passengers.count)

class Event(ndb.Model):
    name = ndb.StringProperty()

    eventLocation = ndb.StructuredProperty(EventLocation)
    eventTime = ndb.DateTimeProperty()

    departureTime = ndb.DateTimeProperty()
    returnTime = ndb.DateTimeProperty()
    departureLocation = ndb.StructuredProperty(EventLocation)

    host = ndb.StructuredProperty(Guest)
    guests = ndb.StructuredProperty(Guest, repeated = True)
    carpools = ndb.LocalStructuredProperty(Carpool, repeated = True)
    
    @classmethod
    def query_events_with_host(cls, queryAccount):
        return Event.query(Event.host.account == queryAccount).order(Event.departureTime)

    @classmethod
    def query_events_with_guest(cls, queryAccount):
        return Event.query(Event.guests.account == queryAccount).order(Event.departureTime)
