from datetime import datetime
from flask_login import UserMixin
from slugify import slugify
import bcrypt

# import db from init
from martinblog import db


# entry model on sqlalchemy
# insert tags later
class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    slug = db.Column(db.String(150))
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
        self.slug = slugify(title)
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
            'slug': self.slug,
            'content': self.content,
            'imagelink': self.imagelink,
            'timestamp': dump_datetime(self.timestamp, self.dayofweek),
            'tags': self.tags
        }


# hash password later
class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True)
    password = db.Column(db.Text)

    def __init__(self, username, password):
        "username information"
        self.username = username

        # postgre driver automatically encodes to utf8, so we need to the
        # decode the hash first
        self.password = bcrypt.hashpw(
            password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def __repr__(self):
        return '<DB User Object, username: {}>'.format(self.username)

    def verify_password(self, password):
        return bcrypt.checkpw(
            password.encode('utf-8'), self.password.encode('utf-8'))


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
