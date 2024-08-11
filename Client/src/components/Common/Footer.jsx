import React from "react";

export default function Footer() {
  return (
    <div className="bg-black px-10 py-10 lg:px-16">
      <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
        <div className="text-white lg:w-1/2">
          <img src="/images/colorfilter.svg" alt="" />
          <p className="my-2 text-xl">
            Honor your loved ones by sharing their unique stories, preserving
            their legacy and keeping their memories alive for generations to
            come.
          </p>
          <p>Hearts Tribute</p>
        </div>
        <div className="inline space-x-4">
          <a
            href="/"
            target="_blank"
            className="rounded bg-[#346164] px-4 py-2 text-base hover:bg-[#B0CF33] lg:px-8"
          >
            Shop Now
          </a>
        </div>
      </div>
      <div className="my-10 h-[1px] w-full bg-gray-700"></div>
      <div className="flex justify-between text-sm text-white">
        <p>&copy; 2024 Hearts Tribute. All rights reserved</p>

        <span className="flex gap-x-8">
          <a target="_blank" href="https://www.instagram.com/heartstribute/">
            <img className="h-6 w-6 md:h-8 md:w-8" src="/images/instagram.png" alt="" />
          </a>
          <a target="_blank" href="https://www.tiktok.com/@hearts.tribute">
            <img
              className="h-6 w-6 bg-transparent md:h-8 md:w-8"
              src="/images/tiktok.png"
              alt=""
            />
          </a>
          <a target="_blank" href="https://www.youtube.com/@HeartsTribute">
            <img className="h-6 w-6 md:h-8 md:w-8" src="/images/youtube.png" alt="" />
          </a>
        </span>
      </div>
    </div>
  );
}
