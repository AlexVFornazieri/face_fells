import os
import webapp2
from google.appengine.ext.webapp import template

from face_detection import detect_faces_uri


class MainPage(webapp2.RequestHandler):
    def get(self):
        url = self.request.get('url')
        if url:
            detect_faces_uri(url)

        path = os.path.join(os.path.dirname(__file__), 'templates/index.html')
        self.response.out.write(template.render(path, {}))


app = webapp2.WSGIApplication([
    ('/', MainPage),
], debug=True)
