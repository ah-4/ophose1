class Image extends OphoseComponent {

    constructor() {
        super();
    }

    style() {
        return /* css */`
        `
    }

    render(children, props) {
        return /* html */`
        <img src="/public/${props.src}" draggable="false" alt="${props.alt ?? "Image"}" />
        `
    }

}