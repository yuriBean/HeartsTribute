import { useEffect, useState } from "react";
import EventRow from "../Profile/EventRow";
import Spinner from "../Common/Spinner";

export default function EventsOfProfile() {
  const [loading, setLoading] = useState(true);
  const { events, getEvents } = useProfile();

  useEffect(() => {
    const fetchEvents = async () => {
      await getEvents();
      setLoading(false);
    };
    fetchEvents();
  }, [getEvents]);

  const handleDelete = async (id) => {
    // Filter out the deleted event locally
    setLoading(true);
    await getEvents();  // Fetch the updated events after deletion
    setLoading(false);
  };


  return (
    !loading ? (
      <div className='space-y-4 px-2 py-10 mb-20'>
        <p className='font-medium pb-8'>
          {events.length > 0 ? 
            `${events.length} ${events.length === 1 ? "Event" : "Events"}` : 
            "No Events"}
        </p>
        {events.length > 0 ? (
          events.map(event => (
            <EventRow
              key={event.id}
              id={event.id}
              date={event.event_date}
              img={event.image}
              name={event.event_name}
              location={event.event_location}
              time={event.event_time}
              onDelete={() => handleDelete(event.id)}
            />
          ))
        ) : (
          <div className='space-y-4 py-36 px-10 flex flex-col items-center justify-center'>
            <img className='w-32' src="/images/stopwatch.svg" alt="No Events" />
            <h3 className='text-2xl text-gray-800 tracking-wider'>No timeline events found</h3>
            <p className='text-xl text-gray-800 tracking-wide'>
              No events have been added yet in Robert T. Hawke's timeline.
            </p>
          </div>
        )}
      </div>
    ) : (
      <Spinner />
    )
  );
}
