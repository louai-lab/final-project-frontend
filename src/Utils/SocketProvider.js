import React, { createContext, useEffect } from "react";
import io from "socket.io-client";
// import logo from '../../public/logo.png'

const SocketContext = createContext();

const socket = io(process.env.REACT_APP_BACKEND);

const SocketProvider = ({ children }) => {
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission()
        .then(function (permission) {
          if (permission === "granted") {
            // console.log("Notification permission granted.");
          } else {
            console.log("Notification permission denied.");
          }
        })
        .catch(function (error) {
          console.error("Error requesting notification permission:", error);
        });
    }

    socket.on("newMatchDetail", (data) => {
      // console.log("New Match Detail:", data);

      if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(
            "Lebanese Football Association In The North",
            {
              body: `Goal scored by ${data?.playerIn?.name}!`,
              icon: "../../public/logo192.png",
              data: {
                url: `/match/${data?.match}`,
              },
            }
          );
        });
      }
    });

    return () => {
      socket.off("newMatchDetail");
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
