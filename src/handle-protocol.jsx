import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function HandleProtocol() {
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const protocolUrl = queryParams.get('url');

    if (protocolUrl) {
      console.log('Protocol URL received:', decodeURIComponent(protocolUrl));
      // Handle the protocol URL here (e.g., navigate to a specific page or take an action)
    }
  }, [location]);

  return (
    <div>
      <h1>Handling Protocol...</h1>
      <p>If you're seeing this, your protocol is being processed.</p>
    </div>
  );
}

export default HandleProtocol;
