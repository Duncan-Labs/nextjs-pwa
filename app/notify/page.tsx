"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const base64ToUint8Array = (base64: string | undefined) => {
  const padding = "=".repeat((4 - ((base64?.length ?? 0) % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const Home = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<any>();
  const [registration, setRegistration] = useState<any>();

  const router = useRouter();

  useEffect(() => {
    console.log("useEffect");
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // run only in browser
      console.log({ navigator });
      navigator.serviceWorker.ready.then((reg) => {
        console.log("SERVICE WORKER READY");
        console.log({ reg });
        reg.pushManager.getSubscription().then((sub) => {
          if (
            sub &&
            !(
              sub.expirationTime &&
              Date.now() > sub.expirationTime - 5 * 60 * 1000
            )
          ) {
            console.log("set sub");
            setSubscription(sub);
            setSubscribed(true);
          }
        });

        setRegistration(reg);
      });
    }
  }, []);

  useEffect(() => {
    const subscribe = async () => {
      console.log({ registration });

      if (registration) {
        const sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64ToUint8Array(
            process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
          ),
        });
        // TODO: you should call your API to save subscription data on server in order to send web push notification from server
        setSubscription(sub);
        setSubscribed(true);
        console.log("web push subscribed!");
        console.log(sub);
      }
    };
    subscribe();
  }, [registration]);

  const unsubscribeButtonOnClick = async (event: any) => {
    event.preventDefault();
    await subscription.unsubscribe();
    // TODO: you should call your API to delete or invalidate subscription data on server
    setSubscription(null);
    setSubscribed(false);
    console.log("web push unsubscribed!");
  };

  const sendNotificationButtonOnClick = async (event: any) => {
    event.preventDefault();
    if (subscription == null) {
      console.error("web push not subscribed");
      return;
    }

    await fetch("/api/notification", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        subscription,
      }),
    });
  };
  return (
    <main className="flex min-h-screen flex-col items-center p-24 space-y-6">
      <button
        onClick={sendNotificationButtonOnClick}
        disabled={!subscribed}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Send Notification
      </button>
      <button
        onClick={() => router.push("/")}
        disabled={!subscribed}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Sign Out
      </button>
    </main>
  );
};

export default Home;
