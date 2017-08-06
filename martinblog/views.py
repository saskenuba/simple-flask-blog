from flask import render_template, json, jsonify, request, make_response, current_app, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from martinblog import app, db, login_manager, mail
from martinblog.database import Entry, Users
from flask_login import login_required, current_user, login_user, logout_user
from flask_mail import Message
import re

# Caso for usar o sistema de email, recolocar dados usuario e senha
# TODO: encriptar senha login
# TODO: criar pagina 404
# TODO: verificar a possibilidade de centralizar os requests no route /post/


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


@app.route('/about')
def about():
    return render_template("about.html")


# TODO: validar header e nomes
@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        jsonEmail = request.get_json()

        msg = Message(
            'Mensagem do Blog',
            sender=jsonEmail['email'],
            recipients=['martin@hotmail.com.br'])

        msg.html = '<p>Você acaba de receber uma mensagem de {}.</p><p>Email: {}</p><p>Telefone: {}</p><p>Mensagem: {}</p>'.format(
            jsonEmail['name'], jsonEmail['email'], jsonEmail['phone'],
            jsonEmail['message'])

        try:
            mail.send(msg)
        except:
            return 'error', 408

        return 'success', 200

    elif request.method == 'GET':
        return render_template("contact.html")


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

    if postRequested.status == '404 NOT FOUND':
        return 'post not found'

    postRequestedJson = json.loads(postRequested.data)

    # take care of this when deploying
    urlRoot = str(request.url_root)

    return render_template(
        'viewpost.html', blogEntry=postRequestedJson, urlRoot=urlRoot)


# page just to see post
@app.route('/post/add', methods=['POST'])
def addPost():
    if request.method == 'POST':
        addRequest = request.get_json()

        # check if valid request
        if addRequest is None:
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
@app.route('/post/edit', methods=['PUT'])
def editPost():
    if request.method == 'PUT':
        editRequest = request.get_json()

        # validate json
        if editRequest is None:
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
@app.route('/post/delete', methods=['DELETE'])
def deletePost():
    if request.method == 'DELETE':
        delRequest = request.get_json()

        # if contains no header or wrong one
        if delRequest is None:
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
@app.route('/dashboard')
@login_required
def dashboard():
    return render_template("dashboard.html", username=current_user.username)


###############################################################################
#                                Login Manager                                #
###############################################################################


@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(user_id)


@app.route('/login', methods=['GET', 'POST'])
def login():

    # if user is authenticated, just redirect to dashboard
    if current_user.is_authenticated:
        return redirect(url_for('dashboard', username=current_user.username))

    # if user is not logged in yet
    if request.method == "POST":

        # gather form content
        formUsername = request.form['username']
        formPassword = request.form['password']

        # get user
        userQuery = Users.query.filter_by(username=formUsername).first()

        # validate
        if userQuery and userQuery.password == formPassword:
            login_user(userQuery)
            return redirect(url_for('dashboard'))

        else:
            message = ('Seu usuário ou senha estão incorretos.', 'error')
            flash(message)
            return redirect(url_for('login'))

    elif request.method == "GET":
        return render_template("login.html")


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))


# if user try to access URI directly
@login_manager.unauthorized_handler
def unauthorized():
    flash('Você precisa realizar o login primeiro.', 'error')
    return redirect(url_for('login'))
