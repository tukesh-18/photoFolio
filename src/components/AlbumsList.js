// importing  hook, component and progress bar loader-spinner
import { useState } from "react";
import { ProgressBar } from "react-loader-spinner"
import AlbumsForm from "../components/AlbumsForm";

function AlbumsList({ albums, setCurrentAlbum, isLoading, addAlbum, deleteAlbum }) {
  //use state for toggling the form on this page
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  return (
    <div className="albums-list">
      <h2>Your Albums</h2>
      {showAlbumForm ?
        <>
          < AlbumsForm addAlbum={addAlbum} showAlbumForm={showAlbumForm} setShowAlbumForm={setShowAlbumForm}/>
          <button className="cancel-btn" type="button" onClick={() => setShowAlbumForm(!showAlbumForm)}>Cancel</button>
        </>
      :
        <button className="add-btn" type="button" onClick={() => setShowAlbumForm(!showAlbumForm)}>Add Album</button>
      }
      {isLoading ?
        <ProgressBar
        height="150"
        width="150"
        ariaLabel="progress-bar-loading"
        wrapperClass="progress-bar-wrapper"
        borderColor = "grey"
        barColor = 'dodgerblue'
        />
      : albums.length ? 
        <div className="albums-container">
          {albums.map((album, i) => {
            return (
              <div className="albums-div" key={i} onClick={() => setCurrentAlbum(album)}>
                <i className="albums-icon fa-regular fa-images"></i>
                <h3>{album}</h3>
                <i className="delete-icon fa-regular fa-trash-can" onClick={(e) => {e.stopPropagation(); deleteAlbum(album);}}></i>
              </div>
            )
          })}
        </div>
        :
        <h2 className="no-album-h2">No Albums Present, Please Add One !</h2>
      }
    </div>
  );
}

export default AlbumsList;
