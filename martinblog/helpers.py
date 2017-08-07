from collections import defaultdict


def tablelizePosts(json):
    years = defaultdict(dict)
    months = defaultdict(dict)

    for post in json:
        currentPostYear = post['timestamp'][2]
        currentPostMonth = post['timestamp'][1]
        currentPostDay = post['timestamp'][0]

        years[currentPostYear][currentPostMonth] = months[currentPostMonth]
        months[currentPostMonth][currentPostDay] = [post['id'], post['title']]

    return years
