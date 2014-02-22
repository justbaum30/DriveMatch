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

import webapp2
import jinja2
import logging
import cgi
import model

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
            self.templateValues['loginUrl'] = users.create_logout_url('/account')
           
            account = model.Account.query_account_for_user(self.user).get()
            if account:
                logging.critical('account exists for email ' + account.user.email())
            else:
                logging.critical('account doesnt exist - creating')
                account = model.Account(user = self.user)
                account.put()

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

class Account(CommonHandler):

    def get(self):
        self.setupUser();
        self.render('account.html')

class Events(CommonHandler):

    def get(self):
        self.setupUser()
        self.render('events.html')

app = webapp2.WSGIApplication([
    ('/', Index),
    ('/create', CreateEvent),
    ('/account', Account),
    ('/events', Events)
], debug=True)
