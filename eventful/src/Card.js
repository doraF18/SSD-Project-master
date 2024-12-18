import React from 'react';

export default function Card({ image, title, description}) {
  return (
    <div className="card">
      <img src={image} alt="" />
      <div className="card-body">
        <h3>{title}</h3>
        <p>{description}</p>
        <button className="btn btn-dark">Read more</button>
      </div>
    </div>
  );
}
