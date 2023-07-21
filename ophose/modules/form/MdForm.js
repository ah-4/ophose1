
class MdForm extends OphoseModule {

    constructor() {
        super();
    }

    style() {
        return /* css */`
        %self {
            padding: 2em 0;
        }
    
        %self h3 {
            margin: 0 0 1em;
            text-align: center;
        }
    
        %self form > div{
            padding: 1.25em;
            margin: 1em auto 0;
            background-color: var(--component-bg-color);
            display: flex;
            flex-direction: column;
            border-radius: 0.25em;
            border: var(--component-border);
            position: relative;
            width: 50%;
            min-width: 576px;
        }
    
        %self form label {
            margin-bottom: 0.5em;
            font-size: 0.75em;
        }
    
        %self form input[type=text],
        %self form input[type=password],
        %self form input[type=email],
        %self select {
            background-color: var(--component-bg-color-plus);
            border: var(--component-border);
            margin-bottom: 1em;
            outline: none;
            border-radius: 0.25em;
            font-size: 1em;
            padding: 0.5em;
        }
    
        %self form input[type=submit],
        %self form .auth_btn {
            text-align: center;
            background-color: var(--component-bg-color-plus);
            border: none;
            outline: none;
            padding: 0.625em 1em;
            border-radius: 0.25em;
            font-weight: bold;
            margin-top: 0.5em;
            transition-duration: 300ms;
            cursor: pointer;
        }
    
        %self form input[type=submit]:hover,
        %self form .auth_btn:hover {
            background-color: var(--component-bg-color-mult);
        }
    
        %self form input[type=checkbox] {
            align-self: flex-start;
        }
    
        %self .additional_text {
            color: gray;
        }
    
        %self .go_back_btn {
            font-size: 1.5em;
            margin-bottom: 1em;
            cursor: pointer;
        }
            `
    }

    getFormFiles(id) {
        return $(this.elementTarget + " form *[name=" + id + "]")[0].files;
    }

    getInputValue(id) {
        return $(this.elementTarget + " form *[name=" + id + "]").val();
    }

    onPlace(myComponent, elementTarget) {
        this.elementTarget = elementTarget;
        $(() => {
            $(elementTarget + " form").submit((event) => {
                if (!myComponent.onSubmit) {
                    return;
                }
                event.preventDefault();
                let inputs = $(elementTarget + " form").serializeArray();
                let fixedInputs = {};
                inputs.map((e) => {
                    fixedInputs[e["name"]] = e["value"];
                })
                myComponent.onSubmit(fixedInputs);
            });
        });
    }

}