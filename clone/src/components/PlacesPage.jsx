import { Link, useNavigate, useParams } from "react-router-dom"
import Perks from "./Perks";
import { useState } from "react";

import PhotoUploader from "./PhotoUploader";
import axios from "axios";


function PlacesPage() {
    const history = useNavigate();
    const {action} = useParams();
    const [title,setTitle] = useState('');
    const [address,setAddress] = useState('');
    const [addedPhotos,setAddedPhotos] = useState([]);

    const [description,setDescription] = useState('');
    const [perks,setPerks] = useState([]);
    const [extraInfo,setExtraInfo] = useState('');
    const [checkIn,setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState('');
    const [maxGuests,setMaxGuests] = useState(1);
    
    
    function inputHeader(text) {
        return (
          <h2 className="text-2xl mt-4">{text}</h2>
        );
      }
      function inputDescription(text) {
        return (
          <p className="text-gray-500 text-sm">{text}</p>
        );
      }
      function preInput(header,description) {
        return (
          <>
            {inputHeader(header)}
            {inputDescription(description)}
          </>
        );
      }
      async function handleSubmit(e) {
          e.preventDefault();
           await axios.post('/places', {
            title, address, addedPhotos,
            description, perks, extraInfo, 
            checkIn, checkOut, maxGuests
          });
          history('/account/places');

      }

  return (
    <div>

    {action !== 'new' && (
        <div className="text-center">
          <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            Add new place
          </Link>
        </div>
    )}
    {action === 'new' &&(
        <div className="">
        <form onSubmit={handleSubmit}>
        {preInput('Title', 'Title for your place. should be short and catchy as in advertisement')}
            <input type="text" placeholder="title, for example: My Lovely Home" value={title} onChange={e => setTitle(e.target.value) }/>
            {preInput('Address', 'Address to this place')}
            <input type="text" value={address} onChange={e=> setAddress(e.target.value)} placeholder="address" className=""/>
            {preInput('Photos','more = better')}
              {/* upload photos */}
              <PhotoUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
            {preInput('Description','description of the place')}
            <textarea value={description} onChange={e=> setDescription(e.target.value)} />

            {/* perks */}
            {preInput('Perks','select all the perks of your place')}
                <Perks selected={perks} onChange={setPerks} />
            {preInput('Extra info','house rules, etc')}
            <textarea value={extraInfo} onChange={e=> setExtraInfo(e.target.value)} />
            {preInput('Check in&out times','add check in and out times, remember to have some time window for cleaning the room between guests')}
            <div className="grid gap-2 sm:grid-cols-3">
                <div>
                <h3 className="mt-2 -mb-1">Check-in Time</h3>
                    <input type="text" value={checkIn} onChange={e=>setCheckIn(e.target.value)} placeholder="14:00"/>
                </div>
                <div>
                <h3 className="mt-2 -mb-1">Check-out Time</h3>
                    <input type="text" value={checkOut} onChange={e=>setCheckOut(e.target.value)} placeholder="9:00"/>
                </div>
                <div>
                <h3 className="mt-2 -mb-1">Max Guest</h3>
                    <input type="number" value={maxGuests} onChange={e=>setMaxGuests(e.target.value)} placeholder="ex.2"/>
                </div>
            </div>
            <div className="w-full flex justify-center">
            <button className="primary mt-4 mx-auto lg:max-w-2xl">Save</button>
            </div>
        </form>

        </div>
    )}
     
    
    PlacesPage</div>
  )
}

export default PlacesPage