from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_jsglue import JSGlue

# first initialize flask
app = Flask(__name__)
jsglue = JSGlue(app)

# path to db
db_conn = 'postgresql+psycopg2://martin@localhost/martinblog'

# sets db configuration
app.config['SQLALCHEMY_DATABASE_URI'] = db_conn
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# then we import the routes
import martinblog.views
# this needs to be imported after database module gets connection
from martinblog.database import init_db

# initiate db
init_db()
