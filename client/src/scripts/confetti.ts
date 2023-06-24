// Get starting position of copy
// Getter and Setter function for updating position of particles

function getRandomColor() {
    const colors = ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"];

    return colors[Math.floor(Math.random() * colors.length)];
}

class Confetti {
    x: number;
    y: number;
    obj: HTMLDivElement;
    color: string;
    ceiling: boolean;
    dX: number;
    dY: number;
    delay: number;

    constructor(x: number, y: number) {
        this.x = x,
        this.y = y,
        this.obj = document.createElement('div'),
        this.color = getRandomColor();
        this.ceiling = false;
        this.dX = 0;
        this.dY = 0;
        this.delay = 0;
    }

    // Refactor these functions
    raise() {
        this.y = this.y - this.dY; 
    }

    lower() {
        this.y = this.y + this.dY;
    }

    changeX() {
        this.x = this.x + this.dX;
    }
}

export default function celebrate() {
    const copy = document.querySelector(".link-copy") as HTMLButtonElement;
    let particles: Confetti[] = [];

    function getLeft() {
        const left = copy.getBoundingClientRect().left + (Math.random() * copy.clientWidth);
        const final = left;
        return final;
    }
    
    function getTop() {
        const top = copy.getBoundingClientRect().top;
        const final = top + (Math.random() * 5);
        return final;
    }

    for (let i = 0; i < 200; i++) {
        const particle = new Confetti(getLeft(), getTop());
        particle.obj.className = "confetti";
        particle.obj.setAttribute("style", `left: ${particle.x}px; top: ${particle.y}px; background-color: ${particle.color}`);
        particles.push(particle);
        document.body.appendChild(particle.obj);

        const sideDecide = Math.floor(Math.abs(particles[i].x - getLeft())) / 4;

        if (sideDecide <= 2) {
            particle.dX = -Math.random()
        } else if (sideDecide <= 4) {
            particle.dX = -Math.random() * 2;
        } else if (sideDecide <= 6) {
            particle.dX = Math.random()
        } else {
            particle.dX = Math.random() * 2;
        }

        particle.dY = (Math.random() * 1.75) + 1;

        // particle amount / i - 

        console.log((200 / i))
    }

    // Worry about this later :V
    // window.addEventListener("resize", () => {
    //     const elements = document.getElementsByClassName("confetti");

    //     for (let i = 0; i < elements.length; i++) {
    //         particles[i].x = getLeft();

    //         console.log(particles[i].y - getTop());

    //         particles[i].y = getTop() - Math.abs(particles[i].y - getTop());

    //         elements[i].setAttribute("style", `left:${getLeft()}px; top:${getTop()}px;`);
    //     }
    // })

    // implement update particle function
    // this function will handle setting styles
    function updateParticle() {}

    function render() {
        for (let i = 0; i < particles.length; i++) {
            const element = document.body.getElementsByClassName('confetti')[i]
            if (Math.abs(particles[i].y - getTop()) > (75 + Math.random() * 250) && !particles[i].ceiling) {
                particles[i].ceiling = true;
                particles[i].dY = Math.random() * 1.5;
            }

            if (Math.abs(particles[i].y - getTop()) >= 50 && particles[i].ceiling) {
                particles[i].dX = particles[i].dX / 1;
            }
            
            particles[i].ceiling ? particles[i].lower() : particles[i].raise(); 
            particles[i].changeX();

            element.setAttribute('style', `left: ${particles[i].x}px; top: ${particles[i].y}px; background-color: ${particles[i].color}`)
        }
    }

    setInterval(() => {
        render();
    }, 30)
}