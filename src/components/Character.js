import React, { useState, useEffect } from "react";
import MD5 from "crypto-js/md5";
import './Character.css';

export const Character = () => {
  const [characters, setCharacters] = useState([]);
  const estilo = {
    width: "14rem",
  };
  useEffect(() => {
    if (!navigator.onLine) {
      if (localStorage.getItem("characters") === null) {
        setCharacters("Loading...");
      } else {
        setCharacters(JSON.parse(localStorage.getItem("characters")));
      }
    } else {
      const URL = "https://gateway.marvel.com/v1/public/characters?";
      const PUBLIC_KEY = "06d50df314ea3d7fe43ecb3743c5da5d";
      const PRIVATE_KEY = "81dc3d0ac2897c24675cc15754b0f25c6925c15c";
      const ts = Date.now();
      const hashmd5 = MD5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();
      fetch(
        URL +
          new URLSearchParams({
            ts,
            apikey: PUBLIC_KEY,
            hash: hashmd5,
          }),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          setCharacters(res.data.results);
          localStorage.setItem("characters", JSON.stringify(res.data.results));
        });
    }
  }, []);

  console.log(characters);

  return (
    <>
      <h1>Marvel Characters</h1>
      <div className="gallery-container">
        {characters.map((elm, index) => (
          <div className="card m-3" style={estilo}>
            <img className="card-img-top" src={elm.thumbnail.path +'/standard_fantastic.'+ elm.thumbnail.extension} alt={elm.name}/>
            <div className="card-body">
              <h5 className="card-title">{elm.name}</h5>
              <p>{elm.description}</p>
              <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
