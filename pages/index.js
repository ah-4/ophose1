class Index extends OphosePage {

    constructor() {
        super();
    }

    style() { 
        return /*css*/`
        .introduce {
            margin-top: 30vh;
            text-align: center;
        }

        .introduce .logo {
            width: 10em;
            transition-duration: 500ms;
        }

        .introduce .logo:hover {
            transform: rotate(360deg);
        }

        .introduce h2 {
            margin-bottom: 1em;
        }

        .introduce p {
            margin: 0 auto;
            width: 50%;
            text-align: justify;
        }
        `
    }

    render() {
        return /*html*/`
        <main>
            <div class="introduce">
                <img src="/public/img/logo.png" class="logo"/>
                <h2>You're currently running on Ophose!</h2>
                <p>Ophose offers scalability for both small and large-scale projects, making it a versatile choice for web development. Whether you're working on a personal website or a complex enterprise application, Ophose's architecture allows you to seamlessly scale your project to meet your evolving needs. With its modular and flexible design, Ophose enables you to start small and expand as your project grows. Say goodbye to limitations and embrace the scalability that Ophose brings to your web development journey.</p>
            </div>
        </main>
        `
    }

}

oshare(Index);