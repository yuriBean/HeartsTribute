import { Link } from "react-router-dom";

export default function MyFavoriteCard({ profile }) {
    return (
        <Link to={`/profile/${profile.id}`}>
            <div className="m-1 rounded-lg bg-white py-7 font-poppins shadow-2xl hover:scale-110 md:justify-center">
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
                    </div>
                    
                </div>
                <div className="flex flex-col justify-end items-center">

                {profile.expiry_date ? (
                                <p className=" text-4xs mt-4 sm:text-sm rounded-md  text-center" style={{ fontSize: '13px'}}>
                                <span className="text-red-500"> {Math.ceil((new Date(profile.expiry_date) - new Date()) / (1000 * 60 * 60 * 24))} day(s) left to link Tribute Tag</span>
                                </p>
                        ):(
                        <p className="text-4xs mt-4 sm:text-sm rounded-md text-center text-green-500" style={{ fontSize: '13px'}}>
                                Tribute Tag Linked 
                                </p>
                        )}
                        </div>                        

            </div>
        </Link>
    );
}
