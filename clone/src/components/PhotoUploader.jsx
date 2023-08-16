import axios from "axios";
import { useState } from "react";


function PhotoUploader({addedPhotos, onChange}) {
    const [photoLink, setPhotoLink] = useState('')



    async function addPhotoByLink(e) {
        e.preventDefault();
        const {data:filename} = await axios.post('/uploadLink', {link: photoLink})
        onChange(prev => {
          return [...prev, filename];
        })
        setPhotoLink('');
      }

      function uploadPhoto(e) {
        const files = e.target.files;
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
          data.append('photos', files[i]);
        }
        axios.post('/upload', data, {
          headers: {'Content-type':'multipart/form-data'}
        }).then(response => {
          const {data:filenames} = response;
          onChange(prev => {
            return [...prev, ...filenames];
          })
        })
      }
  return (
    <>
         <div className="flex gap-1">
                <input type="text" value={photoLink} onChange={e=> setPhotoLink(e.target.value)} placeholder={"add photo using a link ...jpg"}/>
                <button className="bg-gray-200 px-4 whitespace-nowrap font-semibold rounded-2xl" onClick={addPhotoByLink}>Add Photo</button>
            </div>
            <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {addedPhotos.length > 0 && addedPhotos.map(link=> (
              <div key={link} className="h-32 flex ">
                <img className="rounded-2xl object-cover w-full " src={'http://localhost:4000/uploads/'+link} alt="i"/>
              </div>
            ) )}
                <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent font-medium p-2 rounded-2xl text-2xl text-gray-600">
                <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
</svg>
Upload</label>
            </div>
    </>
  )
}

export default PhotoUploader