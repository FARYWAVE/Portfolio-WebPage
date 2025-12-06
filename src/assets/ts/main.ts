document.addEventListener("DOMContentLoaded", () => {
    enablePfpFade();
    enablePfpVignette();
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