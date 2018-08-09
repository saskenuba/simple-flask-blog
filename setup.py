from setuptools import setup

setup(
    name='martinblog',
    packages=['martinblog'],
    version='0.4.9',
    author='Martin Mariano',
    author_email='contato@martinmariano.com',
    include_package_data=True,
    install_requires=[
        'flask', 'jinja2', 'flask-sqlalchemy', 'flask-jsglue', 'flask-login',
        'wtforms', 'wtforms-json', 'requests', 'python-slugify', 'bcrypt',
        'flask-migrate', 'flask-restplus'
    ],
    extra_require={
        'pg': ['psycopg2'],
        'deploy': ['gunicorn']
    })
