export default (function() {
    const shortened = document.getElementById("link-short") as HTMLInputElement;
    const copy = document.querySelector(".link-copy") as HTMLButtonElement;
    
    // 1. When user click copy, if writeText() is successful, shoot confetti out
    function toClipboard() {
        navigator.clipboard
            .writeText(shortened.value)
            // Trigger Toast
            .then(() => {
                const copyBounds = copy.getBoundingClientRect();
                const confettiX = ((copyBounds.x + (copyBounds.width / 2)) / window.innerWidth);
                const confettiY = (copyBounds.y / window.innerHeight);
        
                // @ts-ignore
                confetti({
                    particleCount: 150,
                    spread: 50,
                    origin: { y: confettiY, x: confettiX }
                });
            })
            // Trigger Failed
            .catch(/* Do Something */)
    }

    copy.addEventListener("click", () => {    
        toClipboard();
    });
})()