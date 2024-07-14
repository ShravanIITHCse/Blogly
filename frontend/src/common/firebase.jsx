import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCccS-HYfK4Im9jKFqds7xit4bEfmWvt-w",
  authDomain: "blogly-2db1a.firebaseapp.com",
  projectId: "blogly-2db1a",
  storageBucket: "blogly-2db1a.appspot.com",
  messagingSenderId: "953450042654",
  appId: "1:953450042654:web:100e02cbb7a8abe193250f",
  measurementId: "G-HV2TDMKZ2M"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
    let user = null;

    await signInWithPopup(auth, provider)
        .then((result) => {
            user = result.user;
        })
        .catch((error) => {
            console.log(error);
        });

    return user;
}

