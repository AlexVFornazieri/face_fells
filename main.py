# coding=utf-8
import os
import webapp2
from google.appengine.ext.webapp import template

from face_detection import detect_faces_uri


class MainPage(webapp2.RequestHandler):
    def get(self):
        """Tentativa de realizar processamento
            dos resultados do Vision pelo backend"""
        url = self.request.get('image_url')
        if url:
            detect_faces_uri(url)

        """Return HTML template"""
        path = os.path.join(os.path.dirname(__file__), 'templates/index.html')
        self.response.out.write(template.render(path, {}))


app = webapp2.WSGIApplication([
    ('/', MainPage),
], debug=True)
