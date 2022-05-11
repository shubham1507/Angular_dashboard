importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

var config = {
  apiKey: "AIzaSyDogE1lUlmWam0tqLqI5RMkFUYWiuhnHQA",
  authDomain: "physical-security-manager.firebaseapp.com",
  databaseURL: "https://physical-security-manager.firebaseio.com",
  projectId: "physical-security-manager",
  storageBucket: "physical-security-manager.appspot.com",
  messagingSenderId: "495197375055"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();

if ('serviceWorker' in navigator) {

  navigator.serviceWorker.register('./firebase-messaging-sw.js')
    .then(registration => {

      messaging.useServiceWorker(registration)

    })
    .catch(err => console.log('Problem in initialising the service worker', err))
}
else {
  console.log('Push notifications not supported ');
}
