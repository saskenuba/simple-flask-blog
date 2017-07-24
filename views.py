from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from martinblog import app


@app.route('/')
def index():
    return render_template("index.html")


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
