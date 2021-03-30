import React, { useEffect, useState } from 'react';
import moment from 'moment';
import './App.css';

function App() {
  const [stations, setStations] = useState([]);
  const [arrivals, setArrivals] = useState({ N: [], S: [], id: '', name: '' });
  const [input, setInput] = useState('');
  const [searchResult, setSearchResults] = useState([]);
  const [status, setStatus] = useState(false);
  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/jonthornton/MTAPI/master/data/stations.json'
    )
      .then((response) => {
        return response.json();
      })
      .then((body) => {
        const keys = Object.keys(body);
        const newState = keys.map((key) => {
          return body[key];
        });
        setStations(newState);
      });
  }, []);

  const handleClick = (id) => () => {
    fetch('https://api.wheresthefuckingtrain.com/by-id/'.concat(id))
      .then((response) => {
        return response.json();
      })
      .then((body) => {
        let newData = {
          N: body.data[0].N,
          S: body.data[0].S,
          id: body.data[0].id,
          name: body.data[0].name,
        };
        setArrivals(newData);
        setStatus(!status);
      });
  };
  useEffect(() => {
    let isMounted = true;
    const intervalId = setInterval(() => {
      if (arrivals.id !== '') {
        fetch(
          'https://api.wheresthefuckingtrain.com/by-id/'.concat(arrivals.id)
        )
          .then((response) => {
            return response.json();
          })
          .then((body) => {
            let newData = {
              N: body.data[0].N,
              S: body.data[0].S,
              id: body.data[0].id,
              name: body.data[0].name,
            };
            setArrivals(newData);
          });
      }
    }, 30000);

    return () => {
      clearInterval(intervalId);
      isMounted = false;
    };
  });

  const handleInputOnchange = (event) => {
    setInput(event.target.value);
  };

  useEffect(() => {
    const results =
      input === ''
        ? stations
        : stations.filter((station) =>
            station.name.toLowerCase().includes(input)
          );
    setSearchResults(results);
  }, [input, stations]);

  const stationsList = searchResult.map((station) => {
    return (
      <div>
        <li onClick={handleClick(station.id)}>{station.name}</li>
        {arrivals.id === station.id && status === true ? (
          <div className="times">
            <div className="time">
              <p>Uptown:</p>
              {arrivals.N.map((arr) => {
                return (
                  <div className="mins">
                    <img
                      src={'./svg/'.concat(arr.route).concat('.svg')}
                      style={{ height: 40 }}
                    />
                    <div className="min">{moment(arr.time).fromNow()}</div>
                  </div>
                );
              })}
            </div>
            <div className="time">
              <p>Downtown:</p>
              {arrivals.S.map((arr) => {
                return (
                  <div className="mins">
                    <img
                      src={'./svg/'.concat(arr.route).concat('.svg')}
                      style={{ height: 40 }}
                    />
                    <div className="min">{moment(arr.time).fromNow()}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    );
  });
  return (
    <div>
      <h1>NYC Subway Arrival Times</h1>
      <div className="inputs">
        <img src={'./svg/search.png'} />
        <input
          type="text"
          placeholder="Search"
          value={input}
          onChange={handleInputOnchange}
          className="input"
        ></input>
      </div>
      <ul className="stationList">{stationsList}</ul>
    </div>
  );
}

export default App;
