import fetch from 'node-fetch';

// Utils
import HttpError from './HttpError.js';
// Types
import eStatusCode from '../types/eStatusCode.js';

type tGeoCodingData = {
  results: [
    {
      geometry: {
        location: {
          lat: number;
          lng: number;
        };
      };
    }
  ];
  status: string;
};

///////////////////////////////////////////////////////////////////
const getCoordsForAddress = async (
  address: string
): Promise<[lng: number, lat: number]> => {
  // (1) converting address string to url format
  const convertedAddress = encodeURIComponent(address);

  // (2) use Google Geocoding API
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${convertedAddress}&key=${process.env.GOOGLE_API_KEY}`
  );
  const data = (await res.json()) as tGeoCodingData;

  // (3-a) if error send response to client
  if (!data || data.status !== 'OK')
    throw new HttpError(
      eStatusCode['bad request'],
      'Could not found location for the specified address.'
    );

  // (3-b) otherwise return data
  const { lat, lng } = data.results[0].geometry.location;

  return [lng, lat]; // in mongodb coordinate's format is [lng, lat]
};

export default getCoordsForAddress;
