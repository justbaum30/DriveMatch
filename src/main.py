#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import os
import urllib

from google.appengine.api import users
from google.appengine.api import mail

import webapp2
import jinja2
import logging
import cgi
import model
import datetime
import json

from google.appengine.ext import ndb

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class CommonHandler(webapp2.RequestHandler):
    def setupUser(self):
        self.user = users.get_current_user()
        self.templateValues = {}
        if self.user:
            self.templateValues['signedIn'] = True
            self.templateValues['loginUrl'] = users.create_logout_url('/')
           
            self.account = model.Account.query_account_for_user(self.user).get()
            if self.account:
                logging.critical('account exists for email ' + self.account.user.email())
            else:
                logging.critical('account doesnt exist - creating')
                self.account = model.Account(user = self.user)
                self.account.put()
        else:
            self.templateValues['loginUrl'] = users.create_login_url('/account')

    def render(self,htmlFile):
        template = JINJA_ENVIRONMENT.get_template(htmlFile)
        self.response.out.write(template.render(self.templateValues))

class MainPage(CommonHandler):
    def get(self):
        self.setupUser()
        self.render('main.html')

class Index(CommonHandler):
    def get(self):
        self.setupUser()
        self.render('index.html')

class CreateEvent(CommonHandler):
    def get(self):
        self.setupUser();
        self.render('create.html')

    def post(self):
        self.setupUser();

        dateTimeFormat = "%B %d %Y %H:%M %p"
        departureDateTime = datetime.datetime.strptime(self.request.get('departureDateTime'), dateTimeFormat)
        returnDateTime = datetime.datetime.strptime(self.request.get('returnDateTime'), dateTimeFormat)

        departureLocation = model.EventLocation(streetAddress = self.request.get('departureLocation'))
        eventLocation = model.EventLocation(streetAddress = self.request.get('eventLocation'))

        host = model.Guest(account = self.account, nickname = self.user.nickname(), email = self.user.email())
        newEvent = model.Event(name = self.request.get('eventName'),
                            departureTime = departureDateTime,
                            returnTime = returnDateTime,
                            eventLocation = eventLocation,
                            departureLocation = departureLocation,
                            host = host,
                            guests = [],
                            carpools = [])
        newEvent.urlsuffix = newEvent.generate_url_suffix(newEvent.name, newEvent.host.nickname)
       
        json_guests = json.loads(self.request.get('guests'))
        for json_guest in json_guests:
            guest = model.Guest(email = json_guest['personEmail'], nickname = json_guest['personName'])
            newEvent.guests.append(guest)

        newEvent.put()

        email = mail.EmailMessage(sender = "Justin B <drive-match@appspot.gserviceaccount.com",
                                to = "Justinnnn <justbaum30@gmail.com",
                                subject = "You got a nice thing",
                                body = """
Hey you.
Hope you're well. This is great.

Thanks,
Justin
""")
        email.send()
        
        self.response.out.write(json.dumps(newEvent.urlsuffix))

class Account(CommonHandler):

    def get(self):
        self.setupUser();
        self.templateValues['UserName'] = self.user.nickname()

        self.templateValues['FutureHostedEvents'] = model.Event.query_future_events_with_host(self.account)
        if self.templateValues['FutureHostedEvents'].get():
            self.templateValues['HasFutureEvents'] = True

        self.templateValues['FutureGuestEvents'] = model.Event.query_future_events_with_guest(self.account)
        if self.templateValues['FutureGuestEvents'].get():
            self.templateValues['HasFutureEvents'] = True

        self.templateValues['PastHostedEvents'] = model.Event.query_past_events_with_host(self.account)
        if self.templateValues['PastHostedEvents'].get():
            self.templateValues['HasPastEvents'] = True

        self.templateValues['PastGuestEvents'] = model.Event.query_past_events_with_guest(self.account)
        if self.templateValues['PastGuestEvents'].get():
            self.templateValues['HasPastEvents'] = True

        self.render('account.html')

class Events(CommonHandler):
    def get(self):
        self.setupUser()
        self.render('events.html')

class Signup(CommonHandler):

    def get(self):
        self.setupUser()
        eventName = self.request.get('eventName')
        hostName = self.request.get('hostName')

        event = model.Event.query_events_with_event_name(hostName, eventName).get()

        self.templateValues['HostName'] = event.host.nickname
        self.templateValues['EventName'] = event.name
        self.templateValues['Destination'] = event.eventLocation.streetAddress
        self.templateValues['Origin'] = event.departureLocation.streetAddress
        self.templateValues['DepartureDate'] = event.departureTime
        self.templateValues['ReturnDate'] = event.returnTime

        logging.critical(eventName)
        logging.critical(hostName)
        self.render('signup.html')

    def post(self):
        self.setupUser();

        account = totalSeats = availableSeats = milesPerGallon = None
        canDrive = self.request.get('canDrive') != ''
        if canDrive == True:
            totalSeats = int(self.request.get('totalSeats'))
            availableSeats = int(self.request.get('availableSeats'))
            milesPerGallon = float(self.request.get('gasMileage'))

        if not self.user:
            nickname = self.request.get('nameInput')
            email = self.request.get('emailInput')
        else:
            account = self.account
            nickname = self.user.nickname()
            email = self.user.email()

        guest = model.Guest(account = account,
                            email = email,
                            nickname = nickname,
                            canDrive = canDrive,
                            totalSeats = totalSeats,
                            availableSeats = availableSeats,
                            milesPerGallon = milesPerGallon)
        guest.put()

        hostName = self.request.get('hostName')
        eventName = self.request.get('eventName')
        event = model.Event.query_events_with_event_name(hostName, eventName).get()
        event.guests.append(guest)
        event.put()

app = webapp2.WSGIApplication([
    ('/', Index),
    ('/create', CreateEvent),
    ('/account', Account),
    ('/events', Events),
    ('/signup', Signup)
], debug=True)
