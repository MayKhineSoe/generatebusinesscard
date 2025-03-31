import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { MdOutlinePreview, MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { TiBusinessCard } from "react-icons/ti";

const ViewAllProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewModalOpen, setPreviewModalOpen] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase.from("business_cards").select("*");

      if (error) {
        console.log("Error fetching profiles:", error);
      } else {
        setProfiles(data);
      }
      setLoading(false);
    };

    fetchProfiles();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading Profiles...</p>;

  const handleDelete = async (id) => {
    if (!id) return console.error("No profile ID provided");
  
    if (!window.confirm("Are you sure you want to delete this business card?")) return;
  
    try {
      // 🔹 Fetch the profile to get the image URL
      const { data: profileData, error: fetchError } = await supabase
        .from("business_cards")
        .select("profile_image") // Make sure this is the correct column name
        .eq("id", id)
        .single();
  
      if (fetchError) throw fetchError;
  
      let imagePath = null;
  
      if (profileData?.profile_image) {
        // 🔹 Extract actual file path from the full URL
        const urlParts = profileData.profile_image.split("/");
        imagePath = urlParts[urlParts.length - 1]; // Get only the filename
      }
  
      console.log("Deleting image:", imagePath); // Debugging log
  
      // 🔹 Delete the profile from Supabase
      const { error: deleteError } = await supabase.from("business_cards").delete().eq("id", id);
      if (deleteError) throw deleteError;
  
      // 🔹 Delete the image from Supabase Storage (if it exists)
      if (imagePath) {
        const { error: storageError } = await supabase.storage.from("profile_images").remove([imagePath]);
        if (storageError) throw storageError;
  
        console.log("Image successfully deleted from storage!"); // Debugging log
      }
  
      // 🔹 Update UI by removing the deleted profile
      setProfiles(profiles.filter((profile) => profile.id !== id));
  
      alert("Profile deleted successfully!");
    } catch (error) {
      console.error("Error deleting profile:", error.message);
    }
  };
  
  
  return (
    <div>
      <div className="flex justify-between items-center my-6 px-6">
        <h2 className="flex items-center text-3xl mb-6 font-bold text-blue-500"><TiBusinessCard className="mr-2 text-blue-400" />All Business Cards</h2>
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 place-items-center gap-4 px-6">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="w-full  bg-gradient-to-r from-violet-100 to-indigo-100 shadow-md rounded-xl overflow-hidden 
                 p-5 transform space-y-2 transition-all hover:scale-105 hover:shadow-lg"
          >
            {/* Profile Image */}
            <div className="w-20 h-20 mx-auto mb-3">
              <img
                src={profile.profile_image}
                className="w-full h-full object-cover rounded-full border border-gray-300"
              />
            </div>

            {/* Profile Name */}
            <h2 className="text-lg font-bold text-center" style={{ color: profile?.color || "#f87171" }}>
              {profile.name || "No Name"}
            </h2>

            {/* Job Title & Company */}
            <p className="text-sm text-center text-gray-600">{profile.job_title || "No Title"}</p>
            <p className="text-xs text-center text-gray-400">{profile.company || "No Company"}</p>

            {/* Action Buttons */}
            <div className="flex justify-center gap-6 mt-6 text-xl">
              <Link to={`/nbprintingservice/profile/${profile.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                <MdOutlinePreview />
              </Link>

              <button onClick={() => setEditModalOpen(profile)} className="text-yellow-500 hover:text-yellow-700">
                <MdOutlineEdit />
              </button>

              <button onClick={() => handleDelete(profile.id)} className="text-red-500 hover:text-red-700">
                <MdOutlineDelete />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Render Modals */}
      {previewModalOpen && <PreviewProfileModal profile={previewModalOpen} onClose={() => setPreviewModalOpen(null)} />}
      {editModalOpen && <EditProfileModal profile={editModalOpen} id={editModalOpen.id} onClose={() => setEditModalOpen(null)} />}
    </div>
  );
};

/* Preview Profile Modal */
const PreviewProfileModal = ({ profile, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold">{profile.name}</h2>
        <p>{profile.job_title}</p>
        <p>{profile.company}</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-700 text-white rounded">
          Close
        </button>
      </div>
    </div>
  );
};

/* Edit Profile Modal */
const EditProfileModal = ({ id, profile, onClose }) => {

   const [selectedFileName, setSelectedFileName] = useState("");
  //  const { id } = useParams();
  const [formData, setFormData] = useState({
    id: profile.id,
    name: profile.name || "",
    job_title: profile.job_title || "",
    company: profile.company || "",
    email: profile.email || "",
    facebook: profile.facebook || "",
    tiktok: profile.tiktok || "",
    youtube: profile.youtube || "",
    address: profile.address || "",
    color: profile.color || "",
    profile_image: profile.profile_image || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        setFormData({ ...formData, profileImage: file });
        setSelectedFileName(file.name);

    }
};

const handleSave = async () => {
  try {
    console.log("Profile ID:", id); // Debugging
    console.log("Received ID:", id); // Debugging

      if (!id) {
          console.error("Error: Profile ID is undefined.");
          return;
      }

      let profileImageUrl = formData.profileImage;
      let oldImagePath = null;

      // 🔹 Fetch current profile image before updating
      const { data: currentData, error: fetchError } = await supabase
          .from("business_cards")
          .select("profile_image")
          .eq("id", profile.id)
          .single();

      if (fetchError) throw fetchError;

      if (currentData?.profile_image) {
          oldImagePath = currentData.profile_image.replace(
              `${supabase.storage.from("profile_images").getPublicUrl("").data.publicUrl}/`,
              ""
          );
      }

      // 🔹 Upload new image if changed
      if (formData.profileImage instanceof File) {
          const fileName = `profile_${Date.now()}.png`;

          // Upload new image
          const { data: uploadData, error: uploadError } = await supabase.storage
              .from("profile_images")
              .upload(fileName, formData.profileImage, { contentType: "image/png" });

          if (uploadError) throw uploadError;

          // Get public URL of new image
          profileImageUrl = supabase.storage.from("profile_images").getPublicUrl(uploadData.path).data.publicUrl;

          // Delete old image if exists
          if (oldImagePath) {
              await supabase.storage.from("profile_images").remove([oldImagePath]);
          }

          // Update formData state
          setFormData((prev) => ({ ...prev, profileImage: profileImageUrl }));
      }

      // 🔹 Prepare data for update (Exclude `File` objects)
      const updateData = {
          ...formData,
          profile_image: profileImageUrl, // Use new image URL
      };

      // Ensure no File object is sent in the update request
      Object.keys(updateData).forEach((key) => {
          if (updateData[key] instanceof File) {
              delete updateData[key];
          }
      });

      // 🔹 Update profile in Supabase
      const { error } = await supabase.from("business_cards").update(updateData).eq("id", profile.id);

      if (error) throw error;

      alert("Profile updated successfully!");
      onClose();
  } catch (error) {
      console.error("Error updating profile:", error.message);
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold">Edit Profile</h2>
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
</div>


</div>
        <div className="flex justify-end mt-4 space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-teal-500 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAllProfiles;
