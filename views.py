from flask import render_template, json, jsonify
from flask_sqlalchemy import SQLAlchemy
from martinblog import app, db
from martinblog.database import Entry


@app.route('/')
def index():
    dbEntries = Entry.query.all()
    dbEntriesSerialized = [i.serialize for i in dbEntries]

    # validates json, then loads into object
    jsonQuery = json.loads(json.dumps(dbEntriesSerialized))
    return render_template("index.html", blogEntries=jsonQuery)


@app.route('/login')
def login():
    return render_template("login.html")


# dashboard for logged in user
@app.route('/<username>')
def dashboard(username):
    return render_template("dashboard.html")


# dashboard for logged in user
@app.route('/newpost')
def newpost():
    return render_template("newpost.html")
