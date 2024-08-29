import Layout from "../components/Layout/Layout";


export default function ShopPage() {
  return (
    <>

      <Layout>
        <div className="flex flex-col lg:flex-row md:gap-x-8 justify-center mx-4 lg:px-0 2xl:mx-auto 2xl:gap-x-12">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
            <img
              className="mt-10 mx-auto lg:mx-0"
              src="/images/coin.png"
              alt=""
            />

            <div className="flex flex-col gap-4 lg:gap-0 justify-between mt-10 items-center lg:items-start">
              <img className="" src="/images/coin_gold.png" alt="" />
              <img className="" src="/images/coin_gold.png" alt="" />
              <img className="" src="/images/coin_gold.png" alt="" />
            </div>
          </div>

          <div className="flex flex-col mt-10 items-center lg:items-start text-center lg:text-left">
            <p className="font-semibold text-4xl w-2/3 2xl:w-full xl:text-5xl">
              Hearts Tribute Tribute Tag
            </p>

            <p className="mt-8 font-normal text-lg lg:text-xl text-[#383838]">
              Place it on your loved one's gravestone to provide{" "}
              <br className="hidden lg:block" />
              visitors with easy and meaningful access to their{" "}
              <br className="hidden lg:block" />
              Hearts Tribute profile.
            </p>

            <div className="w-36 h-14 rounded-3xl mt-7 border border-black flex items-center justify-center">
              <p className="font-bold text-xl">50.00$</p>
            </div>

            <div className="flex gap-4 mt-7 items-center">
              <p className="font-semibold text-xl lg:text-2xl">Description</p>
              <img src="/images/arrow.svg" alt="" />
            </div>

            <p className="font-normal text-base text-[#383838] mt-3">
              Place it on your loved one's gravestone to provide visitors with
              easy <br className="hidden lg:block" />
              and meaningful access to their Hearts Tribute profile.
            </p>

            <div className="flex gap-4 mt-8 items-center">
              <p className="font-semibold text-xl lg:text-2xl">
                Additional Information
              </p>
              <img src="/images/arrow.svg" alt="" />
            </div>

            <p className="font-normal text-base text-[#383838] mt-3">
              Place it on your loved one's gravestone to provide visitors with
              easy <br className="hidden lg:block" />
              and meaningful access to their Hearts Tribute profile.
            </p>

            <a
              href="https://www.heartstribute.com/product/tribute-tag/"
              target="__blank"
              className="w-40 h-14 bg-[#346164] mt-14 flex items-center justify-center rounded-md"
            >
              <div className="font-bold text-xl text-white">Buy Now</div>
            </a>
          </div>
        </div>
      </Layout>
    </>
  );
}
