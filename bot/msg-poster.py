#!/usr/bin/env python
import sys
import optparse
import httplib, urllib
import base64
import json
import uuid

# Constants
host = 'training.loicortola.com:80'

# Get parser singleton
parser = optparse.OptionParser()
parser.add_option('-u', '--user', dest='user', help='Username')
parser.add_option('-p', '--password', dest='password', help='Your Age')
parser.add_option('-s', '--send', type="int", dest='messages', help='Number of messages to send')
# Parse args into options
(options, args) = parser.parse_args()



# Ask for parameters if not provided
if options.user is None:
	options.user = raw_input('Enter username:')

if options.password is None:
	options.password = raw_input('Enter password:')

if options.messages is None:
	options.messages = int(raw_input('Enter number of messages to send:'))

def register(user, password):
	params = json.dumps({'login': options.user, 'password': options.password})
        headers = {"Content-type": "application/json"}
        conn = httplib.HTTPConnection(host)
        conn.request("POST", "/chat-rest/2.0/register", params, headers)
        response = conn.getresponse()
	if response.status == 200:
		print('User registered successfully')
	else:
		print('User failed to register. Maybe it already exists')

def send_message(i):
	params = json.dumps({'uuid':str(uuid.uuid4()), 'login': options.user, 'message': 'Hello ' + str(i)})
	print('Sending params: ' + params)
	headers = {"Content-type": "application/json", "Authorization": "Basic " + base64.b64encode(options.user + ':' + options.password)}
	conn = httplib.HTTPConnection("training.loicortola.com:80")
	conn.request("POST", "/chat-rest/2.0/messages", params, headers)
	response = conn.getresponse()
	print(response.status, response.reason)
	print(response.read())

# Register user if necessary
register(options.user, options.password)

# Send messages
i = 0
while i < options.messages:
	send_message(i)
	i = i + 1	

