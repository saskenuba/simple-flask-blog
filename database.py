from datetime import datetime
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# import db from init
from martinblog import app, db


# entry model on sqlalchemy
# insert tags later
class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    content = db.Column(db.Text)
    timestamp = db.Column(db.DateTime)
    dayofweek = db.Column(db.String(20))

    def __init__(self, title, content, dayofweek=None, timestamp=None):
        self.title = title
        self.content = content
        if timestamp is None:
            timestamp = datetime.utcnow()
        self.timestamp = timestamp
        if dayofweek is None:
            dayofweek = datetime.today().weekday()
        self.dayofweek = dayofweek

    def __repr__(self):
        return '<Blog Post Object id: {}, title: {}>'.format(
            self.id, self.title)

    @property
    def serialize(self):
        # return data in serialized format
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'timestamp': dump_datetime(self.timestamp, self.dayofweek)
        }


def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    db.create_all()


def dump_datetime(value, currentday):
    """Deserialize datetime object into string form for JSON processing."""
    if value is None:
        return None
    return [
        value.strftime("%d-%m-%Y"),
        value.strftime("%H:%M:%S"),
        dump_weekday(currentday)
    ]


# returns weekday as string
def dump_weekday(weekday):

    # cast to int
    currentDay = int(weekday)

    days = [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
        "Sunday"
    ]
    return days[currentDay]
