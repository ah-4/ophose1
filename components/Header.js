class Header extends OphoseComponent {

    constructor() {
        super();
    }

    style() {
        return /*css*/`
        %self {
            width: 100%;
            background-color: #181818;
            padding: 0.5em;
            font-size: 0.75em;
            position: fixed;
            top: 0;
            left: 0;
        }

        %self p {
            text-align: center;
        }
        `
    }

    render() {
        return /* html */`
        <header>
            <p><b>Welcome to your Ophose web application !</b> You may like to start with <a href="https://www.ophose.org/tutorials">these tutorials</a>!</p>
        </header>
        `
    }

}