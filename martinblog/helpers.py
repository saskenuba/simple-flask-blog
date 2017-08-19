from collections import defaultdict
import requests
import re


def tablelizePosts(json):
    years = defaultdict(dict)
    months = defaultdict(dict)

    for post in json:
        currentPostYear = post['timestamp'][2]
        currentPostMonth = post['timestamp'][1]
        currentPostDay = post['timestamp'][0]

        years[currentPostYear][currentPostMonth] = months[currentPostMonth]
        months[currentPostMonth][currentPostDay] = [
            post['id'], post['title'], post['tags']
        ]

    return years


class NoMessage(Exception):
    "Can't send a NoneType message"
    pass


class Mailgun():
    "This class is responsible for creating a mailgun post request, and it"
    "assumes that you have created a subdomain to handle mailgun requests"

    def __init__(self, apikey, subdomain):
        "docstring"
        self.apikey = apikey
        self.subdomain = subdomain
        self.html = None

        stripDomain = re.search('(?<=\.).*', self.subdomain)
        self.domain = stripDomain.group(0)

    def send(self):
        "returns response object after posting"

        if self.html is None:
            raise NoMessage("Can't send a NoneType message")

        mailStatus = requests.post(
            "https://api.mailgun.net/v3/{}/messages".format(self.subdomain),
            auth=("api", "{}".format(self.apikey)),
            data={
                "from": "Formulario do Site <mailgun@{}>".format(self.domain),
                "to": ["contato@martinmariano.com"],
                "subject": "Nova mensagem para voce",
                "html": self.html
            })

        return mailStatus
