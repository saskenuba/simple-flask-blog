from setuptools import setup

setup(
    name='martinblog',
    packages=['martinblog'],
    include_package_data=True,
    install_requires=[
        'flask', 'jinja2', 'flask-sqlalchemy', 'flask-jsglue', 'flask-login', 'wtforms',
        'wtforms-json', 'requests', 'python-slugify', 'bcrypt', 'flask-migrate', 'flask-restplus'
    ],
    extra_require={
        'pg': ['psycopg2'],
        'deploy': ['gunicorn']
    }
)
