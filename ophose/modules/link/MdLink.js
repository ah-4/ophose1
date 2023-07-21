class MdLink extends OphoseModule {

    constructor() {
        super();
    }

    style() {
        return /* css */`
            %self {
                cursor: pointer;
                text-decoration: none;
            }
            `
    }

    onPlace(myComponent, element) {
        element.addEventListener("click", (event) => {
            event.preventDefault();
            let url = element.getAttribute("href");
            route.go(url);
        });
    }

}