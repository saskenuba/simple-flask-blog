import os
from database import init_db
from helpers import *
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

# flask settings
app = Flask(__name__)

# initiate db
init_db()


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/login')
def login():
    return render_template("login.html")
