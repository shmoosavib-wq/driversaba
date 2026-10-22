import "core-js/features/queue-microtask";
import "core-js/features/global-this";
import "core-js/features/array/from";
import "core-js/features/promise";
import "core-js/stable";

import { RouterProvider } from "react-router-dom";
import { StrictMode, useCallback, useEffect, useState } from "react";
import "./global.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Client as Styletron } from "styletron-engine-monolithic";
import { BaseProvider } from "baseui";
import { Provider as StyletronProvider } from "styletron-react";
import { getToken } from "firebase/messaging";

import theme from "@/theme";
import ToastProvider from "@/components/global/ToastProvider";

import { router } from "./Routers";
import ClarityTracking from "./ClarityTracking";
import { isDev } from "./utils";
import { messaging } from "./firebase";

import UserNetwork from "./hooks/UserNetwork";
import NoInternetConnection from "./pages/NoInternetConnection";

const engine = new Styletron();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 5 * 1000,
    },
  },
});

if (!isDev && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration);
        // Update the service worker immediately
        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

export default function App() {
  const InternetConnection = UserNetwork();
  const [hasInternet, setHasInternet] = useState(true);

  useEffect(() => {
    setHasInternet(InternetConnection);
  }, [InternetConnection]);

  const requestPermission = useCallback(async () => {
    const permission = await Notification.requestPermission();
    console.log("Permission granted", permission);

    if (permission === "granted") {
      try {
        const token = await getToken(messaging, {
          vapidKey:
            "BPCPs2QxlngGu-cZAIKvXOuHpKsAmrE0ZRKYzJkFHuReilszaBPWutslUpsTUPCFVzEP_MBai2WjB5afTNxXouc",
        });
        console.log("Token generated", token);
        // Send this token to the server (db)
      } catch (error) {
        console.error("Error generating token", error);
      }
    } else {
      console.log("Notification permission denied");
    }
  }, []);

  useEffect(() => {
    // Request user for notification permission
    requestPermission();
  }, [requestPermission]);

  return (
    <StrictMode>
      <StyletronProvider value={engine}>
        <QueryClientProvider client={queryClient}>
          {!isDev && <ClarityTracking />}
          <BaseProvider theme={theme}>
            {hasInternet ? (
              <RouterProvider router={router} />
            ) : (
              <NoInternetConnection />
            )}
          </BaseProvider>
          <ToastProvider />
          {isDev && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </StyletronProvider>
    </StrictMode>
  );
}
