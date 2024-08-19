import React from 'react';
import { deleteEvent } from "../../services/profileManager.service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function EventRow({ id, date, img, name, location, time, onDelete }) {

  
  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(id); // Call the service to delete the event
      onDelete(); // Trigger the onDelete callback to refresh the events list
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };


  return (
    <div className='flex flex-col md:flex-row md:justify-start justify-center items-center gap-20 py-5 px-2 md:px-6 border-t-2'>
      <p className='text-3xl md:self-center md:w-[10%]'>{date}</p>
      <img src={img} className='aspect-square w-64 h-64' loading='lazy' alt={name} />
      <div className='flex flex-col justify-center md:justify-around'>
        <p className='text-3xl'>{name}</p>
        <span className='inline-flex gap-2 text-gray-600 tracking-wider text-lg'>
          <img src="/images/geo.svg" alt="" /> {location}
        </span>
        <span className='inline-flex gap-2 text-gray-600 tracking-wider text-lg'>
          <img src="/images/watch.svg" alt="" /> {time}
        </span>
        <button
          onClick={handleDeleteEvent}
          className="text-md tracking-wider text-red-500 2xl:text-base mt-2 text-right"
        >
           <FontAwesomeIcon icon={faTrash} />
           </button>
      </div>
    </div>
  );
}
