importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyD-l1hVbMT1KIWgOJhgXbpxMEnYk4rvNHs",
  authDomain: "new-sababar.firebaseapp.com",
  projectId: "new-sababar",
  storageBucket: "new-sababar.appspot.com",
  messagingSenderId: "440542630269",
  appId: "1:440542630269:web:793898237d5508a56abc14",
  measurementId: "G-L7C5NLRLFX",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
});
