import React, { useEffect, useState, useRef } from "react";
import Spinner from "../Common/Spinner";
import { usePublicProfile } from "../Providers/PublicProfileProvider";
import CheckProfileOwner from "../CheckProfileOwner";
import { useNavigate } from "react-router-dom";
import { deleteEvent } from "../../services/profileManager.service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function TimelineTab() {
  const { profile, events, getEvents } = usePublicProfile();
  const [loading, setLoading] = useState(false);
  const [isReadMore, setIsReadMore] = useState(false);
  const [sortedEvents, setSortedEvents] = useState([]);
  const navigate = useNavigate();

  const ulRef = useRef(null);
  const lineRef = useRef(null);
  const containerRef = useRef(null);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const handleDeleteEvent = async (eventId) => {

    if(eventId === 'birth' || eventId === 'death')
      {alert('cant'); return;}
    if(window.confirm("Are you sure you want to delete this post? This action cannot be undone.")){
    setLoading(true);
    try {
      await deleteEvent(eventId);
      await getEvents(); // Refresh events after deletion
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setLoading(false);
    }
  }
  };

  useEffect(() => {
    if (ulRef.current && lineRef.current) {
      lineRef.current.style.width = `${ulRef.current.scrollWidth}px`;
    }
  }, [sortedEvents]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!events) {
        setLoading(true);
        await getEvents();
        setLoading(false);
      }
    };

    fetchPosts();
  }, [events.length, getEvents]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      const onWheel = (e) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * 0.5,
          behavior: "instant",
        });
      };
      el.addEventListener("wheel", onWheel);
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, [sortedEvents]);

  useEffect(() => {
    const birthEvent = {
      id: "birth",
      event_name: "Born",
      event_date: profile.birth_date,
      description: `${profile.first_name} ${profile.last_name} was born.`,
      image: profile.profile_picture,
    };
  
    const deathEvent = profile.death_date
      ? {
          id: "death",
          event_name: "Departed",
          event_date: profile.death_date,
          description: `${profile.first_name} ${profile.last_name} passed away.`,
          image: profile.profile_picture,
        }
      : null;
  
    const updatedEvents = events.length > 0 
      ? [birthEvent, ...events, deathEvent].filter(event => event && event.event_date) 
      : [birthEvent, deathEvent].filter(event => event && event.event_date);
  
    updatedEvents.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
  
    setSortedEvents(updatedEvents);
  }, [events, profile]);
  
  return !loading ? (
    <div className="mb-20 space-y-4 rounded-md px-2 py-2">
      <CheckProfileOwner>
        <div className="flex justify-end">
          <button
            onClick={() => navigate(`/edit-profile/${profile.id}/add-event`)}
            className="bg-primary my-2 text-white px-4 py-2 rounded-lg"
          >
            Add Milestone
          </button>
        </div>
      </CheckProfileOwner>
      <div className="flex flex-col justify-center gap-2 items-center">
      <h1 className="text-center text-lg font-bold tracking-widest xl:text-xl">
      {profile.last_name ? (
  `${profile.first_name} ${profile.last_name}'s Life Milestones`
) : (
  `${profile.first_name}'s Life Milestones`
)}
          </h1>
      <small className="text-lg mt-5">
        Tap or hover over the milestones to uncover more
        details and heartfelt memories. Scroll left or right to explore all the significant milestones on the
        timeline.
      </small></div>
      <div
        ref={containerRef}
        className="scrollbar no-scrollbar relative flex h-[600px] w-full items-center justify-between overflow-x-auto bg-white py-16 drop-shadow-lg"
      >
        <div
          ref={lineRef}
          className="absolute bottom-1/2 left-0 h-[0.25rem] min-w-full transform bg-primary"
        ></div>
        <ul ref={ulRef} className="flex w-max space-x-2">
          {sortedEvents.map((event) => (
            <li
              key={event.id}
              className="relative flex w-[360px] flex-col items-center rounded-lg"
            >
              <span className="-z-10 whitespace-pre text-base tracking-widest xl:text-lg">
                {event.event_name}
              </span>
              <br />
              <button className="peer h-12 w-12 cursor-pointer rounded-full bg-primary">
                {profile.death_date === "" ? (
                  <img
                  className="mx-auto h-8 w-8"
                  src={event.event_name === "Born" ? "/images/birth.svg" : event.event_name === "Departed" ? "/images/tombstone.svg" : "/images/calendar.svg"}
                  alt={event.event_name.toLowerCase()}
                />):
                (
                  <img
                  className="mx-auto h-8 w-8"
                  src={event.event_name === "Born" ? "/images/birth.svg": "/images/calendar.svg" }
                  alt={event.event_name.toLowerCase()}
                />
                )}
              </button>
              <br />
              <span className="text-sm tracking-wide overflow-x-hidden transition-all delay-150 xl:text-base">
                {event.event_date}
              </span>
              <div className="z-100 absolute top-0 rounded flex h-[450px] w-full -translate-y-1/2 scale-0 transform flex-col border bg-white p-4 transition delay-300 hover:scale-100 peer-hover:scale-100">
                <div className="flex items-center justify-between">
                  <h1 className="mb-2">{event.event_name}</h1>
                <CheckProfileOwner>
                {event.id !== 'birth' && event.id !== 'death' && (
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-md tracking-wider text-red-500 2xl:text-base my-2"
                >
                  <FontAwesomeIcon icon={faTrash} />
                  </button>)}
                </CheckProfileOwner>
                </div>
                <img
                  src={event.image}
                  className="aspect-ratio rounded-lg"
                  alt=""
                />
                <p
                  className={`text-sm overflow-y-auto scrollbar tracking-wider text-gray-600 2xl:my-4 2xl:text-base ${isReadMore ? "" : "line-clamp-5"} transition-all delay-300`}
                >
                  {event.description}{" "}
                </p>
                {event.description && event.description.length > 100 && (
                  <button
                    onClick={toggleReadMore}
                    className="text-sm tracking-wider text-primary 2xl:text-base"
                  >
                    {isReadMore ? "Read Less" : "Read More"}
                  </button>
                )}

              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <Spinner />
  );
}