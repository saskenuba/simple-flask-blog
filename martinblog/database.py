# -*- coding: utf-8 -*-


def init_db(db):
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    from martinblog.database_models import Entry, Users, Tags, PortfolioItems, post_has_tags
    db.reflect()


# entry model on sqlalchemy
