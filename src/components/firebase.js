import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDwv6Zg52rn27yloj5B8j7pgtRPiu41kK0",
    authDomain: "basit-b2712.firebaseapp.com",
    databaseURL: "https://basit-b2712-default-rtdb.firebaseio.com",
    projectId: "basit-b2712",
    storageBucket: "basit-b2712.appspot.com",
    messagingSenderId: "1057276886106",
    appId: "1:1057276886106:web:bd3daa3e7614888da8ac63",
    measurementId: "G-9XSGK47K4S"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
