document.addEventListener("DOMContentLoaded", () => {
    calculateMainContentHeight();
    enableNavHighlight();
    enableBurgerMenu();
});

function calculateMainContentHeight() {
    const mainContent = document.querySelector('.main-content') as HTMLElement;

    function updateMainContentHeight() {
        const h = mainContent.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--main-content-height', `${h}px`);
    }

    updateMainContentHeight();

    new ResizeObserver(updateMainContentHeight).observe(mainContent);
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
        const fs = parseFloat(getComputedStyle(document.documentElement)
            .getPropertyValue('--fs-text'));

        const isMobile = window.matchMedia("(max-width: 800px)").matches;

        if (!isMobile) {
            const offsetLeft = link.offsetLeft;
            const offsetWidth = link.offsetWidth;

            highlight!.style.left = offsetLeft - fs * 10 + 'px';
            highlight!.style.top = "";
            highlight!.style.width = offsetWidth + fs * 20 + "px";
            highlight!.style.height = "";
        } else {
            const offsetTop = link.offsetTop;
            const offsetHeight = link.offsetHeight;

            highlight!.style.top = offsetTop - fs * 17 + "px";
            highlight!.style.left = "0";
            highlight!.style.width = "100%";
            highlight!.style.height = offsetHeight + fs * 4 + "px";
        }
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

function enableBurgerMenu() {
    const btn = document.getElementById('burger-toggle') as HTMLButtonElement;
    if (!btn) return;
    const iconClosed = document.getElementById('icon-burger') as HTMLElement;
    const iconOpened = document.getElementById('icon-cross') as HTMLElement;
    const menu = document.getElementById('nav-bar') as HTMLElement;

    btn.addEventListener('click', () => {
        iconClosed.classList.toggle('active');
        iconOpened.classList.toggle('active');

        menu.classList.toggle('open');
    });
}
