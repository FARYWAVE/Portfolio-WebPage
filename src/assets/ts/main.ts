document.addEventListener("DOMContentLoaded", () => {
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
});
