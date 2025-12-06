document.addEventListener("DOMContentLoaded", () => {
    enableImageFade();
    enableImageVignette();
    loadProject();
});


function loadProject() {
    function setValue(id: string, value: any) {
        const element = document.getElementById(id);
        if (element) {
            if (id == "languages") {
                if (value.length == 0) element.remove();
                for (let lang of value) {
                    const div = document.createElement("div");
                    const a =  document.createElement("a");
                    a.href = `languages.html#${lang.toLowerCase()}`;
                    a.textContent = lang;
                    div.appendChild(a);
                    element.appendChild(div);
                }

            } else if (id == "tools" || id == "libs") {
                if (value.length == 0) element.remove();
                for (let tool of value) {
                    const div = document.createElement("div");
                    const h3 =  document.createElement("h3");
                    h3.textContent = tool;
                    div.appendChild(h3);
                    element.appendChild(div);
                }

            } else if (id == "link") {
                element.textContent = value as string
                (element as HTMLAnchorElement).href = value as string;
                (element as HTMLAnchorElement).target = "_blank";
            } else if (id == "image") {
                (element as HTMLImageElement).src = value as string;
            } else {
                element.textContent = value;
            }
        }
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
        fetch("./assets/data/projects.json")
            .then(res => res.json())
            .then(projects => {
                const p = projects[id];
                if (!p) return;
                setValue("title", p.title);
                setValue("languages", p.languages);
                setValue("tools", p.tools);
                setValue("libs", p.libs);
                setValue("image", p.image);
                if (!p.github) {
                    const link = document.getElementById("link-subsection");
                    link?.remove()
                } else {
                    setValue("link", p.github);
                }

                if (navigator.language.includes("ru")) {
                    setValue("subtitle", p.subtitle_ru);
                    setValue("description", p.description_ru);
                } else {
                    setValue("subtitle", p.subtitle_en);
                    setValue("description", p.description_en);
                }
            });
    }
}


function enableImageFade() {
    const overlay = document.querySelector('.image-overlay') as HTMLElement;
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

function enableImageVignette() {
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