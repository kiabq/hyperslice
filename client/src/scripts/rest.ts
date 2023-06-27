import QRious from 'qrious';

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
        return "http://" + url;
    } else {
        return url;
    }
}

export default (function() {
    const form = document.getElementById("form-long") as HTMLFormElement;
    const input = document.getElementById("link-input") as HTMLInputElement;
    const inputError = document.querySelector(".link-error") as HTMLSpanElement;
    const shortened = document.getElementById("link-short") as HTMLInputElement;
    const submit = document.getElementById("link-submit") as HTMLButtonElement;
    const submitText = document.getElementById("submit-text") as HTMLSpanElement;
    const submitLoader = document.getElementById("submit-loader") as HTMLSpanElement;
    const banned = import.meta.env.PUBLIC_BACKEND_URL;
    const bannedRegex = new RegExp(banned, "i");

    function useLoader() {
        submit.disabled = true;
        submitText.classList.add('hide');
        submitLoader.classList.remove('hide');
    }

    function removeLoader() {
        submit.disabled = false;
        submitText.classList.remove('hide');
        submitLoader.classList.add('hide');
    }

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
            input.setCustomValidity("Banned URL");
            input.classList.add("link-invalid");
            inputError.innerText = input.validationMessage.toLowerCase();
        } else if (!input.validity.valid) {
            input.classList.add("link-invalid");
            inputError.innerText = input.validationMessage.toLowerCase();
        } else {
            input.classList.remove("link-invalid");
        }
    })

    console.log("Submitted")

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const apex = import.meta.env.PUBLIC_BACKEND_URL;
        const url = checkHTTP(input.value);
        const encodedURL = encodeURIComponent(url);
        
        useLoader();

        if (bannedRegex.test(input.value)) {
            input.setCustomValidity("Banned URL");
        } else {
            post(apex, { data: encodedURL })
                .then((response) => {
                    form.reset();
                    removeLoader();
                    shortened.value = response.data;
                    new QRious({
                        element: document.getElementById("qr"),
                        value: shortened.value
                    })
                })
                .catch((err) => {
                    console.log('error', err)
                    removeLoader();
                })
        }
    })
})();