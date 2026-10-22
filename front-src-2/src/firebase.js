// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-l1hVbMT1KIWgOJhgXbpxMEnYk4rvNHs",
  authDomain: "new-sababar.firebaseapp.com",
  projectId: "new-sababar",
  storageBucket: "new-sababar.appspot.com",
  messagingSenderId: "440542630269",
  appId: "1:440542630269:web:793898237d5508a56abc14",
  measurementId: "G-L7C5NLRLFX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const messaging = getMessaging(app);
export const fetchToken = (setTokenFound) => {
  return getToken(messaging, {
    vapidKey:
      "BPCPs2QxlngGu-cZAIKvXOuHpKsAmrE0ZRKYzJkFHuReilszaBPWutslUpsTUPCFVzEP_MBai2WjB5afTNxXouc",
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log("current token for client: ", currentToken);
        setTokenFound(true);
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
        setTokenFound(false);
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // catch error while creating client token
    });
};

// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       resolve(payload);
//     });
//   });
