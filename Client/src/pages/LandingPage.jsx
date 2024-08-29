import React, { useState } from "react";
import ScrollAnimation from "react-animate-on-scroll";
import Layout from "../components/Layout/Layout";


export default function LandingPage() {
  const [open, setOpen] = useState(false);  

  const moreInfo1 = () => {
    if (document.getElementById("p1").classList.contains("line-clamp-6")) {
      document.getElementById("p1").classList.remove("line-clamp-6");
      document.getElementById("b1").innerText = "View less";
    } else {
      document.getElementById("p1").classList.add("line-clamp-6");
      document.getElementById("b1").innerText = "View more";
    }
  };
  const moreInfo2 = () => {
    if (document.getElementById("p2").classList.contains("line-clamp-6")) {
      document.getElementById("p2").classList.remove("line-clamp-6");
      document.getElementById("b2").innerText = "View less";
    } else {
      document.getElementById("p2").classList.add("line-clamp-6");
      document.getElementById("b2").innerText = "View more";
    }
  };
  const moreInfo3 = () => {
    if (document.getElementById("p3").classList.contains("line-clamp-6")) {
      document.getElementById("p3").classList.remove("line-clamp-6");
      document.getElementById("b3").innerText = "View less";
    } else {
      document.getElementById("p3").classList.add("line-clamp-6");
      document.getElementById("b3").innerText = "View more";
    }
  };

  return (
    <>
      <Layout>
        <div className={`${open ? "fixed" : "relative"}`}>
          {/* Hero Section */}
          <div className="flex justify-between py-8 lg:py-0 bg-[#FAFAFA]">
            <div className="self-center px-10 lg:px-16">
              <p className="text-4xl lg:text-5xl my-2">Forever</p>
              <p className="text-4xl lg:text-5xl font-bold my-2">Remembered,</p>
              <p className="text-4xl lg:text-5xl my-2">Forever Cherished</p>
              <p className="my-6 mx-2 lg:w-[40vw] text-gray-600">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Deserunt ab voluptatibus magnam possimus voluptatem vitae ut,
                saepe eaque dicta, molestiae soluta
              </p>
              <button className="bg-[#346164] hover:bg-[#B0CF33] flex items-center text-white px-6 py-2  rounded-lg gap-2">
                <img className="w-5" src="/images/star.svg" alt="" />{" "}
                <p>Check Reviews</p>
              </button>
            </div>
            <div>
              <img className="hidden md:block" src="/images/hero.png" alt="" />
            </div>
          </div>

          {/* Steps Section */}
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between px-10 lg:px-16 py-20">
            <div className="lg:w-[40vw] self-center">
              <h1 className="text-5xl px-0 lg:px-4 mb-16">
                Keep Memories Alive in{" "}
                <strong className="text-[#346164]">3 Easy Steps</strong>
              </h1>
              <p className="px-0 lg:px-4 text-lg text-gray-600">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Consectetur voluptatum consequatur quia reprehenderit, pariatur
                reiciendis provident eius eum voluptates esse ab aliqua.
              </p>
            </div>
            <div className="lg:w-[40vw] flex flex-col gap-14">
              <ScrollAnimation animateIn="fadeIn">
                <div className="flex justify-between">
                  <div className="">
                    <h1 className="text-2xl font-semibold">Step 1</h1>
                    <p className="text-gray-600 w-32">
                      Buy your loved one's a Tribute Tag.
                    </p>
                  </div>
                  <div className="bg-[#346164] p-8 flex items-center justify-center rounded-full">
                    <img src="/images/cart.svg" alt="" />
                  </div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation animateIn="fadeIn">
                <div className="flex justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold">Step 1</h1>
                    <p className="text-gray-600 w-32">
                      Buy your loved one's a Tribute Tag.
                    </p>
                  </div>
                  <div className="bg-[#346164] p-8 flex items-center justify-center rounded-full">
                    <img src="/images/user.svg" alt="" />
                  </div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation animateIn="fadeIn">
                <div className="flex justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold">Step 1</h1>
                    <p className="text-gray-600 w-32">
                      Buy your loved one's a Tribute Tag.
                    </p>
                  </div>
                  <div className="bg-[#346164] p-8 flex items-center justify-center rounded-full">
                    <img src="/images/resume.svg" alt="" />
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>

          {/* Stories Section */}
          <div className="text-center px-10 lg:px-16 py-20 bg-[#FAFAFA]">
            <h1 className="text-5xl my-4">
              Share <strong className="text-[#346164]">their Stories</strong>
            </h1>
            <p className="text-xl text-gray-600">
              Explore their lives and keep their memories alive forever.{" "}
            </p>
            <div className="flex flex-col items-center lg:items-start lg:flex-row gap-4 my-12 justify-evenly">
              <ScrollAnimation animateIn="fadeInLeft">
                <div className="bg-white rounded-md w-[20rem] px-8 py-4 border">
                  <img className="mx-auto" src="/images/feedback.png" alt="" />
                  <a
                    className="underline text-[#346164] text-xl font-medium mt-2"
                    href="#"
                  >
                    Michael
                  </a>
                  <p id="p1" className="text-left my-4 line-clamp-6">
                    essa was born in Peoria, IL on March 20, 2006. She was the
                    youngest of 5 and the only biological child of Rich &
                    Michelle. She was loved beyond measure and brought so much
                    happiness to her family. Tessa was born in Peoria, IL on
                    March 20, 2006. She was the youngest of 5 and the only
                    biological child of Rich & Michelle. She was loved beyond
                    measure and brought so much happiness to her family.
                  </p>
                  <a
                    id="b1"
                    className="underline text-right"
                    onClick={() => moreInfo1()}
                  >
                    View more
                  </a>
                </div>
              </ScrollAnimation>
              <ScrollAnimation animateIn="fadeIn">
                <div className="bg-white rounded-md w-[20rem] px-8 py-4 border">
                  <img className="mx-auto" src="/images/feedback.png" alt="" />
                  <a
                    className="underline text-[#346164] text-xl font-medium mt-2"
                    href="#"
                  >
                    Michael
                  </a>
                  <p id="p2" className="text-left my-4 line-clamp-6">
                    essa was born in Peoria, IL on March 20, 2006. She was the
                    youngest of 5 and the only biological child of Rich &
                    Michelle. She was loved beyond measure and brought so much
                    happiness to her family. Tessa was born in Peoria, IL on
                    March 20, 2006. She was the youngest of 5 and the only
                    biological child of Rich & Michelle. She was loved beyond
                    measure and brought so much happiness to her family.
                  </p>
                  <a
                    id="b2"
                    className="underline text-right"
                    onClick={() => moreInfo2()}
                  >
                    View more
                  </a>
                </div>
              </ScrollAnimation>
              <ScrollAnimation animateIn="fadeInRight">
                <div className="bg-white rounded-md w-[20rem] px-8 py-4 border">
                  <img className="mx-auto" src="/images/feedback.png" alt="" />
                  <a
                    className="underline text-[#346164] text-xl font-medium mt-2"
                    href="#"
                  >
                    Michael
                  </a>
                  <p id="p3" className="text-left my-4 line-clamp-6">
                    essa was born in Peoria, IL on March 20, 2006. She was the
                    youngest of 5 and the only biological child of Rich &
                    Michelle. She was loved beyond measure and brought so much
                    happiness to her family. Tessa was born in Peoria, IL on
                    March 20, 2006. She was the youngest of 5 and the only
                    biological child of Rich & Michelle. She was loved beyond
                    measure and brought so much happiness to her family.
                  </p>
                  <a
                    id="b3"
                    className="underline text-right"
                    onClick={() => moreInfo3()}
                  >
                    View more
                  </a>
                </div>
              </ScrollAnimation>
            </div>
          </div>

          {/* Shop Now Section */}
          <div className="flex flex-col gap-4 lg:flex-row justify-around items-center px-10 lg:px-16 py-20 bg-[#F5F5F5]">
            <div className="text-4xl text-center lg:text-left lg:w-1/5 leading-normal">
              <p>
                Join us
                <strong className="text-[#346164]"> today</strong>, and begin
                <strong className="text-[#346164]"> celebrating</strong> their
                life.
              </p>
              <a
                href="https://heartstribute.com"
                target="_blank"
                className="bg-[#346164] rounded-md hover:bg-[#B0CF33] px-10 py-2 mt-4 text-xl text-white"
              >
                Shop Now
              </a>
            </div>
            <div className="lg:w-1/3">
              <img src="/images/locket.png" alt="" />
            </div>
            <div className="space-y-4">
              <img className="w-32" src="/images/locket2.png" alt="" />
              <img className="w-32" src="/images/locket2.png" alt="" />
              <img className="w-32" src="/images/locket2.png" alt="" />
            </div>
          </div>

          {/* Feedback Section */}
          <div className="flex flex-col gap-4 items-center lg:flex-row justify-around px-16 py-20">
            <div className="w-[18rem] sm:w-[26rem] lg:w-1/4 px-0 tracking-wider my-4 shadow-lg border-l border-r rounded-lg">
              <p className="px-6 pt-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos
                distinctio quaerat optio beatae. Modi quae odit est ad
              </p>
              <h3 className="px-6 font-semibold mt-4 mb-2">Michael</h3>
              <div className="px-6 flex gap-1">
                <img className="w-4" src="/images/star.png" alt="" />
                <img className="w-4" src="/images/star.png" alt="" />
                <img className="w-4" src="/images/star.png" alt="" />
                <img className="w-4" src="/images/star.png" alt="" />
                <img className="w-4" src="/images/star.png" alt="" />
              </div>
              <div className="mt-8 relative rounded-lg">
                <img
                  className="w-20 border-4 border-white rounded-full absolute right-10"
                  src="/images/Group.png"
                  alt=""
                />
                <img className="w-full" src="/images/Vector2.svg" alt="" />
              </div>
            </div>
            <div className="w-[18rem] sm:w-[26rem] lg:w-1/4 px-0 tracking-wider my-4 shadow-lg border-l border-r rounded-lg">
              <p className="px-6 pt-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos
                distinctio quaerat optio beatae. Modi quae odit est ad
              </p>
              <h3 className="px-6 font-semibold mt-4 mb-2">Michael</h3>
              <div className="px-6 flex gap-1">
                <img className="w-4" src="/images/star.png" alt="" />
                <img className="w-4" src="/images/star.png" alt="" />
                <img className="w-4" src="/images/star.png" alt="" />
                <img className="w-4" src="/images/star.png" alt="" />
                <img className="w-4" src="/images/star.png" alt="" />
              </div>
              <div className="mt-8 relative rounded-lg">
                <img
                  className="w-20 border-4 border-white rounded-full absolute right-10"
                  src="/images/Group.png"
                  alt=""
                />
                <img className="w-full" src="/images/Vector2.svg" alt="" />
              </div>
            </div>
            <div className="w-[18rem] sm:w-[26rem] lg:w-1/4 px-0 tracking-wider my-4 shadow-lg border-l border-r rounded-lg">
              <p className="px-6 pt-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos
                distinctio quaerat optio beatae. Modi quae odit est ad
              </p>
              <h3 className="px-6 font-semibold mt-4 mb-2">Michael</h3>
              <div className="px-6 flex gap-1">
                <img className="w-4" src="/images/star.png" alt="" />
                <img className="w-4" src="/images/star.png" alt="" />
                <img className="w-4" src="/images/star.png" alt="" />
                <img className="w-4" src="/images/star.png" alt="" />
                <img className="w-4" src="/images/star.png" alt="" />
              </div>
              <div className="mt-8 relative rounded-lg">
                <img
                  className="w-20 border-4 border-white rounded-full absolute right-10"
                  src="/images/Group.png"
                  alt=""
                />
                <img
                  className="w-full rounded-lg"
                  src="/images/Vector2.svg"
                  alt=""
                />
              </div>
            </div>
          </div>

        </div>
      </Layout>
    </>
  );
}
