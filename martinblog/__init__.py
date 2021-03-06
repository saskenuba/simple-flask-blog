from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jsglue import JSGlue
from flask_login import LoginManager
from flask_migrate import Migrate
import os

app = Flask(__name__)
jsglue = JSGlue(app)

# init login manager
login_manager = LoginManager()
login_manager.init_app(app)


# path to db
db_conn = 'postgresql+psycopg2://martin@localhost/martinblog'

# sets db configuration
app.config['SQLALCHEMY_DATABASE_URI'] = db_conn
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.urandom(24)

# init db
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# then we import the routes
import martinblog.views
# this needs to be imported after database module gets connection
from martinblog.database import init_db

# initiate db
init_db(db)
