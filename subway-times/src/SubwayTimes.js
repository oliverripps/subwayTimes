import React, { useEffect, useState } from 'react';
import MTA from './images/MTA.jpeg';
import moment from 'moment';
import './SubwayTimes.css';
import AppBar from '@material-ui/core/AppBar';
import Link from '@material-ui/core/Link';
import SearchIcon from '@material-ui/icons/Search';
import OneTrain from './images/1.svg';

function SubwayTimes() {
  const [stations, setStations] = useState([]);
  const [stationTrains, setStationTrains] = useState([]);
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
        console.log(body);
        const keys = Object.keys(body);
        const newStations = keys
          .map((key) => {
            return body[key];
          })
          .sort((a, b) => (a.name > b.name ? 1 : -1));
        setStations(newStations);
      });
  }, []);
  /*  const getTrainsFromStation = (stations) => {
       stations.map((station) => {
        fetch('https://api.wheresthefuckingtrain.com/by-id/'.concat(id))
        .then((response) => {
          return response.json();
        })
        .then((body) => {
            return [stations, body.data[0].N]
      }))
  }; */
  const handleClick = (id) => () => {
    fetch('https://api.wheresthefuckingtrain.com/by-id/'.concat(id))
      .then((response) => {
        return response.json();
      })
      .then((body) => {
        console.log(body.data[0]);
        let currentData = {
          N: body.data[0].N,
          S: body.data[0].S,
          id: body.data[0].id,
          name: body.data[0].name,
        };
        setArrivals(currentData);
        setStatus(!status);
      });
  };

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
                      src={'./images/'.concat(arr.route).concat('.svg')}
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
                      src={'./images/'.concat(arr.route).concat('.svg')}
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
      <AppBar position="static">
        <div className="inputs">
          <img src={MTA} />
          <input
            type="text"
            placeholder="Search For Stations"
            value={input}
            onChange={handleInputOnchange}
            className="input"
          ></input>
        </div>
      </AppBar>
      <ul className="stationList">{stationsList}</ul>
    </div>
  );
}

export default SubwayTimes;
