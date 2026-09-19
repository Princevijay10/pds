import api from "./api.js";

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

export const enablePushNotifications = async () => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push notifications are not supported on this device/browser.");
  }

  const registration = await navigator.serviceWorker.register("/sw.js", {
    scope: "/",
  });

  const { data: keyData } = await api.get("/push/public-key");

  if (!keyData?.publicKey) {
    throw new Error("Push notifications are not configured on the server.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(keyData.publicKey),
    });
  }

  const { data } = await api.post("/push/subscribe", subscription.toJSON());

  return data;
};

export const sendPushTest = async () => {
  const { data } = await api.post("/push/test");

  return data;
};
