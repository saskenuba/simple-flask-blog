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
    imagelink = db.Column(db.String(100))
    content = db.Column(db.Text)
    timestamp = db.Column(db.DateTime)
    dayofweek = db.Column(db.String(20))
    tags = db.Column(db.String(100))

    def __init__(self,
                 title,
                 content,
                 imagelink=None,
                 tags=None,
                 dayofweek=None,
                 timestamp=None):
        self.title = title
        self.content = content

        if imagelink is None:
            self.imagelink = 'Sem imagens'
        self.imagelink = imagelink

        if tags is None:
            self.tags = 'Sem tags'
        self.tags = tags

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
            'imagelink': self.imagelink,
            'timestamp': dump_datetime(self.timestamp, self.dayofweek),
            'tags': self.tags
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
        value.strftime("%d"),
        dump_month(value.strftime("%m")),
        value.strftime("%Y"),
        dump_weekday(currentday)
    ]


# returns weekday as string
def dump_weekday(weekday):

    # cast to int
    currentDay = int(weekday)

    days = [
        "Segunda-feira", "Terça-feira", "Quarta-Feira", "Quinta-feira",
        "Sexta-feira", "Sábado", "Domingo"
    ]
    return days[currentDay]


def dump_month(month):
    currentMonth = int(month)

    months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
        "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]
    return months[currentMonth - 1]
