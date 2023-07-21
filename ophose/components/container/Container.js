class Container extends OphoseComponent {

    parent = null;

    constructor() {
        super();

        this.setLocalLive("open", false);
        this.useLocalLiveFlag("open", Live.Flags.UPDATE_STYLE_ON_CHANGE);
    }

    style() {
        let display = this.getLocalLive("open") ? "block" : "none";
        return /* css */`
        %self > .blocker {
            left: 0;
            top: 0;
            display: ${display};
            position: fixed;
            width: 100%;
            height: 100vh;
            z-index: 10;
            background-color: black;
        }

        %self > .container {
            display: ${display};
            z-index: 11;
        }

        %self > .container > * {
            position: absolute;
            z-index: 11;
        }
        `
    }

    toggle() {
        let isOpen = this.getLocalLive("open");
        this.setLocalLive("open", !isOpen);
    }

    close() {
        this.setLocalLive("open", false);
    }

    open() {
        this.setLocalLive("open", true);
    }

    render(children, props) {
        let backgroundOpacity = props && props.opacity ? props.opacity : 0;
        return /* html */`
            <div>
                <div onclick="{$this}.close()" class="blocker" style="opacity: ${backgroundOpacity};"></div>
                <div class="container">
                    ${children}
                </div>
            </div>
        `

    }

}