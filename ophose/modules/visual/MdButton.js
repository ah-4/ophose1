class MdButton extends OphoseModule {

    constructor() {
        super();
    }

    style() {
        return /* css */`
            /* Normal */
            %self .btn {
                padding: 0.5em 1em;
                border-radius: 1em;
                user-select: none;
                background-color: var(--component-bg-color-plus);
                cursor: pointer;
                transition-duration: 300ms;
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 0.5em;
                box-sizing: border-box;
            }

            %self .btn:hover{
                background-color: var(--component-bg-color-mult);
            }

            /* Discret */

            %self .btn-discret{
                padding: 0.5em 1em;
                border-radius: 1em;
                user-select: none;
                cursor: pointer;
                transition-duration: 300ms;
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 0.5em;
                box-sizing: border-box;
            }

            %self .btn-discret:hover{
                background-color: var(--component-bg-color-plus);
            }
            `
    }

    onPlace(myComponent, elementTarget) {
    }

}