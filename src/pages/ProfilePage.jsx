import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import { FaPhone, FaEnvelope, FaFacebookF, FaTiktok, FaYoutube, FaMapMarkerAlt, FaQrcode } from "react-icons/fa";


const ProfilePage = () => {

    const{slug} = useParams()
    const {id} = useParams() //Get the user ID from the URL
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const {data, error} = await supabase
            .from('business_cards')
            .select('*')
            .eq('slug',id)
            .single();
            
            if(error) {
                console.error('Error fetching profile:', error)
            }else {
                setProfile(data);
            }
            
        }
        fetchProfile();
    },[slug])

    if (!profile) return <div>Loading...</div>;

  return (
    <div className="relative  shadow-[5px_5px_rgba(200,_100,_120,_0.4),_10px_10px_rgba(200,_100,_120,_0.3),_15px_15px_rgba(200,_100,_120,_0.2),_20px_20px_rgba(200,_100,_120,_0.1),_25px_25px_rgba(200,_100,_120,_0.05)]
 bg-gradient-to-r h-[750px] from-red-100 to-sky-50 mt-8 mb-8 max-w-sm mx-auto bg-white rounded-2xl  overflow-hidden transform transition-all duration-300"
        >
            {/* Wavy Header */}
            <div className="relative">
                <svg
                    className="absolute top-0 left-0 w-full"
                    viewBox="0 0 500 150"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0,0 C150,100 350,0 500,100 L500,0 L0,0 Z"
                        fill={profile.color}
                    ></path>
                </svg>
            </div>

            {/* Profile Image */}
            <div className="flex flex-col   items-center mt-16">
                <div className="relative shadow-3xl shadow-[5px_5px_rgba(200,_100,_120,_0.4),_10px_10px_rgba(200,_100,_120,_0.3),_15px_15px_rgba(200,_100,_120,_0.2),_20px_20px_rgba(200,_100,_120,_0.1),_25px_25px_rgba(200,_100,_120,_0.05)]  mt-4 mb-4 w-36 h-36 flex items-center justify-center rotate-45 border-4"
                style={{ borderColor: profile?.color || "#f87171" }}>

                    <img
                        className="w-36 h-36  rotate-[-45deg]   rounded-full"
                        src={profile.profile_image}

                    />
                </div>
                <div className="mt-8 text-center">
                    <h2 className="text-2xl font-bold font-serif" style={{ color: profile?.color || "#f87171" }}>{profile.name}</h2>
                    <p className="text-sm mt-2 font-serif tracking-widest text-stone-500">{profile.job_title}</p>
                    <p className="text-sm mt-2 font-serif tracking-widest mb-4 text-stone-600">{profile.company}</p>
                </div>
            </div>

            {/* Contact Info */}

            <div className="relative bg-gradient-to-r from-red-100 to-sky-50 max-w-sm mx-auto bg-white overflow-hidden transform transition-all duration-300">
                {/* Vertical Background for Icons */}
                <div className="absolute rounded-es-3xl left-6 top-0 h-full w-12 flex flex-col items-center justify-center space-y-8 py-8"
                style={{ backgroundColor: profile?.color || "#f87171"}}>
                    <FaPhone className="text-white text-xl" />
                    <FaEnvelope className="text-white text-xl" />
                    <FaFacebookF className="text-white text-xl" />
                    <FaTiktok className="text-white text-xl" />
                    <FaYoutube className="text-white text-xl" />
                    <FaMapMarkerAlt className="text-white text-xl" />
                </div>

                {/* Contact Details */}
                <div className="pl-24 p-8 space-y-6 font-serif tracking-wide">
                    <div className="flex items-center gap-4 text-stone-700">
                        <a href='tel:+959979384056'>
                            <FaPhone className="text-red-500 text-xl hidden" /> {profile.phone}

                        </a>                    </div>
                    <div className="flex items-center gap-4 text-stone-700">
                        <a href='mailto:naingyekhant@aurahorizon.org?subject=Hello&body=I want to know more about your services!'>
                            <FaEnvelope className="text-red-500 text-xl hidden" /> {profile.email}

                        </a>                    </div>

                    <div className="flex items-center gap-4 text-stone-700">
                        <a href={profile.facebook} target="_blank"
                            rel="noopener noreferrer">
                            <FaFacebookF className="text-red-500 text-xl hidden" /> AuraHorizon
                        </a>
                    </div>
                    <div className="flex items-center gap-4 text-stone-700">
                        <a href={profile.tiktok} target="_blank"
                            rel="noopener noreferrer">
                            <FaTiktok className="text-red-500 text-xl hidden" /> TikTok
                        </a>
                    </div>
                    <div className="flex items-center gap-4 text-stone-700">
                        <a href={profile.youtube} target="_blank"
                            rel="noopener noreferrer">
                            <FaYoutube className="text-red-500 text-xl hidden" /> YouTube
                        </a>
                    </div>
                    
                    <div className="flex items-center gap-4 text-stone-700">
                        <a href='https://maps.app.goo.gl/mZSgFePXestkDjKV8'  target="_blank" 
   rel="noopener noreferrer" >
                            <FaMapMarkerAlt className="text-red-500 text-xl hidden" /> {profile.address}

                        </a>
                    </div>
                </div>
            </div>

            {/* Wave Footer */}
            <div className="relative">
                <svg
                    className="absolute top-0 left-0 w-full"
                    viewBox="0 0 500 150"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0,150 L500,0 L500,150 L0,150 Z"
                        fill={profile.color}
                    ></path>
                </svg>
            </div>

           
        </div>
  )
}

export default ProfilePage