import * as React from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  GeolocateControl,
  FullscreenControl,
} from "react-map-gl";
import axios from "axios";
import { api_url } from "../utils/API_URL";
import MarkerImg from "../assets/marker.png";
import Location from "./Location";
import { storage } from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

let token = process.env.REACT_APP_MAPBOX_KEY;
const allowedExtensions = ["jpg", "jpeg", "png", "gif"];

function Main() {
  const inputRef = React.useRef();
  const [viewport] = React.useState({
    longitude: 100.6197,
    latitude: 34.0479,
    zoom: 2,
  });
  const [points, setPoints] = React.useState([]);
  const [showPopup, setShowPopup] = React.useState(false);
  const [placename, setPlacename] = React.useState("");
  const [newLocation, setNewLocation] = React.useState();
  const [details, setDetails] = React.useState("");
  const [rating, setRating] = React.useState(0);
  const [selectedPoint, setSelectedPoint] = React.useState(null);
  const [files, setFiles] = React.useState([]);
  const [progresspercent, setProgresspercent] = React.useState(0);
  const [imageUrl, setImageUrl] = React.useState("");
  const [errors, setErrors] = React.useState({});

  const fetchData = async () => {
    try {
      const response = await axios.get(`${api_url}api/location`);
      setPoints(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handlePlace = (point) => {
    setSelectedPoint(point);
    setShowPopup(true);
  };

  const deletePoint = (id) => {
    axios.delete(`${api_url}api/location/${id}`).then((res) => {
      setShowPopup(false);
      fetchData();
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (placename === "") {
      setErrors({ placename: "Placename is required" });
      return;
    }

    console.log(Number(rating) > 5);
    if (rating === 0) {
      setErrors({ rating: "Rating is required" });
      return;
    }

    if (Number(rating) <= 0 || Number(rating) > 5) {
      setErrors({ rating: "Rating must be between 1 and 5" });
      return;
    }

    if (details === "") {
      setErrors({ details: "Details is required" });
      return;
    }

    const formData = new FormData();
    formData.append("name", placename);
    formData.append("description", details);
    formData.append("rating", rating);
    formData.append("lat", newLocation.lat);
    formData.append("lng", newLocation.lng);
    // formData.append("image", files[0]);

    if (files[0]) {
      if (!allowedExtensions.includes(files[0].name.split(".").pop())) {
        setErrors({ files: "File type not allowed" });
        inputRef.current.value = "";
        return;
      }

      const storageRef = ref(storage, `uploads/${files[0].name}`);
      const uploadTask = uploadBytesResumable(storageRef, files[0]);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          console.log(progress);
          setProgresspercent(progress);
        },
        (error) => {
          alert(error);
        },

        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log(downloadURL);
            // setImageUrl(downloadURL);
            formData.append("firebaseImg", downloadURL);

            axios
              .post(`${api_url}api/location`, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then(async (res) => {
                setNewLocation(null);
                await fetchData();
              })
              .catch((err) => {
                if (err.response.data?.uploadError) {
                  setFiles([]);
                  inputRef.current.value = "";
                  setErrors({ files: err.response.data.uploadError });
                }
              });

            setPlacename("");
            setDetails("");
            setRating(0);
            setFiles([]);
            setImageUrl("");
            setProgresspercent(0);
          });
        }
      );
    } else {
      axios
        .post(`${api_url}api/location`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(async (res) => {
          setNewLocation(null);
          await fetchData();
        })
        .catch((err) => {
          if (err.response.data?.uploadError) {
            setFiles([]);
            inputRef.current.value = "";
            setErrors({ files: err.response.data.uploadError });
          }
        });

      setPlacename("");
      setDetails("");
      setRating(0);
      setFiles([]);
      setImageUrl("");
      setProgresspercent(0);
    }
  };

  return (
    <Map
      initialViewState={viewport}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      style={{ width: "100vw", height: "100vh" }}
      onDblClick={(e) => {
        setNewLocation(e.lngLat);
      }}
      mapboxAccessToken={token}
    >
      <NavigationControl />
      <GeolocateControl />
      <FullscreenControl />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          padding: "10px",
          zIndex: 1,
          backgroundColor: "white",
          borderRadius: "5px",
          boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* HEELELELELELEOOOOOOOOo */}
      </div>
      {newLocation && (
        <>
          <Marker
            longitude={newLocation.lng}
            latitude={newLocation.lat}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <img
              src="https://img.icons8.com/emoji/48/000000/round-pushpin-emoji.png"
              alt="marker"
            />
          </Marker>

          <Popup
            longitude={newLocation?.lng}
            latitude={newLocation?.lat}
            closeButton={true}
            closeOnClick={false}
            onClose={() => {
              setNewLocation(null);
            }}
            anchor="left"
          >
            <div className="container" style={{ width: "280px" }}>
              <div className="row">
                <div className="col-12">
                  <h1
                    style={{
                      textAlign: "center",
                      fontSize: "1.5rem",
                    }}
                  >
                    New Place
                  </h1>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="name"
                      placeholder="Place name"
                      value={placename}
                      className={
                        "form-control mt-2 " +
                        (errors.placename && "is-invalid")
                      }
                      onChange={(e) => setPlacename(e.target.value)}
                    />
                    {errors.placename && (
                      <div className="invalid-feedback">{errors.placename}</div>
                    )}
                    <input
                      type="number"
                      placeholder="rating"
                      value={rating}
                      className={
                        "form-control mt-2 " + (errors.rating && "is-invalid")
                      }
                      onChange={(e) => setRating(e.target.value)}
                    />
                    {errors.rating && (
                      <div className="invalid-feedback">{errors.rating}</div>
                    )}

                    <textarea
                      name="details"
                      id=""
                      cols="30"
                      rows="10"
                      value={details}
                      placeholder="Description..."
                      className={
                        "form-control mt-2 " + (errors.details && "is-invalid")
                      }
                      onChange={(e) => setDetails(e.target.value)}
                    ></textarea>

                    {errors.details && (
                      <div className="invalid-feedback">{errors.details}</div>
                    )}

                    <input
                      type="file"
                      name="image"
                      ref={inputRef}
                      className={
                        "form-control mt-2 " + (errors.files && "is-invalid")
                      }
                      onChange={(e) => setFiles(e.target.files)}
                    />

                    {errors.files && (
                      <div className="invalid-feedback">{errors.files}</div>
                    )}

                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${progresspercent}%`,
                        }}
                        aria-valuenow={progresspercent}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>

                    <button className="btn btn-success mt-2" type="submit">
                      submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </Popup>
        </>
      )}
      {showPopup && (
        <Popup
          longitude={selectedPoint?.lng}
          latitude={selectedPoint?.lat}
          closeButton={true}
          closeOnClick={false}
          onClose={() => {
            setShowPopup(false);
            setSelectedPoint(null);
          }}
          style={{ width: "300px" }}
        >
          <Location selectedPoint={selectedPoint} deletePoint={deletePoint} />
        </Popup>
      )}
      {points.map((point, i) => {
        return (
          <Marker
            longitude={point.lng}
            key={i}
            latitude={point.lat}
            anchor="bottom"
          >
            <img
              src={MarkerImg}
              alt="marker"
              style={{ width: "50px", height: "50px" }}
              onClick={() => handlePlace(point)}
            />
          </Marker>
        );
      })}
    </Map>
  );
}

export default Main;
