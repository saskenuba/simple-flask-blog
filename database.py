from datetime import datetime
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# connection to local database
db_conn = 'postgresql+psycopg2://martin@localhost/martinblog'

# creates db
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = db_conn
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# entry model on sqlalchemy
class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    content = db.Column(db.Text)
    timestamp = db.Column(db.DateTime)

    def __init__(self, id, title, content, category, timestamp=None):
        self.title = title
        self.content = content
        if timestamp is None:
            timestamp = datetime.utcnow()
        self.timestamp = timestamp


def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    db.create_all()
