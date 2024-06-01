if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").then(function () {
    console.log("Service Worker Registered");
  }).catch(function(error) {
    console.error('Service Worker Registration Failed:', error);
});
}

let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener("beforeinstallprompt", (e) => {
  console.log('beforeinstallprompt event fired');
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';

  installBtn.addEventListener('click', () => {
    installBtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
    });
});

});

window.addEventListener('appinstalled', (evt) => {
  console.log('a2hs', 'installed');
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
