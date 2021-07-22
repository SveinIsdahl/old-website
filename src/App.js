//@ts-check

import './App.css';
import './Day.css';
import './Week.css';
import './LoadingAnimation.css';

import firebase from 'firebase/app';
import DatabaseHandler from './databaseHandler';
import Calendar from "./Calendar"
import 'firebase/auth';
import "firebase/database"
import {useAuthState} from 'react-firebase-hooks/auth'
import React from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyD_6EPzd56KtaDCm9k1Od-MorOcuxwMlMI",
  authDomain: "calendar-9d4d6.firebaseapp.com",
  databaseURL: "https://calendar-9d4d6.firebaseio.com",
  projectId: "calendar-9d4d6",
  storageBucket: "calendar-9d4d6.appspot.com",
  messagingSenderId: "103816515999",
  appId: "1:103816515999:web:07a5093add3e224a14adaa"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const databaseHandler = new DatabaseHandler()
const databaseHandlerContext = React.createContext(databaseHandler)
databaseHandler.database = firebase.database();

export default function App() {
  //Creates user and updates after login
  const [user] = useAuthState(auth)
  databaseHandler.user = user;

  return (
    <div className="App">     
      {user ? (
           <databaseHandlerContext.Provider value={databaseHandler}>
            <Calendar />
           </databaseHandlerContext.Provider>
      ): signIn()}
    </div>
  );
}
function signIn() {
  function signInGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
  }
  return(
    <button className="button" onClick={signInGoogle}>Sign in with Google</button>
  )
}
export { databaseHandlerContext} 