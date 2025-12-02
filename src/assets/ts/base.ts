document.addEventListener("DOMContentLoaded", () => {
    enablePfpFade();
    enablePfpVignette();
    calculateMainContentHeight();
    calculateHeaderHeight();
    enableNavHighlight();
});


function enablePfpFade() {
    const overlay = document.querySelector('.profile-picture-overlay') as HTMLElement;
    if (!overlay) return;

    function handleScroll() {
        const scroll = window.scrollY;
        const max = window.innerHeight * 0.7;
        let opacity = scroll / max;

        if (opacity < 0) opacity = 0;
        if (opacity > 1) opacity = 1;

        overlay.style.background = `rgba(0,0,0,${opacity})`;
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

function enablePfpVignette() {
    const canvas = document.getElementById("overlay") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (ctx) {
        const w = canvas.width;
        const h = canvas.height;
        const grd = ctx.createRadialGradient(
            w / 2, h / 2, 0,
            w / 2, h / 2, Math.max(w, h)
        );

        grd.addColorStop(0, "rgba(0,0,0,0)");
        grd.addColorStop(1, "rgba(0,0,0,1)");

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);
    }
}


function calculateMainContentHeight() {
    const mainContent = document.querySelector('.main-content') as HTMLElement;

    function updateMainContentHeight() {
        const h = mainContent.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--main-content-height', `${h}px`);
    }

    updateMainContentHeight();

    new ResizeObserver(updateMainContentHeight).observe(mainContent);
}

function calculateHeaderHeight() {
    const header = document.querySelector('.header') as HTMLElement;

    function updateHeaderHeight() {
        const h = header.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--header-height', `${h}px`);
        document.documentElement.style.setProperty("--footer-height", `calc(100vh - ${h * 1.85}px)`)
    }

    updateHeaderHeight();

    new ResizeObserver(updateHeaderHeight).observe(header);
}


function enableNavHighlight() {
    const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-bar a');
    const highlight = document.querySelector<HTMLDivElement>('.bar-highlighter');
    const sections = [
        ...document.querySelectorAll<HTMLElement>('section'),
        document.querySelector<HTMLElement>('footer')!
    ];
    if (!highlight) return;

    function moveHighlight(link: HTMLAnchorElement) {
        const offsetLeft = link.offsetLeft;
        const offsetWidth = link.offsetWidth;
        const fs = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fs-text'));

        highlight!.style.left = offsetLeft - fs * 10 + 'px';
        highlight!.style.width = offsetWidth + fs * 20 + 'px';
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => moveHighlight(link));
    });

    function track() {
        const midpoint = window.innerHeight * 0.35;

        let currentSection: HTMLElement | null = null;

        for (const sec of sections) {
            const rect = sec.getBoundingClientRect();
            if (rect.top <= midpoint && rect.bottom >= midpoint) {
                currentSection = sec;
                break;
            }
        }

        const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
        if (atBottom) {
            currentSection = sections[sections.length - 1];
        }

        if (currentSection) {
            const link = document.querySelector<HTMLAnchorElement>(
                `.nav-bar a[href="#${currentSection.id}"]`
            );
            if (link) moveHighlight(link);
        }

        requestAnimationFrame(track);
    }

    requestAnimationFrame(track);
}


/*
function enableBackgroundSnakes() {
    const canvas = document.getElementById("bg-snakes") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    interface TrailPoint {
        x: number;
        y: number;
    }

    class Snake {
        x: number;
        y: number;
        isReducing: boolean;
        orientation: number;
        length: number;
        speed: number;
        direction: number;
        color: string;
        trail: TrailPoint[]

        constructor() {
            this.x = 0;
            this.y = 0;
            this.isReducing = false;
            this.orientation = 0
            this.length = 0;
            this.speed = 0;
            this.direction = 0;
            this.color = "";
            this.trail = [];
            this.reset();
        }

        reset(): void {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.isReducing = false;
            this.orientation = Math.random() < 0.7 ? 45 : 0;
            this.length = 20 + Math.random() * 40;
            this.speed = 2;
            this.trail = [];

            this.direction = this.orientation + Math.floor((Math.random() * 4)) * 90;

            const styles = getComputedStyle(document.documentElement);
            const primary = styles.getPropertyValue('--primary').trim();
            const secondary = styles.getPropertyValue('--secondary').trim();
            const accent = styles.getPropertyValue('--accent').trim();
            const clr = Math.random() * 10;
            if (clr < 5) this.color = primary;
            else if (clr < 8) this.color = secondary;
            else this.color = accent;
        }

        update(): void {
            if (this.isReducing) {
                if (this.trail.length === 0) this.reset();
                this.trail.pop();
            } else {
                if (Math.random() < 0.02) {
                    this.direction += 90 * (Math.random() < 0.5 ? 1 : -1);
                }
                const newPoint: TrailPoint = {
                    x: this.x + Math.cos(this.direction * Math.PI / 180) * this.speed,
                    y: this.y + Math.sin(this.direction * Math.PI / 180) * this.speed
                };

                this.trail.unshift(newPoint);
            }
            if (this.trail.length > this.length) {
                this.isReducing = true;
            }
        }

        drawRotatedPoint(x: number, y: number, alpha: number): void {
            if (ctx) {
                ctx.save();
                ctx.globalAlpha = alpha;

                ctx.translate(x, y);
                ctx.rotate(Math.PI / 4);

                const s = parseFloat(
                    getComputedStyle(document.documentElement)
                        .getPropertyValue('--bg-snake-width')
                );

                ctx.fillRect(-s / 2, -s / 2, s, s);

                ctx.restore();
            }
        }

        drawPoint(x: number, y: number, alpha: number): void {
            if (ctx) {
                ctx.save();
                ctx.globalAlpha = alpha;

                ctx.translate(x, y);

                const s = parseFloat(
                    getComputedStyle(document.documentElement)
                        .getPropertyValue('--bg-snake-width')
                );
                ctx.fillRect(-s / 2, -s / 2, s, s);

                ctx.restore();
            }
        }

        draw(): void {
            if (ctx) {
                ctx.fillStyle = this.color;

                const n = this.trail.length;
                const nf = this.length * 0.3;
                for (let i = n - 1; i >= 0; i--) {
                    let p: TrailPoint;
                    let fade: number;
                    if (this.isReducing) {
                        let t = i / nf
                        fade = (t > 1 ? 1 : t) * 0.7;
                        p = this.trail[i];
                    } else {
                        let t = (i / nf) + 1
                        fade = (t > 1 ? 1 : t) * 0.7;
                        p = this.trail[i]
                    }
                    if (this.orientation === 0) this.drawPoint(p.x, p.y, fade);
                    else this.drawRotatedPoint(p.x, p.y, fade);
                }
            }
        }
    }

    const snakes: Snake[] = Array.from({ length: 15 }, () => new Snake());

    let last = 0;
    const TICK = 1000 / 3;

    function loop(ts: number) {
        if (ts - last >= TICK) {
            last = ts;

            ctx!!.fillStyle = "rgba(110, 3, 200, 1)";
            ctx!!.fillRect(0, 0, canvas!!.width, canvas!!.height);

            for (const snake of snakes) {
                snake.update();
                snake.draw();
            }
            console.log("Done")
        }
        requestAnimationFrame(loop);
    }

    loop(last);
}*/
