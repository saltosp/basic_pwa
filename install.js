"use strict";
//to start the installation dialog
var deferredInstallPrompt = null,
    installButton = document.getElementById("btnInstall");

function saveBeforeInstallPromptEvent(e) {
    deferredInstallPrompt = e, installButton.removeAttribute("hidden")
}

function installPWA(e) {
    (deferredInstallPrompt.prompt(), e.srcElement.setAttribute("hidden", !0), deferredInstallPrompt.userChoice.then(e => {
        "accepted" === e.outcome ? console.log("User accepts the installation") : console.log("User doesn't accepts the installation"), deferredInstallPrompt = null
    }))
}

function logAppInstalled(e) {
    console.log("PWA installed");
}

installButton.addEventListener("click", installPWA), window.addEventListener("beforeinstallprompt", saveBeforeInstallPromptEvent), window.addEventListener("appinstalled", logAppInstalled);