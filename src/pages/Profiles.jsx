import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { MdOutlinePreview, MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { FaPhone, FaEnvelope, FaFacebookF, FaTiktok, FaYoutube, FaMapMarkerAlt, FaQrcode } from "react-icons/fa";


const Profiles = () => {

    // const {profileId} = useParams()
    const navigate = useNavigate()
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfiles = async () => {
            const { data, error } = await supabase
                .from("business_cards")
                .select("*");

            if (error) {
                console.log("Error fetching profiles:" + error);
            } else {
                setProfiles(data)
            }
            setLoading(false)
        }

        fetchProfiles()
    }, [])

    if (loading)
        return <p className='text-center mt-5'>Loading Profiles...</p>

    const handleDelete = async (id) => {
        if (!id) {
            console.error("No profile ID provided");
            return;
        }
    
        const confirmDelete = window.confirm("Are you sure you want to delete this business card?");
        if (!confirmDelete) return;
    
        try {
            const { error } = await supabase
                .from("business_cards")
                .delete()
                .eq("id", id);
    
            if (error) throw error;
    
            setProfiles(profiles.filter(profile => profile.id !== id)); // Update UI
            alert("Profile deleted successfully!");
        } catch (error) {
            console.error("Error deleting profile:", error.message);
        }
    };
    
    

    return (
        <div className='w-full h-screen'>Profiles</div>

    )
}


export default Profiles