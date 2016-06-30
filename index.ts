const rel = document.querySelectorAll("a") as NodeListOf<HTMLAnchorElement>
const http = /https?:\/\//

for (let i = 0; i < rel.length; i++) {
    if (rel[i].href.match(http)) {
        rel[i].innerHTML = rel[i].href.replace(http, "")
    }
}

const now = document.querySelector("#now") as HTMLElement
const d = new Date()
const hr = d.getHours()

now.innerHTML = String(d.getFullYear())
if (hr < 6 || hr > 17) {
    document.documentElement.className = "dark"
}
