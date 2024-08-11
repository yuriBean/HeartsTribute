import React from 'react'

export default function EventRow(props) {
  return (
    <div className='flex flex-col md:flex-row md:justify-start justify-center items-center gap-20 py-5 px-2 md:px-6 border-t-2'>
        <p className='text-3xl md:self-center md:w-[10%]'>{props.date}</p>
        <img src={props.img} className='aspect-square w-64 h-64' loading='lazy' />
        <div className='flex flex-col justify-center md:justify-around'>
          <p className='text-3xl'>{props.name}</p>
          <span className='inline-flex gap-2 text-gray-600 tracking-wider text-lg'><img src="/images/geo.svg" alt="" /> {` `} {props.location}</span>
          <span className='inline-flex gap-2 text-gray-600 tracking-wider text-lg'><img src="/images/watch.svg" alt="" /> {` `} {props.time}</span>
        </div>
    </div>
  )
}
