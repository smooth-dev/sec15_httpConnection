import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import ErrorPage from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

const places = localStorage.getItem('places');
export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching,setIsFetching] = useState(false);
  const [availablePlaces,setAvailablePlaces] =  useState([]);
  const [error,setError] = useState();

useEffect(()=>
  {
    async function fetchPlaces(){

      setIsFetching(true);

      try{
      const places = await fetchAvailablePlaces();
   
         navigator.geolocation.getCurrentPosition((position)=>{

          const sortedPlaces =  sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          )
         setAvailablePlaces(sortedPlaces);

         })


         setIsFetching(false);


        }
      catch (error){
        setError({message: error.message || "Could not fetch places, please try again later"});
        setIsFetching(false);

      }
    }

    fetchPlaces();

  }

,[]);

if(error){
  return <ErrorPage title="An error occured" message={error.message}/>
}

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      fallbackText="No places available."
      isLoading={isFetching}
      loadingText={"Fetching places !"}
      onSelectPlace={onSelectPlace}
    />
  );
}
