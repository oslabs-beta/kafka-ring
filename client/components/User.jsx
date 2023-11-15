import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  setAddCluster,
  setClusters,
  setCurrentCluster,
} from '../reducers/dashReducer.js';

const User = () => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.login.username);
  const clusters = useSelector((state) => state.dashboard.clusters);
  const adding = useSelector((state) => state.dashboard.addingCluster);
  const [isValid, setIsValid] = useState(false);
  // useEffect(() => {
  //   const clusterFetch = async () => {
  //     const response = await fetch(`/users/service-address${username}`);
  //     if (response.status === 200) {
  //       const savedPorts = await response.json();
  //       dispatch(setClusters(savedPorts));
  //     }
  //   };
  //   clusterFetch();
  // }, []);

  //handleFromSubmit function is used to send a patch request to the backend for when a user adds a new port for viewing
  const handleFromSubmit = async (e) => {
    e.preventDefault();
    const service_addresses = e.target.portNum.value;
    try {
      const response = await fetch(
        `/users/update-service-addresses/${username}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            service_addresses,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        dispatch(setAddCluster(false));
        dispatch(setClusters([...clusters, service_addresses]));
      }
    } catch (err) {
      console.error('Error during port addition: ', err);
    }
  };

  //Loop through clusters array and render any existing ports to the page
  const clusterButtons = [];
  if (Array.isArray(clusters)) {
    clusters.forEach((cluster, idx) => {
      clusterButtons.push(
        <React.Fragment key={cluster}>
          <br />
          <button
            className='savedClusterBtn'
            onClick={() => dispatch(setCurrentCluster(cluster))}
          >
            Port {cluster}
          </button>
        </React.Fragment>
      );
    });
  }
  //On input change, update setIsValid to check if the port input matches the allowed format
  const handleInputChange = (e) => {
    setIsValid(formatIsCorrect(e.target.value));
  };

  //Checks the adding cluster input form and only enables the 'add' button until the input form matches our allowed configuration.
  function formatIsCorrect(e) {
    let ip, port;
    [ip, port] = e.split(':');
    let validIP = false,
      validPort = false;

    if (ip === 'localhost') {
      validIP = true;
    } else if (
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ip
      )
    ) {
      validIP = true;
    }

    if (port && port.length === 4 && /[0-9]/.test(port)) {
      validPort = true;
    }
    return validIP && validPort;
  }
  //Render the User section of the dashboard
  return (
    <>
      <div id='clusterUserName'>{`${username} Clusters`}</div>
      {!adding && (
        <button id='addCluster' onClick={() => dispatch(setAddCluster(true))}>
          Add a Cluster
        </button>
      )}
      {adding && (
        <form className='addPortForm' onSubmit={handleFromSubmit}>
          <hr />
          <label>Port Number:</label>
          <input
            type='text'
            name='portNum'
            className='port'
            placeholder='localhost:port or IP address'
            autoComplete='off'
            onChange={handleInputChange}
          />
          <br />
          <button
            id='add-port'
            className='button1'
            type='submit'
            disabled={!isValid}
          >
            Add
          </button>
          <button
            id='cancel-port'
            onClick={() => dispatch(setAddCluster(false))}
          >
            Cancel
          </button>
        </form>
      )}
      {clusterButtons}
    </>
  );
};

export default User;
