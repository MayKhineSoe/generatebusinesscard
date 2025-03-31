import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";

const CreateNewProfiles = () => {

    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        jobTitle: "",
        company: "",
        phone: "",
        email: "",
        facebook: "",
        tiktok: "",
        youtube: "",
        address: "",
        profileImage: null,
        color: "#3498db",
    });

    const generateSlug = (name) => {
        if (!name || name.trim() === "") {
            return `company-${Date.now()}`; // Use a default slug if company name is empty
        }
        return name
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "") // Remove spaces
            .replace(/[^a-z0-9]/g, ""); // Remove special characters
    };

    const [profileId, setProfileId] = useState("");
    const [profileSlug, setProfileSlug] = useState(""); // Store slug in state
    const [qrcode, setQrcode] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData({ ...formData, profileImage: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            let profileImageUrl = null;
            if (formData.profileImage) {
                if (!formData.profileImage.type.startsWith("image/")) {
                    setMessage("Only image files are allowed.");
                    setLoading(false);
                    return;
                }
                const fileName = `profile_${Date.now()}.png`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("profile_images")
                    .upload(fileName, formData.profileImage, {
                        contentType: "image/png",
                    });
                if (uploadError) throw uploadError;
                const { data: publicUrl } = supabase.storage
                    .from("profile_images")
                    .getPublicUrl(uploadData.path);
                profileImageUrl = publicUrl.publicUrl;
            }

            // Generate unique slug
            let companySlug = generateSlug(formData.company);
            if (!companySlug) {
                setMessage("Error: Company name is required to generate a slug.");
                setLoading(false);
                return;
            }

            // Check if the slug already exists
            let { data: existingSlug, error: slugError } = await supabase
                .from("business_cards")
                .select("slug")
                .eq("slug", companySlug)
                .maybeSingle();


            // If slug exists, append a timestamp to make it unique
            if (existingSlug) {
                companySlug = `${companySlug}-${Date.now()}`;
            }

            console.log("Generated Slug:", companySlug);

            const { data, error } = await supabase
                .from("business_cards")
                .insert([
                    {
                        name: formData.name,
                        job_title: formData.jobTitle,
                        company: formData.company,
                        phone: formData.phone,
                        email: formData.email,
                        facebook: formData.facebook,
                        tiktok: formData.tiktok,
                        youtube: formData.youtube,
                        address: formData.address,
                        color: formData.color,
                        profile_image: profileImageUrl,
                        slug: companySlug,
                    },
                ])
                .select("id, slug")
                .single();

            if (error) throw error;

            const profileId = data.id;
            const profileUrl = `${window.location.origin}/nbprintingservice/profile/${data.slug}`;

            await supabase
                .from("business_cards")
                .update({ qr_code: profileUrl })
                .eq("id", profileId);

            setProfileId(profileId);
            setProfileSlug(data.slug); // Store slug in state
            setQrcode(profileUrl);
            setMessage("Business card saved successfully!");

            setFormData({
                name: "",
                jobTitle: "",
                company: "",
                phone: "",
                email: "",
                facebook: "",
                tiktok: "",
                youtube: "",
                address: "",
                color: "#3498db",
                profileImage: null,
            });
        } catch (error) {
            setMessage("Error saving business card: " + error.message);
        } finally {
            setLoading(false);
        }
        e.target.reset()
    };


    return (
        <div className="bg-blue-100 grid grid-cols-1 md:grid-cols-3 items-center gap-6 max-w-5xl mx-auto p-6 shadow-lg rounded-lg">
        {/* Left Side - Form */}
        <div className='md:col-span-2'>
            <h2 className="font-bold text-2xl text-blue-500 text-center mb-6">Create Business Card</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <input type="text" name="name" value={formData.name} onChange={handleChange} 
                    className="input-field w-full h-12 p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" 
                    placeholder="Full Name" />
                <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} 
                    className="input-field w-full h-12 p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" 
                    placeholder="Job Title" />
                <input type="text" name="company" value={formData.company} onChange={handleChange} 
                    className="input-field w-full h-12 p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" 
                    placeholder="Company Name" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} 
                    className="input-field w-full h-12 p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" 
                    placeholder="Email" />
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} 
                    className="input-field w-full h-12 p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" 
                    placeholder="Phone" />
                <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} 
                    className="input-field w-full h-12 p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" 
                    placeholder="Facebook" />
                <input type="text" name="tiktok" value={formData.tiktok} onChange={handleChange} 
                    className="input-field w-full h-12 p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" 
                    placeholder="Tiktok" />
                <input type="text" name="youtube" value={formData.youtube} onChange={handleChange} 
                    className="input-field w-full h-12 p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" 
                    placeholder="Youtube" />
                <input type="text" name="address" value={formData.address} onChange={handleChange} 
                    className="input-field w-full h-12 p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" 
                    placeholder="Address" />
                <input type="color" name="color" value={formData.color} onChange={handleChange} 
                    className="input-field w-full h-12 p-1 bg-gray-200 border border-gray-200 rounded-lg cursor-pointer" />
                <input type="file" name="profileImage" accept="image/*" onChange={handleFileChange} 
                    className="input-field w-full h-12 p-2 border border-gray-200 rounded-lg bg-gray-200 cursor-pointer" />
                <button type="submit" 
                    className="w-full bg-gradient-to-r from-blue-200 to-cyan-200 hover:bg-teal-600 rounded-lg py-3 font-bold text-slate-600 col-span-2">
                    Generate Business Card
                </button>
            </form>
        </div>
    
        {/* Right Side - QR Code & Profile Link */}
        {profileId && profileSlug && (
            <div className="flex flex-col max-h-96 bg-gray-50 shadow-md rounded-lg p-6 border border-gray-200">
                <h3 className="font-medium text-lg mb-5 text-teal-500">Profile Link:</h3>
                <a href={`/nbprintingservice/profile/${profileSlug}`} className="text-gray-500 hover:underline break-words text-sm">
                    yourdomain.com/nbprintingservice/profile/{profileSlug}
                </a>
                <div className="mt-6 place-items-center">
                    <QRCodeCanvas value={`${window.location.origin}/nbprintingservice/profile/${profileSlug}`} size={150} />
                </div>
            </div>
        )}
    </div>
    
    
    );
};

export default CreateNewProfiles;