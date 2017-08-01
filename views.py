from flask import render_template, json, jsonify, request, make_response, current_app
from flask_sqlalchemy import SQLAlchemy
from martinblog import app, db
from martinblog.database import Entry
import re

# TODO: criar a pagina about me
# TODO: criar login
# TODO: arrumar o index


# main page has all blog entries
@app.route('/')
def index():
    # query for all db entries
    dbEntries = Entry.query.order_by(Entry.timestamp.desc()).all()
    # then serialize
    dbEntriesSerialized = [i.serialize for i in dbEntries]

    # validates json, then loads into object
    jsonQuery = json.loads(json.dumps(dbEntriesSerialized))

    return render_template("index.html", blogEntries=jsonQuery)


@app.route('/login')
def login():
    return render_template("login.html")


# custom 404 page
#@app.errorhandler(404)
#def not_found(error):
#    resp = make_response(render_template('error.html'), 404)
#    resp.headers['X-Something'] = 'A value'
#    return resp

###############################################################################
#                                     API                                     #
###############################################################################


# returns json of post content
@app.route('/post/json/<postid>')
def getJsonPost(postid):

    # convert request to str
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
            return jsonify(
                dict(title='post not found', content='post not found')), 404

        response = make_response(jsonify(dbEntry.serialize))
        return response

    # anything else, ignore
    else:
        return "not understanderino"


# page just to see post
@app.route('/post/view/<int:number>')
def viewPost(number):

    # creating test client to fetch json
    client = current_app.test_client()
    postRequested = client.get(
        '{}post/json/{}'.format(request.url_root, number))
    postRequestedJson = json.loads(postRequested.data)

    return render_template('viewpost.html', blogEntry=postRequestedJson)


# page just to see post
@app.route('/post/add', methods=['GET', 'POST'])
def addPost():
    if request.method == 'POST':
        addRequest = request.get_json()

        # if contains no header or wrong one
        if addRequest is None or addRequest['header'] != 'add':
            return jsonify({
                "response": "something went wrong with your request"
            }), 404

        postEntry = Entry(addRequest['title'], addRequest['content'],
                          addRequest['imagelink'], addRequest['tags'])

        # db actions
        db.session.add(postEntry)
        db.session.commit()

        return jsonify({
            "response":
            "post added",
            "link":
            '{}post/view/{}'.format(request.url_root, postEntry.id)
        }), 201

    return 'you have nothing to see here, human!'


# page to edit post
@app.route('/post/edit', methods=['GET', 'POST'])
def editPost():
    if request.method == 'POST':
        editRequest = request.get_json()

        print(editRequest)

        # if contains no header or wrong one
        if editRequest is None or editRequest['header'] != 'edit':
            return jsonify({
                "response": "something went wrong with your request"
            }), 404

        # request post and update post
        postToBeEdited = Entry.query.filter(
            Entry.id == editRequest['id']).update(
                dict(
                    title=editRequest['title'],
                    content=editRequest['content'],
                    imagelink=editRequest['imagelink'],
                    tags=editRequest['tags']))

        # returns error if id not found
        if not postToBeEdited:
            return jsonify("post not found"), 404

        db.session.commit()

        # returns link and http code 202
        return jsonify({
            "response":
            "post edited",
            "link":
            '{}post/view/{}'.format(request.url_root, editRequest['id'])
        }), 202

    return 'you have nothing to see here, human!'


# page to delete a post
@app.route('/post/delete', methods=['POST'])
def deletePost():
    if request.method == 'POST':
        delRequest = request.get_json()

        # if contains no header or wrong one
        if delRequest is None or delRequest['header'] != 'del':
            return jsonify({
                "response": "something went wrong with your request"
            }), 404

        # request post and update post
        postToBeDeleted = Entry.query.filter(
            Entry.id == delRequest['id']).delete()

        # returns error if id not found
        if not postToBeDeleted:
            return jsonify("post not found"), 404

        db.session.commit()

        # returns link and http code 200
        return jsonify({
            "response":
            "post with id: {} deleted".format(delRequest['id'])
        }), 200

    return 'you have nothing to see here, human!'


# dashboard for logged in user
# must be logged
@app.route('/dashboard/<username>')
def dashboard(username):
    return render_template("dashboard.html", username=username)
