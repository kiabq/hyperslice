import celebrate from "./confetti";

export default (function() {
    const shortened = document.querySelector("#link-short") as HTMLInputElement;
    const copy = document.querySelector(".link-copy") as HTMLButtonElement;

    // 1. Create confetti particles
    // 2. Calculate position of copy button
    // 3. Create path and velocity for particles to follow
    // 4. On window resize, recalculate particle position
    
    // 1. When user click copy, if writeText() is successful, shoot confetti out
    function toClipboard() {
        navigator.clipboard
            .writeText(shortened.value)
            // Trigger Toast
            .then(() => {
                celebrate();
            })
            // Trigger Failed
            .catch(/* Do Something */)
    }

    copy.addEventListener("click", () => {    
        toClipboard();
    });
})();