import React, { useEffect, useState } from "react";
import Tribute from "./Tribute";
import PayTribute from "./PayTribute";
import { usePublicProfile } from "../Providers/PublicProfileProvider";
import Spinner from "../Common/Spinner";
import ScrollAnimation from "react-animate-on-scroll";

export default function TributeTab() {
    const [show, setShow] = useState(false);
    const { tributes, getTributes } = usePublicProfile();
    const [loading, setLoading] = useState(false);

    const fetchTributes = async () => {
        setLoading(true);
        await getTributes();
        setLoading(false);
    };

    useEffect(() => {
        fetchTributes();
    }, []);

    return !loading ? (
        <div>
            <div className="flex items-center justify-end">
                {!show && (
                    <button
                        onClick={() => setShow(!show)}
                        className="rounded-lg bg-primary px-4 py-2 text-white"
                    >
                        Pay Tribute
                    </button>
                )}
            </div>
            {show ? <PayTribute setShow={setShow} /> : null}
            {!show && (
                <div className="mt-6 grid grid-cols-1 place-items-center gap-6 rounded-lg md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {tributes.map((tribute) => (
                        <ScrollAnimation
                            className="w-full"
                            animateIn="bounceInRight"
                        >
                            <Tribute key={tribute.id} tribute={tribute} onDelete={fetchTributes} />
                        </ScrollAnimation>
                    ))}
                </div>
            )}
            {!show && tributes.length === 0 && (
                <div className="flex items-center justify-center">
                    <h1 className="text-2xl">No Tributes posted yet!</h1>
                </div>
            )}
        </div>
    ) : (
        <Spinner />
    );
}