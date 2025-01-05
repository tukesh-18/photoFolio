// Importing Hooks
import { useState, useReducer, useEffect } from 'react';
// Importing Components
import Navbar from './components/Navbar';
import AlbumsList from './components/AlbumsList';
import ImagesList from './components/ImagesList';
// Importing Firebase
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc
} from "firebase/firestore";
import { db } from "./firebaseInit";
// Importing React-Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  //using reducer to mainting the albums state which contains an array of album names (titles)
  const [albums, dispatch] = useReducer(reducer, { titles: [] });
  //using states for currently selected album, for loading spinner, for new data to upadte new img details
  let [currentAlbum, setCurrentAlbum] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newimageDetails, setNewimageDetails] = useState(null);
  // the reducer function to fetch and add new albums
  function reducer(state, action) {
    let { payload } = action;
    switch (action.type) {
      case "ADD":        
        return { titles: [payload.data, ...state.titles] };
      case "GET":
        payload.setIsLoading(false);
        return { titles: payload.albums };
      default:
        return state;
    }
  }

  // useEffect to fetch existing albums from the firebase db
  useEffect(() => {
    onSnapshot(collection(db, "albums"), (snapshot) => {
      const albums = snapshot.docs.map((doc) => {
        return doc.id;
      });
      dispatch({ type: "GET", payload: { albums, setIsLoading } });
    });
  }, []);

  // function to add album with unique name in the db and the albums array
  const addAlbum = (data) => {
    for (let album of albums.titles) {
      if (data === album) {
        toast.error("Album already Exists");
        return;
      }
    }
    async function setData() {
      await setDoc(doc(db, "albums", data), { imagesInfo: [] });
    }
    setData();
    dispatch({ type: "ADD", payload: { data } });
    toast.success("Album Created successfully.");
  }

  // function to delete album which the user wants to delete
  const deleteAlbum = (data) => {
    async function del() {
      await deleteDoc(doc(db, "albums", data));
    }
    del();
    toast.success("Album Deleted successfully.");
  }

  return (
    <div className='app'>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Navbar />
      {currentAlbum ?
        <ImagesList
          currentAlbum={currentAlbum}
          setCurrentAlbum={setCurrentAlbum}
          newimageDetails={newimageDetails}
          setNewimageDetails={setNewimageDetails}
        />
        :
        <AlbumsList
          setCurrentAlbum={setCurrentAlbum}
          albums={albums.titles}
          isLoading={isLoading}
          addAlbum={addAlbum}
          deleteAlbum={deleteAlbum}
        />}
    </div>
  );
}

export default App;
