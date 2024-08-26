import { Link } from "react-router-dom";

export default function MyFavoriteCard({ profile }) {
    return (
        <Link to={`/profile/${profile.id}`}>
            <div className="m-1 rounded-lg bg-white py-7 font-poppins shadow-md hover:scale-110 md:justify-center">
                <div className="mx-auto flex w-3/5 items-center space-x-2">
                    <img
                        src={profile.profile_picture}
                        className="aspect-square w-16 rounded-full md:w-20 object-cover"
                        loading="lazy"
                    />
                    <div className="flex h-full flex-col justify-between">
                        <h1 className="uppercase text-sm font-medium tracking-wider md:text-lg xl:text-xl">
                            {profile.first_name + " " + profile.last_name}
                        </h1>
                        {profile.expiry_date ? (
            <p className="self-end bg-[#FAFAFA] text-2xs m-1 sm:text-sm py-1 rounded-md align-end">
              Days left until deletion: <span className="text-red-500"> {Math.ceil((new Date(profile.expiry_date) - new Date()) / (1000 * 60 * 60 * 24))}</span>
            </p>
      ):(
      <p className="self-end text-green bg-[#FAFAFA] text-2xs m-1 sm:text-sm py-1 rounded-md align-end">
              Activated 
            </p>
      )}                        
                        {/* <p className="mb-2 text-xs md:mb-1 md:text-sm xl:text-sm">
                            {profile.title || profile.breed}
                        </p> */}
                    </div>
                </div>

            </div>
        </Link>
    );
}
