import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <div className="bg-black px-10 py-8 lg:px-16">
      <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
        <div className=" flex items-center gap-2 text-white lg:w-1/2">
          <img src="/hearts-favicon.png" className="h-12 object-cover" alt="" />
          {/* <p className="my-1 text-xl">
            Honor your loved ones by sharing their unique stories, preserving
            their legacy and keeping their memories alive for generations to
            come.
          </p> */} 
          <p>Hearts Tribute</p>
        </div>
        <div className="inline space-x-4">
          <a
            href="https://www.heartstribute.com/product/tribute-tag/"
            target="_blank"
            className="rounded bg-[#346164] px-4 py-2 text-base hover:bg-[#B0CF33] lg:px-8"
          >
            Shop Now
          </a>
        </div>
      </div>
      <div className="my-5 h-[1px] w-full bg-gray-700"></div>
      <div className="flex justify-between text-sm text-white">
      <p>&copy; 2024 Hearts Tribute. All rights reserved</p>
        <span className="flex gap-x-6 mx-2 justify-center items-center">
          <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/heartstribute/">
            <FontAwesomeIcon icon={faInstagram} className="text-lg" />
          </a>
          <a target="_blank" rel="noopener noreferrer" href="https://www.tiktok.com/@hearts.tribute">
            <FontAwesomeIcon icon={faTiktok} className=" text-lg " />
          </a>
          <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/@HeartsTribute">
            <FontAwesomeIcon icon={faYoutube} className=" text-lg" />
          </a>
        </span>
      </div>
    </div>
  );
}
