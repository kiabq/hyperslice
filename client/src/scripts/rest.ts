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

    const url = input.value;
    const beingsWith = new RegExp(/^(http|https):\/\//);
    const urlPattern = new RegExp(/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        post("http://localhost:3001", { data: "adada" })
        .then((response) => {
            console.log(response)
        });
        // console.log(url);
    })
})();