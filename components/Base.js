oimpc("Header");

class Base extends OphoseBase {

    constructor() {
        super();
    }

    style() {
        return /* css */`
        * {
            margin: 0;
            padding: 0;
            color: inherit;
            font-family: sans-serif;
        }

        body {
            background-color: #0A0A0A;
            color: white;
        }
        `
    }

    render(children, props) {
        return /* html */`
            <div>
                ${new Header().place()}
                <app>
                    ${children}
                </app>
            </div>
        `
    }

}