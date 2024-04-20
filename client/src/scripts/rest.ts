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
    }

    return url;
}

export default (function() {
    const form = document.getElementById("form-long") as HTMLFormElement;
    const input = document.getElementById("link-input") as HTMLInputElement;
    const inputError = document.querySelector(".link-error") as HTMLSpanElement;
    const shortened = document.getElementById("link-short") as HTMLInputElement;
    const submit = document.getElementById("link-submit") as HTMLButtonElement;
    const submitText = document.getElementById("submit-text") as HTMLSpanElement;
    const submitLoader = document.getElementById("submit-loader") as HTMLSpanElement;
    const qrwrapper = document.getElementById("qr-wrapper");
    const png = document.getElementById("qr-png");
    const webp = document.getElementById("qr-webp");
    const jpg = document.getElementById("qr-jpg");

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

    input.addEventListener("invalid", (e) => {
        e.preventDefault();
        inputError.innerText = input.validationMessage.toLowerCase();
        input.setCustomValidity("");
        input.title = "";
        input.classList.add("link-invalid");
    })

    input.addEventListener("input", (e) => {
        // const element = (e.target as HTMLInputElement);
        input.setCustomValidity("");

        // if (bannedRegex.test(element.value)) {
        //     submit.disabled = true;
        //     input.setCustomValidity("Banned URL");
        //     input.classList.add("link-invalid");
        //     inputError.innerText = input.validationMessage.toLowerCase();
        // }
        
        if (!input.validity.valid) {
            submit.disabled = true;
            input.classList.add("link-invalid");
            inputError.innerText = input.validationMessage.toLowerCase();
        } else {
            submit.disabled = false;
            input.classList.remove("link-invalid");
        }
    })

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const apex = import.meta.env.PUBLIC_BACKEND_URL;
        const url = checkHTTP(input.value);
        const encodedURL = encodeURIComponent(url);
        let qr = null;

        useLoader();

        // if (bannedRegex.test(input.value)) {
        //     input.setCustomValidity("Banned URL");
        // } else {
        post('http://' + apex, { data: encodedURL })
            .then((response) => {
                removeLoader();

                if (response.error) {
                    throw response;
                }

                if (qrwrapper instanceof HTMLDivElement) {
                    if (qrwrapper.classList.contains('hide')) {
                        qrwrapper.classList.remove('hide');
                    }
                }

                shortened.value = response.data.url;
                
                qr = new QRious({
                    element: document.getElementById("qr"),
                    value: shortened.value,
                    size: 150
                });

                if (png instanceof HTMLAnchorElement) {
                    png.href = qr.toDataURL("image/png");
                    png.download = response.data.code;
                }
                
                if (webp instanceof HTMLAnchorElement) {
                    webp.href = qr.toDataURL("image/webp");
                    webp.download = response.data.code;
                }

                if (jpg instanceof HTMLAnchorElement) {
                    jpg.href = qr.toDataURL("image/jpeg");
                    jpg.download = response.data.code;
                }

                form.reset();
            })
            .catch((error) => {
                input.setCustomValidity(error.reason);
                input.classList.add("link-invalid");
                inputError.innerText = input.validationMessage.toLowerCase();
                removeLoader();
            })
        // }
    })
})();