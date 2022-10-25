import React from "react";
import { api_url } from "../utils/API_URL";

const Location = ({ selectedPoint, deletePoint }) => {
  return (
    <div className="card mt-3">
      {selectedPoint.image.length > 0 && (
        <img
          className="card-img-top"
          src={api_url + selectedPoint?.image}
          alt="place"
          style={{ height: "200px", objectFit: "cover" }}
        />
      )}
      <div className="card-body">
        <h5 className="card-title">{selectedPoint?.name}</h5>
        <p className="card-text">{selectedPoint?.description}</p>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Latitude: {selectedPoint?.lat}</li>
          <li className="list-group-item">Longitude: {selectedPoint?.lng}</li>
          <li className="list-group-item">Rating: {selectedPoint?.rating}</li>
        </ul>
        <button
          className="btn btn-danger mt-2"
          onClick={() => deletePoint(selectedPoint._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Location;
