import React from 'react'
import Layout from '../components/Layout/Layout'

import { Outlet } from 'react-router-dom'
import { PublicProfileProvider } from '../components/Providers/PublicProfileProvider'
import HeaderForPublicProfile from '../components/Profile/HeaderForPublicProfile'
import { useLocation, useParams, useNavigate } from 'react-router-dom'


export default function Profile() {
    const location = useLocation();
    const { profile_id } = useParams();
    const navigate = useNavigate();

    return (
        <PublicProfileProvider profile_id={profile_id}>
            <Layout>
                <div>
                    <div className={`body-margin`}>
                        <HeaderForPublicProfile />
                        <div className='py-2'>
                            <div className="tab flex justify-around w-full gap-2">
                                <button onClick={() => navigate(`/profile/${profile_id}`)} className={`${location.pathname === `/profile/${profile_id}` ? 'bg-black text-white' : 'text-black bg-gray-200'} rounded text-[0.6rem] md:text-base lg:text-lg 2xl:text-xl tracking-widest py-2 lg:py-4 w-1/4`} >BIO</button>
                                <button onClick={() => navigate(`/profile/${profile_id}/media`)} className={`${location.pathname.includes("media") ? 'bg-black text-white' : 'text-black bg-gray-200'} rounded text-[0.6rem] md:text-base lg:text-lg 2xl:text-xl tracking-widest py-2 lg:py-4 w-1/4`} >MEDIA</button>
                                <button onClick={() => navigate(`/profile/${profile_id}/tribute`)} className={`${location.pathname.includes("tribute") ? 'bg-black text-white' : 'text-black bg-gray-200'} rounded text-[0.6rem] md:text-base lg:text-lg 2xl:text-xl tracking-widest py-2 lg:py-4 w-1/4`} >TRIBUTES</button>
                                <button onClick={() => navigate(`/profile/${profile_id}/timeline`)} className={`${location.pathname.includes("timeline") ? 'bg-black text-white' : 'text-black bg-gray-200'} rounded text-[0.6rem] md:text-base lg:text-lg 2xl:text-xl tracking-widest py-2 lg:py-4 w-1/4`} >TIMELINE</button>
                            </div>
                            <div className='mt-4'>
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </PublicProfileProvider>

    )
}