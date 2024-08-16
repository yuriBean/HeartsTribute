import React from 'react';
import { deleteEvent } from "../../services/profileManager.service"; // Import deleteEvent

export default function EventRow(props) {
  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(props.id);
      props.onDelete(); // Call the onDelete prop to refresh the events list
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className='flex flex-col md:flex-row md:justify-start justify-center items-center gap-20 py-5 px-2 md:px-6 border-t-2'>
        <p className='text-3xl md:self-center md:w-[10%]'>{props.date}</p>
        <img src={props.img} className='aspect-square w-64 h-64' loading='lazy' />
        <div className='flex flex-col justify-center md:justify-around'>
          <p className='text-3xl'>{props.name}</p>
          <span className='inline-flex gap-2 text-gray-600 tracking-wider text-lg'><img src="/images/geo.svg" alt="" /> {` `} {props.location}</span>
          <span className='inline-flex gap-2 text-gray-600 tracking-wider text-lg'><img src="/images/watch.svg" alt="" /> {` `} {props.time}</span>
          <button
            onClick={handleDeleteEvent}
            className="text-sm tracking-wider text-red-500 2xl:text-base mt-2"
          >
            Delete Event
          </button>
        </div>
    </div>
  )
}