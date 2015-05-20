"""
.. module:: insta_feed
   :platform: Unix
   :synopsis: Generate feeds for Instagram

.. moduleauthor:: Tim Poon <tim@timothypoon.com>

"""

import json
import requests

class InstaFeed(object):
	""" Generate feeds for Instagram

	"""

	MEDIA_ENDPOINT = 'https://api.instagram.com/v1/users/{user_id}/media/recent/?client_id={client_id}'

	def __init__(self, client_id, user_id, max_items=9):
		""" Initialize values

		:param client_id: Client ID for the Instagram API
		:type client_id: str
		:param user_id: ID of user to generate feed
		:type user_id: int
		:param max_items: Maximum number of items to fetch
		:type max_items: int

		"""
		if not isinstance(client_id, str):
			raise TypeError('Client ID must be a string')

		try:
			user_id = int(user_id)
		except TypeError:
			raise TypeError('User ID must be an int')

		try:
			max_items = int(max_items)
		except TypeError:
			raise TypeError('Item maximum must be an int')

		self.client_id = client_id
		self.user_id = user_id
		self.max_items = max_items

	def fetch_feed(self):
		""" Get the feed

		:returns: dict

		"""
		req = requests.get(
			self.MEDIA_ENDPOINT.format(user_id=self.user_id, client_id=self.client_id))

		if req.status_code != 200:
			req.raise_for_status()

		data = json.loads(req.text)
		return data['data']

	def make_json(self, file_name=None):
		""" Create the JSON for the feed

		:param file_name: Optional name of file to write JSON
		:type file_name: str
		:returns: str

		"""
		if file_name != None and not isinstance(file_name, str):
			raise TypeError('File name must be a string')

		ret = []
		data = self.fetch_feed()
		for i in range(0, self.max_items):
			ret.append({
				'link': data[i]['link'],
				'image': data[i]['images']['standard_resolution']['url'],
				'caption': data[i]['caption']['text'],
			})

		ret = json.dumps(ret)
		if file_name != None:
			fhandle = open(file_name,'w')
			fhandle.write('var feed_data = {data};'.format(data=ret))
			fhandle.close()

		return ret

FEED = InstaFeed(client_id='CLIENT_ID', user_id=18297258, max_items=3)
FEED.make_json(file_name='js/feed.js')
