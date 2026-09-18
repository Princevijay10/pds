import webpush from "web-push";
import PushSubscription from "../models/PushSubscription.js";

const getVapidDetails = () => {
  const { VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;

  if (!VAPID_SUBJECT || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return null;
  }

  return {
    subject: VAPID_SUBJECT,
    publicKey: VAPID_PUBLIC_KEY,
    privateKey: VAPID_PRIVATE_KEY,
  };
};

export const getPublicVapidKey = () => process.env.VAPID_PUBLIC_KEY || "";

export const sendPushToAllAdmins = async (payload) => {
  const vapidDetails = getVapidDetails();

  if (!vapidDetails) {
    console.warn("Push notifications skipped: VAPID environment variables are not configured.");
    return;
  }

  webpush.setVapidDetails(
    vapidDetails.subject,
    vapidDetails.publicKey,
    vapidDetails.privateKey
  );

  const subscriptions = await PushSubscription.find().lean();

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: subscription.keys,
          },
          JSON.stringify(payload),
          { TTL: 300 }
        );
      } catch (error) {
        if (error.statusCode === 404 || error.statusCode === 410) {
          await PushSubscription.deleteOne({ _id: subscription._id });
          return;
        }
        console.error("Push notification failed:", error.message);
      }
    })
  );
};
