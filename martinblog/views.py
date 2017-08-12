from flask import render_template, json, jsonify, request, make_response, current_app, redirect, url_for, flash
from martinblog import app, db, login_manager, mail
from martinblog.database import Entry, Users, Tags
from martinblog.helpers import tablelizePosts
from martinblog.forms import ContactForm
from wtforms_json import from_json
from flask_login import login_required, current_user, login_user, logout_user
from flask_mail import Message
from slugify import slugify
import re

# Caso for usar o sistema de email, recolocar dados usuario e senha
# TODO:
# TODO: criar pagina 404
# TODO: infinite scrolling or page navigation


# main page has all blog entries
@app.route('/')
def index():

    # query for all db entries
    dbEntries = Entry.query.order_by(Entry.timestamp.desc()).all()

    dbEntriesSerialized = [i.serialize for i in dbEntries]

    # validates json, then loads into object
    jsonQuery = json.loads(json.dumps(dbEntriesSerialized))

    return render_template("index.html", blogEntries=jsonQuery)


@app.route('/about')
def about():
    return render_template("about.html")


@app.route('/tags/<string>')
def tags(string):

    # query for posts that matches tag
    dbEntries = Tags.query.filter(Tags.tag == string).first()

    # then serialize posts
    dbEntriesSerialized = [i.serialize for i in dbEntries.entries]

    # validates json, then loads into object
    jsonQuery = json.loads(json.dumps(dbEntriesSerialized))

    return render_template("index.html", blogEntries=jsonQuery)


@app.route('/contact', methods=['GET', 'POST'])
def contact():

    if request.method == 'POST':
        jsonEmail = request.get_json()
        form = ContactForm.from_json(jsonEmail)

        if form.validate():

            msg = Message(
                'Mensagem do Blog',
                sender=jsonEmail['formEmail'],
                recipients=['martin@hotmail.com.br'])

            msg.html = '<p>Você acaba de receber uma mensagem de {}.</p><p>Email: {}</p><p>Telefone: {}</p><p>Mensagem: {}</p>'.format(
                jsonEmail['formNome'], jsonEmail['formEmail'],
                jsonEmail['formTelefone'], jsonEmail['formMensagem'])

            try:
                mail.send(msg)
            except:
                return 'error', 408

            return 'success', 200

        else:
            return 'bad form syntax', 400

    elif request.method == 'GET':
        form = ContactForm()
        return render_template("contact.html", form=form)


@app.route('/posts')
def blogPosts():

    # query for all db entries
    dbEntries = Entry.query.order_by(Entry.timestamp.desc()).all()

    # then serialize
    dbEntriesSerialized = [i.serialize for i in dbEntries]

    # validates json, then loads into object
    jsonQuery = json.loads(json.dumps(dbEntriesSerialized))

    return render_template(
        "blogposts.html", postsTable=tablelizePosts(jsonQuery))


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


# this page redirects to url with slug
@app.route('/post/<int:number>')
@app.route('/post/<int:number>/<title>')
def viewPost(number, title=None):

    # creating test client to fetch json
    client = current_app.test_client()
    postRequested = client.get(
        '{}post/json/{}'.format(request.url_root, number))

    if postRequested.status == '404 NOT FOUND':
        return 'post not found'

    postRequestedJson = json.loads(postRequested.data)

    # take care of this when deploying
    # urlRoot = str(request.url_root)

    return render_template('viewpost.html', blogEntry=postRequestedJson)


# page just to see post
@app.route('/post/add', methods=['POST'])
@login_required
def addPost():
    if request.method == 'POST':
        addRequest = request.get_json()

        # check if valid request
        if addRequest is None:
            return jsonify({
                "response": "something went wrong with your request"
            }), 404

        postEntry = Entry(
            title=addRequest['title'],
            content=addRequest['content'],
            imagelink=addRequest['imagelink'])

        db.session.add(postEntry)
        db.session.commit()

        # add all tags to session
        postTags = addRequest['tags']
        Tags.commitAll(postTags, postEntry)

        return jsonify({
            "response":
            "post added",
            "link":
            '{}post/{}'.format(request.url_root, postEntry.id)
        }), 201

    return 'you have nothing to see here, human!'


# page to edit post
@app.route('/post/edit', methods=['PUT'])
@login_required
def editPost():
    if request.method == 'PUT':
        editRequest = request.get_json()

        # validate json
        if editRequest is None:
            return jsonify({
                "response": "something went wrong with your request"
            }), 404

        # request post and update post
        Entry.query.filter(Entry.id == editRequest['id']).update(
            dict(
                title=editRequest['title'],
                slug=slugify(editRequest['title']),
                content=editRequest['content'],
                imagelink=editRequest['imagelink']))

        postToBeEdited = Entry.query.filter(
            Entry.id == editRequest['id']).first()

        # add all tags to session
        postTags = editRequest['tags']
        Tags.commitAll(postTags, postToBeEdited)

        # returns error if id not found
        if not postToBeEdited:
            return jsonify("post not found"), 404

        db.session.commit()

        # returns link and http code 202
        return jsonify({
            "response":
            "post edited",
            "link":
            '{}post/{}'.format(request.url_root, editRequest['id'])
        }), 202

    return 'you have nothing to see here, human!'


# page to delete a post
@app.route('/post/delete', methods=['DELETE'])
@login_required
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

    response = make_response(
        render_template("dashboard.html", username=current_user.username))
    return response


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
        if userQuery and userQuery.verify_password(formPassword):
            login_user(userQuery)
            return redirect(url_for('dashboard'))

        else:
            message = ('Seu usuário ou senha estão incorretos.')
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
