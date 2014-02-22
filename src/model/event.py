from google.appengine.ext import ndb
import guest

class Event:
    self.key = KeyProperty()
    self.eventTimeAndDate = DateTimeProperty()
    self.host = StructuredProperty(Guest)
    self.guests = StructuredProperty(Guest, repeated = True)
