from flask import render_template, json, jsonify
from flask_sqlalchemy import SQLAlchemy
from martinblog import app, db
from martinblog.database import Entry


# main page has all blog entries
@app.route('/')
def index():
    # query for all db entries
    dbEntries = Entry.query.all()
    # then serialize
    dbEntriesSerialized = [i.serialize for i in dbEntries]

    # validates json, then loads into object
    jsonQuery = json.loads(json.dumps(dbEntriesSerialized))

    return render_template("index.html", blogEntries=jsonQuery)


@app.route('/login')
def login():
    return render_template("login.html")


# returns post content based on number
@app.route('/post/<number>')
def number(number):
    dbEntry = Entry.query.get(number).serialize

    return jsonify(dbEntry)


# returns post content based on number
@app.route('/post/<number>/viewpost')
def viewPost(number):
    dbEntry = Entry.query.get(number).serialize

    return jsonify(dbEntry)


# dashboard for logged in user
# must be logged
@app.route('/<username>')
def dashboard(username):
    return render_template("dashboard.html")


# dashboard for logged in user
@app.route('/newpost')
def newpost():
    return render_template("newpost.html")


# dashboard for logged in user
@app.route('/inserttest')
def inserttest():

    insert = Entry(
        'javascript and node',
        'Nullam eu ante vel est convallis dignissim.  Fusce suscipit, wisi nec facilisis facilisis, est dui fermentum leo, quis <i>tempor ligula erat quis</i> odio.  Nunc porta vulputate tellus.  Nunc rutrum turpis sed pede.  Sed bibendum.  <mark>Aliquam posuere.  Nunc aliquet, augue nec adipiscing interdum</mark>, lacus tellus malesuada massa, quis varius mi purus non odio.  Pellentesque condimentum, magna ut suscipit hendrerit, ipsum augue ornare nulla, non luctus diam neque sit amet urna.  Curabitur vulputate vestibulum lorem.  Fusce sagittis, libero non molestie mollis, magna orci ultrices dolor, at vulputate neque nulla lacinia eros.  Sed id ligula quis est convallis tempor.  <b>Curabitur</b> lacinia pulvinar nibh.  Nam a sapien.'
    )
    db.session.add(insert)
    db.session.commit()
    return "success"
