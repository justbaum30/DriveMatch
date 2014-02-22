from google.appengine.ext import ndb

class Guest(ndb.Model):
    self.user = UserProperty()
    self.key = KeyProperty()

class Driver(Guest):
    self.seats = IntegerProperty()

class Passenger(Guest):
