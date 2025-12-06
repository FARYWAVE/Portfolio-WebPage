"use strict";
document.addEventListener("DOMContentLoaded", () => {
    calculateMainContentHeight();
    enableNavHighlight();
    enableBurgerMenu();
    localize();
});
function calculateMainContentHeight() {
    const mainContent = document.querySelector('.main-content');
    function updateMainContentHeight() {
        const h = mainContent.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--main-content-height', `${h}px`);
    }
    updateMainContentHeight();
    new ResizeObserver(updateMainContentHeight).observe(mainContent);
}
function enableNavHighlight() {
    const navLinks = document.querySelectorAll('.nav-bar a');
    const highlight = document.querySelector('.bar-highlighter');
    const sections = [
        ...document.querySelectorAll('section'),
        document.querySelector('footer')
    ];
    if (!highlight)
        return;
    function moveHighlight(link) {
        const fs = parseFloat(getComputedStyle(document.documentElement)
            .getPropertyValue('--fs-text'));
        const isMobile = window.matchMedia("(max-width: 800px)").matches;
        if (!isMobile) {
            const offsetLeft = link.offsetLeft;
            const offsetWidth = link.offsetWidth;
            highlight.style.left = offsetLeft - fs * 10 + 'px';
            highlight.style.top = "";
            highlight.style.width = offsetWidth + fs * 20 + "px";
            highlight.style.height = "";
        }
        else {
            const offsetTop = link.offsetTop;
            const offsetHeight = link.offsetHeight;
            highlight.style.top = offsetTop - fs * 17 + "px";
            highlight.style.left = "0";
            highlight.style.width = "100%";
            highlight.style.height = offsetHeight + fs * 4 + "px";
        }
    }
    navLinks.forEach(link => {
        link.addEventListener('click', () => moveHighlight(link));
    });
    function track() {
        const midpoint = window.innerHeight * 0.35;
        let currentSection = null;
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
            const link = document.querySelector(`.nav-bar a[href="#${currentSection.id}"]`);
            if (link)
                moveHighlight(link);
        }
        requestAnimationFrame(track);
    }
    requestAnimationFrame(track);
}
function enableBurgerMenu() {
    const btn = document.getElementById('burger-toggle');
    if (!btn)
        return;
    const iconClosed = document.getElementById('icon-burger');
    const iconOpened = document.getElementById('icon-cross');
    const menu = document.getElementById('nav-bar');
    btn.addEventListener('click', () => {
        iconClosed.classList.toggle('active');
        iconOpened.classList.toggle('active');
        menu.classList.toggle('open');
    });
}
function localize() {
    const originalFonts = {
        '--fs-title': '3rem',
        '--fs-section-title': '2.5rem',
        '--fs-subsection-title': '1.8rem',
        '--fs-text': '1.1rem'
    };
    const scale = 0.9;
    const root = document.documentElement;
    const fullPath = window.location.pathname;
    const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1);
    const page = fileName.substring(0, fileName.lastIndexOf('.')).replace("index", "main");
    const lang = "en";
    // @ts-ignore
    if (lang === "ru") {
        document.body.style.fontFamily = "UltraRu";
        Object.entries(originalFonts).forEach(([varName, value]) => {
            const match = value.match(/^([\d.]+)(rem|px)$/);
            if (match) {
                const size = parseFloat(match[1]);
                const unit = match[2];
                root.style.setProperty(varName, `${size * scale}${unit}`);
            }
        });
    }
    else {
        Object.entries(originalFonts).forEach(([varName, value]) => {
            root.style.setProperty(varName, value);
        });
    }
    const jsonName = `${page}_${lang}.json`;
    const json = fetch(`./assets/localization/${jsonName}`)
        .then(res => res.json())
        .then(data => {
        for (let line of Object.keys(data)) {
            const element = document.getElementById(line);
            if (element)
                element.textContent = data[line];
        }
    });
}
