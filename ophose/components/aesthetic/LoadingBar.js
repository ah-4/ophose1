class LoadingBar extends OphoseComponent {

    constructor() {
        super();

        this.setLocalLive("color", "red");
        this.useLocalLiveFlag("color", Live.Flags.UPDATE_STYLE_ON_CHANGE);

        this.setLocalLive("value", 0);
        this.useLocalLiveFlag("value", Live.Flags.UPDATE_STYLE_ON_CHANGE);

        OphoseEvent.registerEvent("onPageLoad", () => {
            this.setLocalLive("value", 33);
        });

        OphoseEvent.registerEvent("onPageLoaded", () => {
            setTimeout(() => {
                this.setLocalLive("value", 100);
            }, 66);
            setTimeout(() => {
                this.setLocalLive("value", 0);
            }, 300);
        });
    }

    style() {
        let color = this.getLocalLive("color");
        let value = this.getLocalLive("value");
        let display = value <= 0 ? "none" : "block";
        return /* css */`
        %self {
            width: 100%;
            height: 3px;
            display: ${display};
            position: absolute;
            bottom: 0;
            left: 0;
        }

        %self .progress_bar {
            background-color: ${color};
            width: ${value}%;
            height: 100%;
        }
        `
    }

    setColor(color) {
        this.setLocalLive("color", color);
    }

    setValue(value) {
        this.setLocalLive("value", value);
    }

    resetValue() {
        this.setLocalLive("value", 0);
    }

    render() {
        return /* html */`
            <div>
                <div class="progress_bar">
                </div>
            </div>
        `

    }

}