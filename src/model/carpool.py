from google.appengine.ext import ndb
import guest

class Carpool(ndb.Model):
    self.key = KeyProperty()
    self.driver = StructuredProperty(Driver)
    self.passengers = StructuredProperty(Passenger, repeated = True)
