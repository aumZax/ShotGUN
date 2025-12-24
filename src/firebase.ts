import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAzhVHeRPpdKjaI8ApVDpUpDhGNEtONGZ8",
  authDomain: "shotgrid-promax.firebaseapp.com",
  projectId: "shotgrid-promax",
  storageBucket: "shotgrid-promax.firebasestorage.app",
  messagingSenderId: "915319524276",
  appId: "1:915319524276:web:b20ecb643fb3aa5a6d80e1",
  measurementId: "G-9EQWB4H5WP"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export { ref, uploadBytes, getDownloadURL, listAll };