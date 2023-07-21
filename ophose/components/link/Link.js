oimpmO("link/MdLink");
class Link extends OphoseComponent {

    constructor() {
        super();
        this.addModule(new MdLink());
    }

    style() {
        return /* css */`
        %self {
            cursor: pointer;
        }
        `
    }

    render(children, props) {
        return /* html */`
        <a href="${props.url}">${children}</a>
        `
    }

}