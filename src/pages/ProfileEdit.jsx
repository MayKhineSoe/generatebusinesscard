import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

const ProfileEdit = ({profile, onClose}) => {

    const { id } = useParams();
    console.log("ProfileID from URL:", id)
    const navigate = useNavigate();
    const [selectedFileName, setSelectedFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

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
        color: "#3498db",
        profileImage: null,
    });


    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("business_cards")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                setMessage("Error fetching profile");
            } else {

                // console.log("Fetched Profile Data:", data);
                // console.log("Fetched Profile Image URL:", data.profile_image);
                setFormData({
                    name: data.name,
                    jobTitle: data.job_title,
                    company: data.company,
                    phone: data.phone,
                    email: data.email,
                    facebook: data.facebook,
                    tiktok: data.tiktok,
                    youtube: data.youtube,
                    address: data.address,
                    color: data.color,
                    profileImage: data.profile_image,
                });
            }

            setLoading(false);
        };
        fetchProfile();

    }, [id]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData({ ...formData, profileImage: file });
            setSelectedFileName(file.name);

        }
    };

    const handleUpdate = async (e) => {

        // console.log("UPdate data", formData)
        e.preventDefault();
        setLoading(true);
        setMessage("");

        // const user = supabase.auth.user;
        // if (!user) {
        //     console.error('User not logged in');
        //     return; // Or handle the case where the user is not logged in
        // }

        try {

            let profileImageUrl = formData.profileImage;
            let oldImagePath = null;

            // Fetch the current image path before updating
        const { data: currentData, error: fetchError } = await supabase
            .from("business_cards")
            .select("profile_image")
            .eq("id", id)
            .single();

        if (fetchError) throw fetchError;
        oldImagePath = currentData?.profile_image?.split("/").pop(); // Extract file name

        // **Upload New Image if Changed**
        if (formData.profileImage instanceof File) {
            const fileName = `profile_${Date.now()}.png`;

            // Upload new image
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("profile_images")
                .upload(fileName, formData.profileImage, { contentType: "image/png" });

            if (uploadError) throw uploadError;

            // Get public URL of the new image
            const { data: publicUrl } = supabase.storage
                .from("profile_images")
                .getPublicUrl(uploadData.path);

            profileImageUrl = publicUrl.publicUrl;

            // **Delete Old Image (if exists)**
            if (oldImagePath) {
                await supabase.storage.from("profile_images").remove([oldImagePath]);
            }

            // **Update formData state so UI refreshes**
            setFormData((prev) => ({ ...prev, profileImage: profileImageUrl }));
        }


            // update database
            const { error } = await supabase
                .from("business_cards")
                .update({
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
                    // user_id: user.id, // ✅ Ensure policy allows update
                })
                .eq("id", id);
            console.log("Update Response:", error ? error.message : "Update successful");

            if (error) {
                console.error("Supabase Update Error:", error);
                throw error;
            }

            setMessage("Profile updated successfully!");
            navigate("/profiles");
            // window.location.reload();
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Error updating profile: " + error.message);
        } finally {
            setLoading(false);
        }

    };
    return (
        <div>
            <h2 className='font-bold text-2xl text-teal-500 text-center mt-4 mb-4'>Update Business Card</h2>
            <form onSubmit={handleUpdate} className="max-w-2xl mx-auto">
                <div className='grid grid-cols-2 gap-6 items-start'>

                    <div className='w-full h-full flex flex-col gap-y-5'>
                        <div className="mb-5">
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500" placeholder="Full Name" />
                        </div>

                        <div className="mb-5">
                            <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500" placeholder="Job Title" />
                        </div>

                        <div className="mb-5">
                            <input type="text" name="company" value={formData.company} onChange={handleChange} className="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500" placeholder="Company Name" />
                        </div>

                        <div className="mb-5">
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500" placeholder="Email" />
                        </div>

                        <div className="mb-5">
                            <input type="text" name='phone' value={formData.phone} onChange={handleChange} className="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500" placeholder="Phone" />
                        </div>

                        <div className="mb-5">
                            <input type="text" name='facebook' value={formData.facebook} onChange={handleChange} className="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500" placeholder="Facebook" />
                        </div>
                    </div>

                    <div className='w-full h-full flex flex-col gap-y-5
            
            '>
                        <div className="mb-5">
                            <input type="text" name='tiktok' value={formData.tiktok} onChange={handleChange} className="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500" placeholder="Tiktok" />
                        </div>

                        <div className="mb-5">
                            <input type="text" name='youtube' value={formData.youtube} onChange={handleChange} className="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500" placeholder="Youtube" />
                        </div>

                        <div className="mb-5">
                            <input type="text" name='address' value={formData.address} onChange={handleChange} className="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500" placeholder="Address" />
                        </div>


                        <div className="mb-5">
                            <input type="color" name='color' value={formData.color} onChange={handleChange} className="bg-green-50 border h-10 border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500" placeholder="Choose Card Color" />
                        </div>

                        <div className="mb-5 flex items-center gap-2">
                                <input type="file" name='profileImage' accept='image/*' onChange={handleFileChange} className=" bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 w-full p-2.5 dark:bg-gray-700 dark:border-green-500" placeholder="Upload Image" />

                            
                            <span>
                                {selectedFileName || (formData.profileImage ? formData.profileImage.split('/').pop() : "No file chosen")}
                            </span>
                        </div>
                        <button type='submit' className='flex items-center text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'>Update Business Card</button>
                    </div>


                </div>
            </form>

            <button
                onClick={() => navigate("/profiles")}
                className="mt-4 bg-teal-500 text-white px-4 py-2 rounded">
                View All Profiles
            </button>
        </div>
    )
}

export default ProfileEdit