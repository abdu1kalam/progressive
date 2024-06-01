if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").then(function () {
    console.log("Service Worker Registered");
  });
}

let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
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
