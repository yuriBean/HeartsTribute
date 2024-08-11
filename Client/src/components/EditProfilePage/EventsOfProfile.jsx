import { useEffect, useState } from "react"
import EventRow from "../Profile/EventRow"
import { getEventsByProfileId } from "../../services/profileManager.service"
import { useParams } from "react-router-dom"
import Spinner from "../Common/Spinner"
import { useProfile } from "../Providers/EditProfileProvider"

export default function EventsOfProfile() {
  const [loading] = useState(false);
  const { events , getEvents } = useProfile();

  useEffect(() => {
    
  }, [])

  return (!loading) ? (

    <div className='space-y-4 px-2 py-10 mb-20'>
      <p className='font-medium pb-8'>{events.length > 0 ? ((events.length == 1) ? `${events.length} Event` : `${events.length} Events`) : "No Events"} </p>
      {events.length > 0 ? (
        events.map(event => (
          <EventRow key={event.id} date={event.event_date} img={event.image} name={event.event_name} location={event.event_location} time={event.event_time} />
        ))) :
        (
          <div className='space-y-4 py-36 px-10 flex flex-col items-center justify-center '>
            <img className='w-32' src="/images/stopwatch.svg" alt="" />
            <h3 className='text-2xl text-gray-800 tracking-wider'>No timeline events found</h3>
            <p className='text-xl text-gray-800 tracking-wide'>No events have been added yet in Robert T. Hawke's timeline.</p>
          </div>
        )
      }
    </div>
  ) :
    <Spinner />


}
