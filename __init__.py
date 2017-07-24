from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

# flask settings
app = Flask(__name__)

# importing all modules to initializer
import martinblog.views

# connection to local database
db_conn = 'postgresql+psycopg2://martin@localhost/martinblog'

# creates db
app.config['SQLALCHEMY_DATABASE_URI'] = db_conn
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# this needs to be imported after database module gets connection
from martinblog.database import init_db

# initiate db
init_db()
