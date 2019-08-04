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

	FILE_BASE = '{filename}'
	LINK_BASE = 'https://www.instagram.com/p/{shortcode}/'
	MEDIA_ENDPOINT = 'https://www.instagram.com/{username}/?__a=1'

	def __init__(self, username, max_items=9):
		""" Initialize values

		:param username: ID of user to generate feed
		:type username: str
		:param max_items: Maximum number of items to fetch
		:type max_items: int

		"""
		if not isinstance(username, str):
			raise TypeError('username must be a str')

		try:
			max_items = int(max_items)
		except TypeError:
			raise TypeError('Item maximum must be an int')

		self.username = username
		self.max_items = max_items

	def fetch_feed(self):
		""" Get the feed

		:returns: dict

		"""
		req = requests.get(self.MEDIA_ENDPOINT.format(username=self.username))

		if req.status_code != 200:
			req.raise_for_status()

		data = json.loads(req.text)

		return data['graphql']['user']['edge_owner_to_timeline_media']['edges']

	def make_json(self, filename=None):
		""" Create the JSON for the feed

		:param filename: Optional name of file to write JSON
		:type filename: str
		:returns: str

		"""
		if filename != None and not isinstance(filename, str):
			raise TypeError('File name must be a str')

		ret = []
		data = self.fetch_feed()

		for i in range(0, self.max_items):
			ret.append({
				'link': self.LINK_BASE.format(shortcode=data[i]['node']['shortcode']),
				'image': data[i]['node']['display_url'],
				'thumbnail': data[i]['node']['thumbnail_src'],
				'caption': data[i]['node']['edge_media_to_caption']['edges'][0]['node']['text'],
				'location': data[i]['node']['location']['name'] if data[i]['node']['location'] else None,
				'is_video': data[i]['node']['is_video'],
				'dimensions': {
					'width': data[i]['node']['dimensions']['width'],
					'height': data[i]['node']['dimensions']['height'],
				},
			})

		ret = json.dumps(ret)

		if filename:
			fhandle = open(self.FILE_BASE.format(filename=filename),'w')
			fhandle.write('var feed_data = {data};'.format(data=ret))
			fhandle.close()
		else:
			print(ret)

		return ret


FEED = InstaFeed(username='mockenoff', max_items=3)
FEED.make_json(filename='js/feed.js')
