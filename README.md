# simple-flask-blog

## CS50 Final Project

### Features:
1. PostgreSQL
2. SQLAlchemy ORM
3. Restful-like Requests
4. Extensive use of AJAX.
5. Dashboard for administrator use
6. Working contact form utilizing MailGun API.
7. Tons of pure javascript use!

Feel free to use as you wish.

### Instalation:

#### First Steps

I recommend you running the blog on a virtual env. I am using pipenv for this explanation.

After cloning the repository, execute the following command:

```
cd simple-flask-blog/
pipenv install
pipenv install -e .
```

The Pipfile for this project is included.


#### Contact Information

All the mailing information is now being handled by [MailGun API](https://documentation.mailgun.com/en/latest/api_reference.html#api-reference). Go over their
website to check how it works. It is completely free if you handle less than
10000 emails, so I guess it won't be a problem at the moment.

#### Database

Then go to database.py, and change the database+driver if needed, filling it
with your username and password.
At this moment I am using PostgreSQL.

```
db_conn = 'postgresql+psycopg2://[username]:[password]@localhost/[database]'
```

### Changelog (0.4.9):

Tons of stuff migrated to typescript, API heavily modified to have some standards, and huge reestructure of project folders along with a lot of code refactor marks this update as one of biggest!

But still a lot to do. When the portfolio section is completed, version 0.5.0  will be launched, along with UNINOVE Lembretes applet. Big stuff coming!

#### Added:
- Portfolio add item is fully functional!

#### Fixed:

##### Dashboard
- Posts now have "last updated on" database.

##### Database
- Major refactor on database table names and organization;

#### Changed:

##### API
- Now we have a real API! With the following routes: v1/post and v1/portfolio

#### TODO:
- Disable submit button etc on portfolio dash, and show success/error messages.
- Create jinja custom filter for semantic ui, to write numbers in full(for css classes)
- Full text search based on postgresql raw queries
- API Documentation
- Fix portfolio API permissions

### Changelog (0.4.8):

JS is going to be replaced with Typescript because of auto-completion and some other features I find very useful.

#### Added:
- Cosmetic addition of avatar giving tips on tag selection(still needs work);
- PortfolioItem on database;
- Added upper menu on dashboard, to choose between posts, portfolio and users settings;

#### Changed:
- Reorganized files of the whole project to their correct folders;
- Login page is now being handled and validated with wtforms;

#### Fixed:
- Fixed bug where chosen tags where in ascending order, instead of desc;
- Major refactor of dashboard menus;
- Reworked BlogPosts page to correctly display multiple posts made on the same day;

#### Todo:
- Finish implementing portfolio forms and API;
- Migrate js files to typescript;


### Changelog (0.4.7):

I am very happy to announce (to just me apparently) that we now have an official
version! That's great, now back to the changelog.

#### Added:
- Button to keep scrolling through posts infinitely at index page.
- Portfólio page (still in development);
- Added automatic age calculation on About Me page;

#### Changed:
- Now only 3 posts shows up at the index page per time;
- Tags are being treated as slugs, because whitespace at the address bar is a no-no;
- Projects were previously on the About Me page, they are now being transferred to the Portfólio section;
- Changed flask-mail in favor of MailGun API because of ease of setup, and
  sending emails through your own server it's not much recommended because of
  spam and blacklisting;

#### Removed:
- Facebook icon on About Me page;

#### Fixed:
- Fixed image going over its container at the procedural post pages;
- Fixed issue with disqus commentaries not properly loading on the correct pages;

#### TODO
- Multiple users with different permission system;
- Portfólio management interface at the dashboard;
- Fix issue with posts not being ordered correctly at BlogLog page;
