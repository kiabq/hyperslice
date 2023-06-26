
async function post(url: string, data={}) {    
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then((response) => {
        return response.json();
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
    const form = document.querySelector("#form-long") as HTMLFormElement;
    const input = document.querySelector("#link-input") as HTMLInputElement;
    const inputError = document.querySelector('.link-error') as HTMLSpanElement;
    const shortened = document.querySelector("#link-short") as HTMLInputElement;
    const banned = import.meta.env.PUBLIC_BACKEND_URL;
    const bannedRegex = new RegExp(banned, "i");

    // What in the everloving fuck is this??
    input.addEventListener("invalid", (e) => {
        e.preventDefault();
        inputError.innerText = input.validationMessage.toLowerCase();
        input.setCustomValidity("");
        input.title = "";
        input.classList.add("link-invalid");
    })

    input.addEventListener("input", (e) => {
        const element = (e.target as HTMLInputElement);
        input.setCustomValidity("");

        if (bannedRegex.test(element.value)) {
            input.setCustomValidity('Banned URL');
            input.classList.add('link-invalid');
            inputError.innerText = input.validationMessage.toLowerCase();
        } else if (!input.validity.valid) {
            input.classList.add('link-invalid');
            inputError.innerText = input.validationMessage.toLowerCase();
        } else {
            input.classList.remove('link-invalid');
        }
    })

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const url = checkHTTP(input.value);
        const encodedURL = encodeURIComponent(url);
        
        // Throw error for form to pick up
        if (bannedRegex.test(input.value)) {
            input.setCustomValidity("Banned URL");
        } else {
            post(`${import.meta.env.PUBLIC_BACKEND_URL}`, { data: encodedURL })
                .then((response) => {
                    form.reset();
                    shortened.value = response.data;
                })
                .catch((err) => {/* Do Something*/})
        }
    })
})();