// ==UserScript==
// @name         VW Stellenbörse | additional features
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  adds expand all, filter and copy2clip functionality
// @author       marv017
// @match        https://karriere.volkswagen.de/sap/bc/bsp/sap/zvw_hcmx_ui_ext/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=volkswagen.de
// @grant        none
// ==/UserScript==

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    // warten auf fertigladen
    // Seite zeigt solange spinner in der Mitte
    let spinner
    do {
    spinner = document.querySelector(".loadingSpinner.domAnimation")
    await sleep(200)
    } while (spinner.style.display !== 'none')
    await sleep(200)

    // logo entfernen um Platz zu schaffen
    document.getElementsByClassName("logo")[0].remove()

    // container für die buttons einfügen
    let btnContainer = document.createElement("div")
    btnContainer.classList.add("button-container")
    document.getElementsByClassName("topGradient")[0].appendChild(btnContainer)


    // expand all button einfügen
    let btn = document.createElement("BUTTON")
    let btnText = document.createTextNode("expand all")
    btn.onclick = async function(){
        let expand = document.querySelector("div.buttonSet:nth-child(1) > button:nth-child(1)")
        addToLog("starting expansion..")
        let i = 0
        while (expand.style.display !== 'none') {
            i++
            expand.click()
            await sleep(5)
            expand = document.querySelector("div.buttonSet:nth-child(1) > button:nth-child(1)")
        }
        addToLog("expanding finished (" + i + "x)")
    }
    btn.appendChild(btnText)
    btnContainer.appendChild(btn)


    // copy titles to clipboard button einfügen
    btn = document.createElement("BUTTON")
    btnText = document.createTextNode("clip titles")
    btn.onclick = async function(){
        navigator.clipboard.writeText(Array.from(document.querySelectorAll(".jobListItem > .details > .title"), (item => {return item.innerText})).join("\n"))
        addToLog("copied all titles to clipboard")
    }
    btn.appendChild(btnText)
    btnContainer.appendChild(btn)


    // filter button einfügen
    btn = document.createElement("BUTTON")
    btnText = document.createTextNode("filter")
    btn.onclick = async function(){
        for (let elem of document.querySelectorAll(".listItem.jobListItem")) {
            if (!elem.childNodes[3].childNodes[5].innerText.includes("Praktikant") && !elem.childNodes[3].childNodes[5].innerText.includes("Abschlussarbeit")) {
                elem.remove()
            }
        }
        addToLog("deleted all entries not containing 'abschlussarbeit' or 'praktikum'")
    }
    btn.appendChild(btnText)
    btnContainer.appendChild(btn)


    // create logging window
    let sb = document.createElement("div")
    sb.classList.add("snackbar")
    let log = document.createElement("ul")
    log.classList.add("log")

    sb.appendChild(log)
    document.getElementsByTagName("body")[0].appendChild(sb)

    addToLog("=== INFO ===")
    addToLog("Erweiterung, um die teilweise nicht funktionierende Such- und Filterfunktion der Webseite einfach zu umgehen.")

    addGlobalStyle(".snackbar {	overflow: hidden; position: absolute;	width: 249px;	margin: 20px;	top: 0;	border: rgba(0, 0, 0, 0.1) 1px solid;	height: 350px;	background-color: lightgray;	box-shadow: 2px 4px 10px rgba(64, 60, 60, 0.4);	right: 0;}")
    addGlobalStyle(".log { margin: 10px; height: 100%; width: 100% }")
    addGlobalStyle(".log div { margin: 5px 0px}")
    addGlobalStyle(".button-container { display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end; row-gap: 2px}")
    addGlobalStyle(".button-container button { width: 100px; }")



}

// nutzt important flag um überschreiben zu verhindern, falls die website css nachlädt und später anwendet.
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.replace(/;/g, ' !important;');
    head.appendChild(style);
}

function addToLog(msg) {
    let window = document.getElementsByClassName("log")[0]
    let entry = document.createElement("li")
    entry.innerText = msg
    window.appendChild(entry)

}

main()
