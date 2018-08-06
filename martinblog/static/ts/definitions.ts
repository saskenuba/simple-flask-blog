// DRY!
class Form {
    settings: object = {
        method: null,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: null
    };

    set httpMethod(method: string) {
        this.settings['method'] = method;
    }
}

class PortfolioItem extends Form {
    title: string = null;
    description: string = null;
    imagelink: string = null;
    pages: object = {};

    currentPage: number = 1;
    parentElement: HTMLElement = null;

    constructor(parentElement: HTMLElement) {
        super()
        this.parentElement = parentElement;
    }

    // should bind to event listener, and respond to clicks on appropriate pages
    pageHandler = (event: MouseEvent) => {
        let pageNumber: DOMStringMap = event.target['dataset']['button']
        let currentPageButton = <HTMLElement>event.target;

        this.saveContent(editor_portfolio_add.getData());
        this.page = pageNumber;
        editor_portfolio_add.setData(this.pageContent);

    }

    public submitHandler = (event: MouseEvent) => {
        event.preventDefault()

        this.saveAllAttributes();
        this.toJson()
        this.send();

    }

    // parent element should follow an specific order every time
    private saveAllAttributes() {
        this.title = this.parentElement[0].value
        this.description = this.parentElement[1].value
        this.imagelink = this.parentElement[2].value

        // save current page without the need to click another one again
        this.saveContent(editor_portfolio_add.getData());
    }

    private toJson = () => {
        this.settings["body"] = JSON.stringify({
            "title": this.title,
            "description": this.description,
            "imagelink": this.imagelink,
            "pages": this.pages
        })
    }

    public send() {
        return sendJson('API_portfolio', this.settings);

    }

    get pageContent() {
        return this.pages[this.currentPage]
    }

    set page(pageNumber) {
        this.currentPage = pageNumber;
    }

    private saveContent(content: string) {

        if (content.length > 0) {
            this.pages[`${this.currentPage}`] = content
        }
    }
}



class Post extends Form {
    title: string;
    imagelink: string;
    content: string;
    tags: string;

    constructor(title: string, imagelink: string, content: string, tags: string) {
        super()
        this.title = title
        this.imagelink = imagelink;
        this.content = content;
        this.tags = tags;
    }

    get json() {
        return JSON.stringify({
            title: this.title,
            imagelink: this.imagelink,
            content: this.content,
            tags: this.tags
        });
    }

    send(flaskLocation: string) {
        return sendJson(flaskLocation, this.settings);
    }
}
