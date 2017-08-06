from collections import defaultdict


def tablelizePosts(json):
    years = defaultdict(list)

    for post in json:
        currentPostYear = post['timestamp'][2]
        currentPostMonth = post['timestamp'][1]

        # if not in years
        if currentPostYear not in years:
            years[currentPostYear] = {post['timestamp'][1]}

            if currentPostMonth not in years[currentPostYear]:
                years[currentPostYear][currentPostMonth] = post['id']
    return years
