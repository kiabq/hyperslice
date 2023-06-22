async function post(url: string, data={}) {    
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    return response;
}

function checkHTTP(url: string) {
    const beginsWith = new RegExp(/^(http|https):\/\//);

    if (!beginsWith.test(url)) {
        return 'http://' + url;
    } else {
        return url;
    }
}

export default (function() {
    const form = document.querySelector("#form") as HTMLFormElement;
    const input = document.querySelector("#link-input") as HTMLInputElement;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const url = checkHTTP(input.value);
        const encodedURL = encodeURIComponent(url);
        post("http://localhost:3001", { data: encodedURL })
        .then((response) => {
            if (response.status == 200) {
                form.reset();
            }
        })
    })
})();