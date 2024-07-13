import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { LanguageProvider } from "./Utils/LanguageContext";
import { SocketProvider } from "./Utils/SocketProvider";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./service-worker.js")
    .then(function (registration) {
      console.log("Service Worker registered with scope:", registration.scope);
      requestNotificationPermission();
    })
    .catch(function (error) {
      console.log("Service Worker registration failed:", error);
    });
}

function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission()
      .then(function (permission) {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.log("Notification permission denied.");
        }
      })
      .catch(function (error) {
        console.error("Error requesting notification permission:", error);
      });
  } else {
    console.log("Notifications API not supported in this browser.");
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
