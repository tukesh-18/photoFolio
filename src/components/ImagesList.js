// import components, hooks, toastify, progressbar, firebase
import ImagesForm from "./ImagesForm";
import Carousel from "./Carousel";
import { useEffect, useReducer, useState } from "react";
import { db } from "../firebaseInit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProgressBar } from "react-loader-spinner";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

function ImagesList({ newimageDetails, setNewimageDetails, currentAlbum, setCurrentAlbum }) {
  // use state for handling the toggling of the form, existence of the carousel and loading spinner
  const [showImagesForm, setShowImagesForm] = useState(false);
  const [imgCarousel, setImgCarousel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // use reducer for handling the state of imagesDetail array which contains the image details of new or edited img
  const [imagesDetail, dispatch] = useReducer(reducer, []);

  // reducer func to add or get or update img details 
  function reducer(state, action) {
    const { payload } = action;
    switch (action.type) {
      case "ADD": {
        return [...state, payload.data];
      }
      case "GET": {
        payload.setIsLoading(false);
        return payload.data;
      }
      case "UPDATE":
        return payload.data;
      default:
        return state;
    }
  }

  // use effect to fetch images of selected album on page load 
  useEffect(() => {
    onSnapshot(doc(db, "albums", currentAlbum), (doc) => {
      dispatch({ type: "GET", payload: { data: doc.data() ? doc.data().imagesInfo : [], setIsLoading: setIsLoading } });
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // func to add an img if not already present to the db and the array
  const addImage = (data) => {
    let add = true;
    for (let i = 0; i < imagesDetail.length; i++) {
      if (imagesDetail[i].imgTitle === data.imgTitle) {
        add = false;
        toast.error("Image Already Exists");
        return
      }
    }
    if (add) {
      async function addI() {
        await setDoc(doc(db, "albums", currentAlbum), {
          imagesInfo: [data, ...imagesDetail]
        });
      }
      addI();
      dispatch({ type: "ADD", payload: { data } });
      toast.success("Image Added Successfully");
      setShowImagesForm(!showImagesForm);
    }
  }

  // show the form if not present and set the state with new details for edited img
  const editImage = (img) => {
    if (!showImagesForm) {
      setShowImagesForm(true);
    }
    let data = [...imagesDetail];
    let index = data.indexOf(img);
    setNewimageDetails({ imgData: img, id: currentAlbum, data, index });
  }

  // delete the img user want to be deleted
  const deleteImage = (index) => {
    let data = [...imagesDetail];
    data.splice(index, 1);
    async function deleteI() {
      await updateDoc(doc(db, "albums", currentAlbum), {
        imagesInfo: data
      });
    }
    deleteI();
    toast.success("Image Deleted Successfully !");
  }

  // check if the url entered is active/valid if yes proceed
  const handleError = (data) => {
    let index = imagesDetail.indexOf(data);
    let temp = [...imagesDetail]
    temp.splice(index, 1);
    async function errorI() {
      await updateDoc(doc(db, "albums", currentAlbum), {
        imagesInfo: temp
      });
    }
    errorI();
    toast.error(`${data.imgTitle} image link changes or become invalid`);
  }

  // download the img
  const handleDownload = async (imgTitle, imgUrl) => {
    await fetch(imgUrl, {
      method: "GET",
      headers: {}
    }).then((response) => {
      response.arrayBuffer().then((buffer) => {
        const url = window.URL.createObjectURL(new Blob([buffer]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${imgTitle}.png`);
        document.body.appendChild(link);
        link.click();
      })
    }).catch(() => {
      toast.error("Image has been blocked by CORS policy");
    });
  }

  return (
    <div className="images-list">
      {showImagesForm ?
        <>
          <button className="cancel-btn" type="button" onClick={() => { setShowImagesForm(!showImagesForm); setNewimageDetails(null); }}>Cancel</button>
        </>
        :
        <button className="add-btn" type="button" onClick={() => { setShowImagesForm(!showImagesForm); }}>Add Image</button>
      }
      <div className="header">
        <i className="fa-solid fa-arrow-left" onClick={() => { setCurrentAlbum(null); setNewimageDetails(null) }}></i>
        <h2>Images from {currentAlbum} Album</h2>
      </div>
      {showImagesForm ? (
        <ImagesForm
          addImage={addImage}
          newimageDetails={newimageDetails}
          setNewimageDetails={setNewimageDetails}
          showImagesForm={showImagesForm}
          setShowImagesForm={setShowImagesForm}
        />
      ) : null}
      {isLoading ?
        <ProgressBar
          height="80"
          width="80"
          ariaLabel="progress-bar-loading"
          wrapperClass="progress-bar-wrapper"
          borderColor="grey"
          barColor='dodgerblue'
        />
        :
        imagesDetail.length ?
          <div className="images-container">
            {imagesDetail.map((img, i) => (
              <div className="images-div" key={i}>
                <img src={img.imgUrl} alt={img.imgTitle} onClick={() => setImgCarousel(i)} onError={() => handleError(img)} />
                <h3>{img.imgTitle}</h3>
                <a href={img.imgUrl} className="dwnld-btn" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); handleDownload(img.imgTitle, img.imgUrl); }}>
                  <i className="fa-solid fa-download"></i>
                </a>
                <i className="edit-btn fa-regular fa-pen-to-square" onClick={(e) => { e.stopPropagation(); editImage(img); }}></i>
                <i className="delete-btn fa-regular fa-trash-can" onClick={(e) => { e.stopPropagation(); deleteImage(e, i); }}></i>
              </div>
            ))}
          </div>
          :
          <h2 className="no-image-h2">No Images Found ...</h2>
      }
      {imgCarousel === null ?
        null
        :
        <Carousel
          imagesDetail={imagesDetail}
          i={imgCarousel}
          setImgCarousel={setImgCarousel}
        />
      }
    </div>
  );
}

export default ImagesList;
