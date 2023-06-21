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

export default (function() {
    const form = document.querySelector("#form") as HTMLFormElement;
    const input = document.querySelector("#link-input") as HTMLInputElement;
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const url = encodeURIComponent(input.value);
        post("http://localhost:3001", { data: url })
        .then((response) => {
            if (response.status == 200) {
                form.reset();
            }
        })
    })
})();