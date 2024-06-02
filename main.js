const APP = {
  deferredInstall: null,
  init() {
    if ("serviceWorker" in navigator) {
      //register our service worker
      navigator.serviceWorker
        .register("/service-worker.js", {
          updateViaCache: "none",
          scope: "/",
        })
        .then(() => {
          console.log("finished registering");
        })
        .catch((err) => {
          console.warn("Failed to register", err.message);
        });
      //listen for messages
      navigator.serviceWorker.addEventListener("message", ({ data }) => {
        //received a message from the service worker
        console.log(data, "from service worker");
      });

      //listen for `appinstalled` event
      window.addEventListener("appinstalled", (evt) => {
        //deprecated but still runs in Chrome-based browsers.
        //Not very useful event.
        //Better to use the DOMContentLoaded and then look at how it was launched
      });

      //listen for `beforeinstallprompt` event
      window.addEventListener("beforeinstallprompt", (ev) => {
        // Prevent the mini-infobar from appearing on mobile
        ev.preventDefault();
        // Stash the event so it can be triggered later.
        APP.deferredInstall = ev;
        console.log("saved the install event");
        // Update UI notify the user they can install the PWA
        // if you want here...
      });

      let btn = document.getElementById("btnInstall");
      btn?.addEventListener("click", APP.startChromeInstall);
    }

    const notifyBtn = document.getElementById("notify-btn");
    notifyBtn.addEventListener("click", () => {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          navigator.serviceWorker.getRegistration().then((reg) => {
            reg.showNotification("Welcome!", {
              body: "Thank you for installing our app! Click here to explore.",
              icon: "icon.svg",
            });
          });
        }
      });
    });
  },
  startChromeInstall() {
    if (APP.deferredInstall) {
      console.log(APP.deferredInstall);
      APP.deferredInstall.prompt();
      APP.deferredInstall.userChoice.then((choice) => {
        if (choice.outcome == "accepted") {
          //they installed
          console.log("installed");
        } else {
          console.log("cancel");
        }
      });
    }
  },
};

document.addEventListener("DOMContentLoaded", APP.init);
