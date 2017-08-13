# simple-flask-blog

## CS50 Final Project

### Instalation:

#### First Steps

I recommend you running the blog on a virtual env.

After cloning the repository, execute

>> cd simple-flask-blog/
>> pip install -r requirements.txt
>> pip install -e .

And follow the next steps.

#### Contact Information

To setup email correctly, first go to __init__.py and change the following information:

app.config['MAIL_SERVER'] = ''
app.config['MAIL_PORT'] = 'port number'
app.config['MAIL_USE_SSL'] = ''
app.config['MAIL_USERNAME'] = ''
app.config['MAIL_PASSWORD'] = ''

#### Database

Then go to database.db, and change the database+driver if needed, and set up.
At this moment I am using PostgreSQL.

db_conn = 'postgresql+psycopg2://[username]:[password]@localhost/[database]'

### Features:
1. PostgreSQL
2. SQLAlchemy ORM
3. Restful-like Requests
4. Extensive use of AJAX.
5. Dashboard for administrator use
6. Working contact form utilizing Flask-mail

Feel free to use as you wish.
