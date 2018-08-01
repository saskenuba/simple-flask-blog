# -*- coding: utf-8 -*-

import datetime
import re

from flask import (current_app, flash, json, jsonify, make_response, redirect,
                   render_template, request, url_for)
from flask_login import current_user, login_required, login_user, logout_user
from slugify import slugify
from wtforms_json import from_json

from martinblog import app, db, login_manager
from martinblog.database import Entry, Tags, Users
from martinblog.forms import ContactForm, LoginForm, PortfolioForm
from martinblog.helpers import Mailgun, tablelizePosts

# Usuario novo caso precise
# novoUsuario = Users('testeuser', '12345')
# db.session.add(novoUsuario)
# db.session.commit()


# main page has all blog entries
@app.route('/')
def index():

    # query for all db entries
    dbEntries = Entry.getFilteredEntries(0, limit=3)

    # loads entries into json
    jsonQuery = Entry.toJson(dbEntries)

    return render_template("index.html", blogEntries=jsonQuery)


@app.route('/about')
def about():
    nascimento = datetime.date(year=1994, month=1, day=11)
    hoje = datetime.date.today()
    minhaIdade = (hoje.year - nascimento.year)
    return render_template("about.html", minhaIdade=minhaIdade)


@app.route('/portfolio')
def portfolio():
    return render_template('portfolio.html')


@app.route('/portfolio/<itemID>')
def portfolio_item(itemID):
    return render_template('portfolio_item.html')


@app.route('/tags/<string>')
def tags(string):

    chosenTag = string

    # query for post that matches tag chosen by user
    dbEntries = Tags.query.filter(Tags.tag == chosenTag).first()

    # sort by descending order
    sortedDbEntries = sorted(
        dbEntries.entries, key=lambda x: x.id, reverse=True)

    # in case tag doesnt exists
    if len(dbEntries.entries) is 0:
        return render_template('404.html'), 404

    # then serialize posts
    dbEntriesSerialized = [i.serialize for i in sortedDbEntries]

    # validates json, then loads into object
    jsonQuery = json.loads(json.dumps(dbEntriesSerialized))

    return render_template("tags.html", TAG=chosenTag, blogEntries=jsonQuery)


@app.route('/contact', methods=['GET', 'POST'])
def contact():

    if request.method == 'POST':
        jsonEmail = request.get_json()
        form = ContactForm.from_json(jsonEmail)

        # on form validation
        if form.validate():

            message = u'<p>Você acaba de receber uma mensagem de {}.</p><p>Email: {}</p><p>Telefone: {}</p><p>Mensagem: {}</p>'.format(
                jsonEmail['formNome'], jsonEmail['formEmail'],
                jsonEmail['formTelefone'], jsonEmail['formMensagem'])

            mail = Mailgun('your-apikey', 'mg.martinmariano.com')
            mail.html = message
            response = mail.send()

            if response.status_code == 200:
                return 'success', 200
            else:
                return 'error', 408

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


def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)


@app.route("/sitemap.xml")
def site_map():
    links = []
    urlRoot = request.url_root
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            links.append((url, rule.endpoint))

    dbEntries = Entry.query.all()
    for entry in dbEntries:
        linkTuple = ('/post/{}'.format(entry.id), str(entry.id))
        links.append(linkTuple)

    sitemap_xml = render_template(
        'sitemap.xml', links=links, urlRoot=urlRoot[:-1])
    response = make_response(sitemap_xml)
    response.headers["Content-Type"] = "application/xml"

    return response


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


###############################################################################
#                               Posts API                                     #
###############################################################################


# returns json of post content
@app.route('/post/json/<postid>')
@app.route('/post/json/<postid>/<offset>/<limit>')
def getJsonPost(postid, offset=None, limit=None):
    """This is the main API that returns posts inside the db.

    :param postid: This should be all to return everypost, or an specific Post ID.
    :param offset: Offset for loading posts.
    :param limit:  Limit of query.
    :returns: Json list with N posts.
    :rtype:

    """

    # convert request to str
    postID = str(postid)

    # checks for correct request
    pattern = re.compile('[0-9]+')
    match = pattern.match(postID)

    # if ask for all, send everypost
    if postid == 'all' and offset is None and limit is None:
        dbEntries = Entry.getFilteredEntries()
        serialized = [post.serialize for post in dbEntries]
        return jsonify(serialized)

    elif postid == 'all' and offset is not None and limit is not None:
        dbEntries = Entry.getFilteredEntries(int(offset), int(limit))
        serialized = [post.serialize for post in dbEntries]
        return jsonify(serialized)

    # else, just the one asked
    elif match:
        dbEntry = Entry.query.get(postid)

        # if post doesnt exists in db
        if dbEntry is None:
            return jsonify(
                dict(title='Post not found', content='Post not found')), 404

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
    postRequested = client.get('{}post/json/{}'.format(request.url_root,
                                                       number))

    if postRequested.status == '404 NOT FOUND':
        return render_template('404.html'), 404

    postRequestedJson = json.loads(postRequested.data)

    # take care of this when deploying
    # urlRoot = str(request.url_root)

    return render_template('viewpost.html', blogEntry=postRequestedJson)


# page to add post
@app.route('/post', methods=['POST'])
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
@app.route('/post/<int:postid>', methods=['PUT'])
@login_required
def editPost(postid):
    if request.method == 'PUT':
        editRequest = request.get_json()

        # validate json
        if editRequest is None:
            return jsonify({
                "response": "something went wrong with your request"
            }), 404

        postToBeEdited = Entry.query.filter(Entry.id == postid).first()

        # returns error if id not found
        if not postToBeEdited:
            return jsonify("post not found"), 404

        # request post and update post
        Entry.query.filter(Entry.id == postid).update(
            dict(
                title=editRequest['title'],
                slug=slugify(editRequest['title']),
                content=editRequest['content'],
                imagelink=editRequest['imagelink']))

        # add all tags to session
        postTags = editRequest['tags']
        Tags.commitAll(postTags, postToBeEdited)

        db.session.commit()

        # returns link and http code 202
        return jsonify({
            "response": "post edited",
            "link": '{}post/{}'.format(request.url_root, postid)
        }), 202

    return 'you have nothing to see here, human!'


# page to delete a post
@app.route('/post/<int:postid>', methods=['DELETE'])
@login_required
def deletePost(postid):
    if request.method == 'DELETE':

        # if contains no header or wrong one
        if postid is None:
            return jsonify({
                "response": "something went wrong with your request"
            }), 404

        # request post and update post
        postToBeDeleted = Entry.query.filter(Entry.id == postid).delete()

        # returns error if id not found
        if not postToBeDeleted:
            return jsonify("post not found"), 404

        db.session.commit()

        # returns link and http code 200
        return jsonify({
            "response": "post with id: {} deleted".format(postid)
        }), 200

    return 'you have nothing to see here, human!'


# dashboard for logged in user
# must be logged
@app.route('/dashboard')
@login_required
def dashboard():

    portfolioAddForm = PortfolioForm()

    response = make_response(
        render_template(
            "dashboard.html",
            username=current_user.username,
            portfolioAddForm=portfolioAddForm))
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

    # instantiate form
    form = LoginForm(request.form)

    # if user is not logged in yet
    if request.method == "POST" and form.validate():

        formUsername = form.username.data
        formPassword = form.password.data

        # get user
        userQuery = Users.query.filter_by(username=formUsername).first()

        # validate
        if userQuery and userQuery.verify_password(formPassword):
            login_user(userQuery)
            return redirect(url_for('dashboard'))

        else:
            message = (u'Seu usuário ou senha estão incorretos.')
            flash(message)
            return redirect(url_for('login'))

    elif request.method == "GET":
        return render_template("login.html", form=form)


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))


# if user try to access URI directly
@login_manager.unauthorized_handler
def unauthorized():
    flash(u'Você precisa realizar o login primeiro.')
    return redirect(url_for('login'))
