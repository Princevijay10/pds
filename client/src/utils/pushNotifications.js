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

  const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  const keyResponse = await fetch("/api/push/public-key");
  const keyData = await keyResponse.json();

  if (!keyResponse.ok || !keyData.publicKey) {
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

  const response = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("pds_token") || ""}`,
    },
    body: JSON.stringify(subscription),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to enable notifications.");
  }
  return data;
};

export const sendPushTest = async () => {
  const response = await fetch("/api/push/test", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("pds_token") || ""}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to send test notification.");
  }
  return data;
};
