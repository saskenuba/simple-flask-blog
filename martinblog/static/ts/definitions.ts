// DRY!
class Form {
    settings: object = {
        method: undefined,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: undefined
    };

    get httpMethod() {
        return this.settings['method'];
    }

    set httpMethod(method: string) {
        this.settings['method'] = method;
    }
}

class PortfolioItem extends Form {
    id: string = undefined;
    title: string = null;
    description: string = null;
    imagelink: string = null;
    pages: object = {};

    currentPage: number = 1;
    parentElement: HTMLElement = undefined;
    messageElement: HTMLElement = undefined;

    editor: CKEDITOR.editor = undefined;

    constructor(parentElement: HTMLElement, editor?: CKEDITOR.editor) {
        super()
        this.parentElement = parentElement;
        this.editor = editor;
    }

    // should bind to event listener, and respond to clicks on appropriate pages
    public pageHandler = (event: MouseEvent) => {
        let pageNumber: DOMStringMap = event.target['dataset']['button']
        let currentPageButton = <HTMLElement>event.target;

        this.saveContent(this.editor.getData());
        this.page = pageNumber;
        this.editor.setData(this.pageContent);

    }

    public submitHandler = (event: MouseEvent) => {
        event.preventDefault()
        let submitButton = <HTMLElement> event.target

        if (this.httpMethod != "DELETE") {
            this.saveAllAttributes();
            this.toJson()
        }

        this.send()
            .then(response => {
                if (response.status == 201 || response.status == 204) {
                    toggleClasses(submitButton, 'disabled')
                    console.log(this.messageElement);
                    toggleClasses(this.messageElement, 'on', 'off', 'animated', 'fadeIn');
                }
            })

    }

    // parent element should follow an specific order every time
    private saveAllAttributes() {
        this.title = this.parentElement.querySelector('input[name="title"]')['value'];
        this.description = this.parentElement.querySelector('input[name="description"]')['value'];
        this.imagelink = this.parentElement.querySelector('input[name="imageUrl"]')['value'];

        // save current page without the need to click another one again
        this.saveContent(this.editor.getData());
    }

    // parent element should follow an specific order every time
    private saveToParent() {
        this.parentElement.querySelector('input[name="title"]')['value'] = this.title;
        this.parentElement.querySelector('input[name="description"]')['value'] = this.description;
        this.parentElement.querySelector('input[name="imageUrl"]')['value'] = this.imagelink;
        this.editor.setData(this.pages[this.currentPage]);
    }

    private toJson = () => {
        this.settings["body"] = JSON.stringify({
            "title": this.title,
            "description": this.description,
            "imagelink": this.imagelink,
            "pages": this.pages
        })
    }

    public retrieve = (itemID: number): void => {
        let currentItem = itemID;

        getPortfolioItem(currentItem)
            .then(response => {
                this.id = response['id'];
                this.title = response['title'];
                this.description = response['description'];
                this.imagelink = response['imagelink'];
                this.pages = response['content'];

                console.log(this.pages);
                this.saveToParent();
            })
    }

    public send(): Promise<Response> {

        if (this.httpMethod == "PUT" || this.httpMethod == "DELETE") {
            return sendJsonWithObj('API_portfolio', { "itemID": this.id }, this.settings);
        }
        return sendJson('API_portfolio', this.settings);
    }

    get pageContent() {
        return this.pages[this.currentPage];
    }

    set page(pageNumber) {
        this.currentPage = pageNumber;
    }

    private saveContent(content: string) {

        if (content.length > 0) {
            this.pages[`${this.currentPage}`] = content;
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
