from flask import render_template, json, jsonify
from flask_sqlalchemy import SQLAlchemy
from martinblog import app, db
from martinblog.database import Entry
import re

# TODO: fazer os posts do index serem organizados por ajax atraves de uma query ao /post/postid
# TODO: criar a pagina about me
# TODO: criar login


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


###############################################################################
#                                     API                                     #
###############################################################################


# returns json of post content
@app.route('/post/json/<postid>')
def getJsonPost(postid):

    # converts request to str
    parameter = str(postid)

    # checks for correct request
    pattern = re.compile('[0-9]+')
    match = pattern.match(parameter)

    # if ask for all, send everypost
    if postid == 'all':
        dbEntries = Entry.query.all()
        dbEntriesSerialized = [i.serialize for i in dbEntries]
        return jsonify(dbEntriesSerialized)
    # else, just the one asked
    elif match:
        dbEntry = Entry.query.get(postid)

        # if post doesnt exists in db
        if dbEntry is None:
            return 'null'

        return jsonify(dbEntry.serialize)
    # anything else, ignore
    else:
        return "not understanderino"


# page just to see post
@app.route('/post/view/<number>')
def viewPost(number):
    # TODO
    return "datebayo"


# page just to see post
@app.route('/post/add')
def addPost(number):
    # TODO
    return "datebayo"


# page to edit post
@app.route('/post/edit')
def editPost():
    return "datebayo"


# page to edit post
@app.route('/post/delete')
def deletePost():
    return "datebayo"


# dashboard for logged in user
# must be logged
@app.route('/dashboard/<username>')
def dashboard(username):
    return render_template("dashboard.html", username=username)


# dashboard for logged in user
@app.route('/newpost')
def newpost():
    return render_template("newpost.html")


# dashboard for logged in user
@app.route('/inserttest')
def inserttest():

    insert = Entry(
        'javascript and node',
        '<p>Nullam eu ante vel est convallis dignissim.  Fusce suscipit, wisi nec facilisis facilisis, est dui fermentum leo, quis <i>tempor ligula erat quis</i> odio.</p><p>Nunc porta vulputate tellus.  Nunc rutrum turpis sed pede.  Sed bibendum.  <mark>Aliquam posuere.  Nunc aliquet, augue nec adipiscing interdum</mark>, lacus tellus malesuada massa, quis varius mi purus non odio.  <code>Pellentesque condimentum, magna ut suscipit hendrerit, ipsum augue ornare nulla, non luctus diam neque sit amet urna.  Curabitur vulputate vestibulum lorem.</code></br>Fusce sagittis, libero non molestie mollis, magna orci ultrices dolor, at vulputate neque nulla lacinia eros.  Sed id ligula quis est convallis tempor.  <b>Curabitur</b> lacinia pulvinar nibh.  Nam a sapien.</p>'
    )
    db.session.add(insert)
    db.session.commit()
    return "success"
