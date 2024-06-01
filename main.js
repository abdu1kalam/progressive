if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").then(function () {
    console.log("Service Worker Registered");
  });
}

// let deferredPrompt;
// window.addEventListener("beforeinstallprompt", (e) => {
//   e.preventDefault();
//   deferredPrompt = e;
// });

let installPrompt = null;
const installButton = document.querySelector("#install");

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.removeAttribute("hidden");
});

installButton.addEventListener("click", async () => {
  if (!installPrompt) {
    return;
  }
  const result = await installPrompt.prompt();
  console.log(`Install prompt was: ${result.outcome}`);
  installPrompt = null;
  installButton.setAttribute("hidden", "");
});

const notifyBtn = document.getElementById("notify-btn");
notifyBtn.addEventListener("click", () => {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      navigator.serviceWorker.getRegistration().then((reg) => {
        reg.showNotification("Hello!", {
          body: "This is a push notification.",
          icon: "icon.svg",
        });
      });
    }
  });
});
