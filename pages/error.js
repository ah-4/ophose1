oimpcO("link/Link");

class SimpleErrorDisplay extends OphoseComponent {

    constructor() {
        super("error_simpleErrorDisplay");
    }

    style() {
        return /* css */`
        %self {
            height: fit-content;
            background-color: var(--ophose-fav-color);
            border-radius: 1em;
        }
        `;
    }

    render() {
        return /* html */`
        <div>
            <h2>Oops, this page does not exist... <i>We're sending agents here !</i></h2>
            <p>While awaiting them, you can visit ${new Link().place('the main page', {url: '/'})}.</p>
        </div>
        `
    }

}

class Error extends OphosePage {

    constructor() {
        super();
    }

    onLoad() {
        OphoseApp.setTitle('404 - This page may not exist');
    }

    style() {
        return /* css */`
        .page_error {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        `
    }

    render() {
        return /* html */`
            <div class="page_error">
                ${new SimpleErrorDisplay().place()}
            </div>
        `
    }

}

oshare(Error);