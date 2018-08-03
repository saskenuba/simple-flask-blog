from datetime import datetime

import bcrypt
from flask import json
from flask_login import UserMixin
from slugify import slugify

from martinblog import db

# many to many relationship
post_has_tags = db.Table(
    'post_has_tags',
    db.Column('post_id', db.Integer,
              db.ForeignKey('Entries.PostID', ondelete='CASCADE')),
    db.Column('tags_id', db.Integer, db.ForeignKey('Tags.TagID')))


class Entry(db.Model):
    __tablename__ = "Entries"

    id = db.Column("PostID", db.Integer, primary_key=True)
    title = db.Column("Title", db.String(100))
    slug = db.Column("Slug", db.String(150))
    imagelink = db.Column("Imagelink", db.String(100))
    content = db.Column("Content", db.Text)
    timestamp = db.Column("Timestamp", db.DateTime)
    dayofweek = db.Column("DayOfWeek", db.String(20))
    tags = db.relationship(
        'Tags',
        secondary=post_has_tags,
        collection_class=list,
        backref=db.backref('entries', lazy='joined'),
        passive_deletes=True)

    def __init__(self,
                 title,
                 content,
                 imagelink=None,
                 dayofweek=None,
                 timestamp=None):
        self.title = title
        self.slug = slugify(title)
        self.content = content

        if imagelink is None:
            self.imagelink = 'Sem imagens'
        self.imagelink = imagelink

        if timestamp is None:
            timestamp = datetime.utcnow()
        self.timestamp = timestamp

        if dayofweek is None:
            dayofweek = datetime.today().weekday()
        self.dayofweek = dayofweek

    def __repr__(self):
        return '<Blog Post Object id: {}, title: {}>'.format(
            self.id, self.title)

    @staticmethod
    def getFilteredEntries(offset=0, limit=None):
        """Return entries on descending order

        :param offset: offset for returning entries
        :param limit: size of list of entries
        :returns: entry list
        :rtype:

        """
        if limit is None:
            return Entry.query.order_by(
                Entry.timestamp.desc()).offset(offset).all()

        return Entry.query.order_by(
            Entry.timestamp.desc()).offset(offset).limit(limit).all()

    @staticmethod
    def toJson(entryCollection):
        """Returns the entry collection into json format.
        It is expected that the collection has a serialize function.

        :param entryCollection: A query result with multiple entries.
        :returns: The query result in json format.
        :rtype: json

        """
        serializedCollection = [item.serialize for item in entryCollection]

        return json.loads(json.dumps(serializedCollection))

    @property
    def serialize(self):
        """Returns data in a serialized format.

        :returns: A entry in a dictionary format.
        :rtype: dictionary

        """
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'content': self.content,
            'imagelink': self.imagelink,
            'timestamp': dump_datetime(self.timestamp, self.dayofweek),
            'tags': dump_tags(self.tags)
        }


class Users(db.Model, UserMixin):
    __tablename__ = "Users"

    id = db.Column("UserID", db.Integer, primary_key=True)
    username = db.Column("Username", db.String(20), unique=True)
    password = db.Column("Password", db.Text)

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


class PortfolioItems(db.Model):
    __tablename__ = "PortfolioItems"

    id = db.Column("ItemID", db.Integer, primary_key=True)
    title = db.Column("Title", db.String(100))
    slug = db.Column("Slug", db.String(100))
    imagelink = db.Column("Imagelink", db.String(100))
    content = db.Column("Content", db.JSON)
    timestamp = db.Column("Timestamp", db.DateTime)

    def __init__(self, title, imagelink, content, timestamp=None):
        self.title = title
        self.slug = slugify(title)
        self.imagelink = imagelink
        self.content = content

        if timestamp is None:
            timestamp = datetime.utcnow()
        self.timestamp = timestamp

    def __repr__(self):
        return '<Portfolio Item Object id: {}, title: {}>'.format(
            self.id, self.title)


class Tags(db.Model):
    __tablename__ = "Tags"

    id = db.Column("TagID", db.Integer, primary_key=True)
    tag = db.Column("Tag", db.String(50), unique=True)

    def __init__(self, tag):
        "Tag information"
        self.tag = tag

    def __repr__(self):
        return self.tag

    @staticmethod
    def commitAll(tags, post):
        "Create tags for current post, and also checks for duplicates"

        # since children is just a list
        # magic remove all tags on post_has_tags
        del post.tags[:]

        tagsArray = [slugify(x.strip()) for x in tags.split(',')]

        for name in tagsArray:
            tag = Tags.query.filter(Tags.tag == name).first()

            # if tags doesnt exists
            if tag is None:
                currentTag = Tags(name)
                db.session.add(currentTag)
                currentTag.entries.append(post)
            else:
                tag.entries.append(post)
            db.session.commit()


def dump_datetime(value, currentday):
    """Deserialize datetime object into string form for JSON processing."""
    if value is None:
        return None
    return [
        value.strftime("%d"),
        dump_month(value.strftime("%m")),
        value.strftime("%Y"),
        dump_weekday(currentday),
        value.strftime("%m")
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


def dump_tags(tags):
    return [str(x) for x in tags]
