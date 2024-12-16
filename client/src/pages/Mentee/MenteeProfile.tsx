import React, { useState } from "react";
import Header from "../../components/Common/Ui_Layout/Header";
import ProfileImageUpload from "../../components/Common/Form/ProfileImageUpload";
import { Linkedin,Camera, Github } from "lucide-react";

const MenteeProfile = () => {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [showEditProfile,setShowEditProfile] = useState(false);
  const [showEditPassword,setShowEditPassword] = useState(false);


  const handleFilechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
    }
  };
 
  return (
    <div className="relative">
      <div className="relative mb-10 ">
        <div className="h-48 bg-gradient-to-r from-[#ff8800] to-[#ff8800] rounded-b-lg">
          <div className=" ml-5 absolute bottom-0 left-auto  transform translate-y-1/2 flex items-end">
            <div className="relative group">
              <img
                src=""
                alt=""
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <Camera className="w-8 h-8 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFilechange}
                />
              </label>
            </div>
            <div className="ml-4 mb-4">
              <h1 className="text-2xl font-bold text-gray-700">
                {"profile name"}
              </h1>
            </div>
          </div>
        </div>
      </div>
    <section className="max-w-none mx-auto px-4 sm:px-6 lg:px">
    <div className="flex justify-end gap-4 mb-8">
        <button 
        onClick={()=>setShowEditProfile(true)}
        className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
        >
           Edit Profile
        </button>
        <button 
        onClick={()=>setShowEditPassword(true)}
        className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
        >
           Change Password
        </button>
    </div>

<section className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="space-y-2 ">
    
    <div>
        <h3 className="text-sm font-medium text-gray-500">Expertise</h3>
        <p className="mt-1 text-lg text-gray-900">profile.Experiteees</p>
    </div>
    <div>
          <h3 className="text-sm font-medium text-gray-500">Email</h3>
          <p className="mt-1 text-lg text-gray-900">profile.email</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Phone</h3>
          <p className="mt-1 text-lg text-gray-900">profile.phone</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Bio</h3>
          <p className="mt-1 text-lg text-gray-900">profile.bio</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Skills</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            profile.skills.map((skill) = (
              <span
                key='skill.id'
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#fff3e6] text-[#ff8800]"
              >
                'skill.name'
              </span>
            ))
          </div>
        </div>
</div>
<div className="flex justify-end gap-4 mb-8">
    
   <Github className="text-[#000000] hover:text-[#ff8800]"/>
   <Linkedin className="text-[#00000]  hover:text-[#ff8800]"/>
  </div>
</section>


    </section>

    </div>
  );
};

export default MenteeProfile;
