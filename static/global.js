// step 1
console.log("IT’S ALIVE!");

function $$ (selector, context = document) {
	return Array.from(context.querySelectorAll(selector));
}

// step 2
// let currentLink = navLinks.find(a => a.host === location.host && a.pathname === location.pathname)

// if (currentLink) { // or if (currentLink !== undefined)
// 	currentLink.classList.add("current");
// }

// step 3.1
let pages = [
	{url: "./", title: "Home"},
	{url: "./projects", title: "Projects"},
    {url: "./contact", title: "Contact"},
    {url: "https://github.mit.edu/danahua", title: "GitHub"},
	// add the rest of your pages here
];

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
	let url = p.url;
	let title = p.title;

    let a = document.createElement("a");
    a.href = url;
    a.textContent = title;
    

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add("current");
    }

    if (a.host !== location.host) {
        a.target = "_blank";
    }

    nav.append(a);
}

// step 4
document.body.insertAdjacentHTML("afterbegin", `
	<label class="color-scheme">
		Theme:
		<select>
			<option value="light dark">Auto</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
		</select>
	</label>`
);

let select = document.querySelector("select");

select.addEventListener("input", function (event) {
	console.log("color scheme changed to", event.target.value);
    document.documentElement.style.setProperty("color-scheme", event.target.value);
    localStorage.colorScheme = event.target.value;
});

if ("colorScheme" in localStorage) {
    // set color schemee to the stored local value
    document.documentElement.style.setProperty("color-scheme", localStorage.colorScheme);
    select.value = localStorage.colorScheme;
}

// step 5
let form = document.querySelector("form");

form?.addEventListener("submit", function (event) {
    event.preventDefault();
    let data = new FormData(form);

    let url = form.action + "?";
    for (let [name, value] of data) {
	    url += (name + "=" + value + "&")
	    console.log(name, value);
    }

    location.href = url;
})




