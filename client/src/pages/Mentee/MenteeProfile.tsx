import React, { useState, useEffect, useCallback } from "react";
import {
  Linkedin,
  Camera,
  Github,
  KeyRoundIcon,
  UserPenIcon,
  LucideMail,
  LucidePhone,
  LucideSchool,
  LucideBook,
  EyeClosedIcon,
  EyeIcon,
} from "lucide-react";
import profile from '../../Asset/images.png';
import Modal from "../../components/Common/common4All/Modal";
import { toast } from "react-toastify";
import InputField from "../../components/Auth/InputField";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import {
  validateBio,
  validateConfirmPassword,
  validateCurrentPosition,
  validateEducation,
  validateEmails,
  validateGithubUrl,
  validateImageFile,
  validateLinkedinUrl,
  validateNames,
  validatePassword,
  validatePhones,
} from "../../Validation/Validation";
import { Link } from "react-router-dom";
import ImageCropper from "../../components/Auth/ImageCropper";
import Spinner from "../../components/Common/common4All/Spinner";
import { fetchImageChange, fetchMenteeChangePassword, fetchProfileData, fetchProfileEdit } from "../../service/menteeApi";



const MenteeProfile: React.FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState<boolean>(false);


  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [showCropper, setShowcropper] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [mentee, setMentee] = useState<IMentee | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IMentee>({
    _id: "",
    name: "",
    email: "",
    phone: "",
    bio: "",
    profileUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    education: "",
    currentPosition: "",
    isBlocked: false,
    verified:true,
    provider:"email"
  });
  const [errors, setErrors] = useState<IFormErrors>({
    name: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    githubUrl: "",
    bio: "",
    education: "",
    currentPosition: "",
  });
  const [editPassword, setEditPassword] = useState<IPass>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passError, setPassError] = useState<IPass>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    const error = validateImageFile(file);

    if (error) {
      toast.error("invalid file type");
      console.log(error);
      return;
    }
    setProfileImage(file);
    setShowcropper(true);
  },[]);

  useEffect(() => {
    const menteeData = async () => {
      try {
        setLoading(true);
        const response = await fetchProfileData()
       
        if (response?.status == 200 && response.data?.success) {
          setMentee(response.data?.result);
          setFormData(response.data?.result);
        }
      } catch (error: unknown) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
    };

    menteeData();
  }, []);

  const handleValidation =useCallback( () => {
    const formErrors: IFormErrors = {};

    formErrors.name = validateNames(formData.name || "");
    formErrors.email = validateEmails(formData.email || "");
    formErrors.phone = validatePhones(formData.phone || "");
    formErrors.education = validateEducation(formData.education || "");
    formErrors.currentPosition = validateCurrentPosition(
      formData.currentPosition || ""
    );
    formErrors.linkedinUrl = validateLinkedinUrl(formData.linkedinUrl || "");
    formErrors.githubUrl = validateGithubUrl(formData.githubUrl || "");
    formErrors.bio = validateBio(formData.bio || "");

    setErrors(formErrors);

    // Return true if no errors exist
    return Object.values(formErrors).every((error) => error === "");
  },[formData.bio, formData.currentPosition, formData.education, formData.email, formData.githubUrl, formData.linkedinUrl, formData.name, formData.phone]);
  const handlePasswordValidation = useCallback(() => {
    const passErrors: IPass = {};
    passErrors.currentPassword = validatePassword(`${editPassword?.currentPassword}`);
    passErrors.newPassword = validatePassword(`${editPassword?.newPassword}`);
    passErrors.confirmPassword = validateConfirmPassword(`${editPassword?.confirmPassword}`,`${ editPassword.newPassword}`);
    

    setPassError(passErrors);

    // Return true if there are no errors
    return Object.values(passErrors).every((error) => error === undefined);
  },[editPassword?.confirmPassword, editPassword?.currentPassword, editPassword.newPassword]);
  const modalClose =useCallback( () => {
    setEditModalOpen(false);

    setErrors({});
  },[]);
  const handleSaveChanges = useCallback(async () => {
    // Validate the form before sending data
    if (!handleValidation()) {
      return; // Stop if validation fails
    }

    setLoading(true);
    try {
      const menteeData = {
        _id: formData?._id,
        name: formData?.name,
        email: formData?.email,
        phone: formData?.phone,
        bio: formData?.bio,
        linkedinUrl: formData?.linkedinUrl,
        githubUrl: formData?.githubUrl,
        education: formData?.education,
        currentPosition: formData?.currentPosition,
      };
     
      const response = await fetchProfileEdit(menteeData);
    

      if (response?.status === 200 && response?.data?.success) {
        setFormData(response.data?.result);
        setMentee(response.data?.result);
        toast.success(response.data?.message);
        modalClose();
      }
    } catch (error: unknown) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  },[formData?._id, formData?.bio, formData?.currentPosition, formData?.education, formData?.email, formData?.githubUrl, formData?.linkedinUrl, formData?.name, formData?.phone, handleValidation, modalClose]);


  const passModalClose = useCallback(() => {
    setShowEditPassword(false);
    setEditPassword({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  },[]);


  const handleChangePassword = useCallback(async () => {
    try {
      if (!handlePasswordValidation()) {
        return; // Stop if validation fails
      }
      const passFormData = {
        currentPassword: `${editPassword.currentPassword}`,
        newPassword: `${editPassword.newPassword}`,
        _id: `${formData._id}`,
      };

      const response = await fetchMenteeChangePassword(passFormData as IChangePass)
     

      if (response?.status === 200 && response?.data?.success) {
        toast.success(response.data?.message);
        passModalClose();
      }
    } catch (error:unknown) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  },[editPassword.currentPassword, editPassword.newPassword, formData._id, handlePasswordValidation, passModalClose]);

  const handleCropComplete = useCallback(async (profileImage: Blob) => {
    try {
      setLoading(true);

      const response = await fetchImageChange(profileImage,formData?._id as string)
     
      setShowcropper(false);
      if (response.data && response.data.status == 200) {
        console.log(response.data.message);
        toast.success(response.data.message);

        setMentee((prevMentee) => {
          if (prevMentee === null) {
            return null;
          }
          return {
            ...prevMentee,
            profileUrl: response.data.profileUrl,
          };
        });
      }
    } catch (error: unknown) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  },[formData._id]);

  return (
    <div className="relative mt-16">
      {loading && <Spinner />}
      <div className="relative mb-10 ">
        <div className="h-56 bg-gradient-to-r from-[#ff8800] to-[#ff8800] rounded-b-lg">
          <div className="ml-5 absolute bottom-0 left-auto transform translate-y-1/2 flex items-end">
            <div className="relative group">
              <img
                src={mentee?.profileUrl ? mentee?.profileUrl : profile}
                alt=""
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <Camera className="w-8 h-8 text-white" />
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {showCropper && profileImage && (
                  <ImageCropper
                    imageFile={profileImage}
                    onCropComplete={handleCropComplete}
                    onCancel={() => setShowcropper(false)}
                  />
                )}
              </label>
            </div>
            <div className="ml-4 mb-0">
              <h1 className="text-2xl font-bold text-gray-700">
                {mentee?.name}
              </h1>
              <div className="">
                <div>
                  <h3 className="text-lg font-medium text-gray-500">
                    {mentee?.currentPosition}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="max-w-none mx-auto px-4 sm:px-6 lg:px">
        <div className="flex justify-end gap-4 mb-6">
          {mentee?.linkedinUrl ? (
            <Link to={mentee?.linkedinUrl}>
              <Linkedin className="text-[#00000] hover:text-[#ff8800] mr-6" />
            </Link>
          ) : (
            ""
          )}
          {mentee?.githubUrl ? (
            <Link to={mentee?.githubUrl}>
              <Github className="text-[#000000] hover:text-[#ff8800] mr-5" />
            </Link>
          ) : (
            ""
          )}
        </div>

        {/* Edit and Change Password buttons with Tooltips */}
        <div className="flex justify-end gap-4 mb-8">
          {/* Edit Profile Button */}
          <div className="relative group">
            <button
              onClick={() => setEditModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-200 rounded-full transition-colors"
            >
              <UserPenIcon />
            </button>
            {/* Tooltip for Edit Profile */}
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded px-2 py-1 transition-opacity">
              Edit Profile
            </span>
          </div>

          {/* Change Password Button */}
          {formData?.provider !='google' &&(

          <div className="relative group">
            <button
              onClick={() => setShowEditPassword(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-200 rounded-full transition-colors"
            >
              <KeyRoundIcon />
            </button>
            {/* Tooltip for Change Password */}
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded px-2 py-1 transition-opacity">
              Change Password
            </span>
          </div>
          )}
          </div>

        {/* Profile Information Section */}
        <section className="mt-0 grid grid-cols-1 md:grid-cols-2 gap-8 ml-6">
          <div className="space-y-2">
            <div>
              <p className="mt-1 text-lg text-gray-900 flex">
                <LucideMail className="mr-2" /> {mentee?.email}
              </p>
            </div>
            <div>
              <p className="mt-1 text-lg text-gray-900 flex ">
                <LucidePhone className="mr-2" /> {mentee?.phone}
              </p>
            </div>
            <div>
              <p className="mt-1 text-lg text-gray-900 flex">
                <LucideSchool className="mr-2" /> {mentee?.education}
              </p>
            </div>
            <div>
              <p className="mt-1 text-lg text-gray-900 flex">
                <LucideBook className="mr-2 w-20" />
                {mentee?.bio}
              </p>
            </div>
          </div>
        </section>
      </section>
      {editModalOpen && (
        <Modal
          isOpen={editModalOpen}
          onClose={modalClose}
          children={
            <>
              <h2 className="text-xl text-center font-bold mb-4">
                Change User Data
              </h2>

              <div className="space-y-4">
                <InputField
                  id={"name"}
                  placeholder={"Enter name"}
                  error={errors?.name}
                  className={""}
                  type="text"
                  name={"name"}
                  value={formData?.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <InputField
                  id={"email"}
                  placeholder={"Enter email"}
                  error={errors?.email}
                  className={""}
                  type="email"
                  name={"email"}
                  value={formData?.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <InputField
                  id={"phone"}
                  name={"phone"}
                  placeholder={"Enter phone"}
                  error={errors?.phone}
                  value={formData?.phone || ""}
                  className=""
                  type="text"
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                <InputField
                  id={"education"}
                  name={"education"}
                  placeholder={"Enter your Education"}
                  error={errors?.education}
                  value={formData?.education || ""}
                  className=""
                  type="text"
                  onChange={(e) =>
                    setFormData({ ...formData, education: e.target.value })
                  }
                />
                <InputField
                  id={"currnetPosition"}
                  name={"currentPosition"}
                  placeholder={"Enter your current status"}
                  error={errors?.currentPosition}
                  value={formData?.currentPosition || ""}
                  className=""
                  type="text"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentPosition: e.target.value,
                    })
                  }
                />
                <InputField
                  id={"linkedinUrl"}
                  placeholder={"Enter Your linkedin URL"}
                  error={errors?.linkedinUrl}
                  className={""}
                  type="text"
                  name={"linkedinUrl"}
                  value={formData?.linkedinUrl || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedinUrl: e.target.value })
                  }
                />
                <InputField
                  id={"githubUrl"}
                  placeholder={"Enter Your github URL"}
                  error={errors?.githubUrl}
                  className={""}
                  type="text"
                  name={"name"}
                  value={formData?.githubUrl || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, githubUrl: e.target.value })
                  }
                />

                <textarea
                  value={formData?.bio || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself and your experience..."
                  rows={4}
                  className="w-full px-4 py-2  rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 resize-none border-2"
                />
                <p className="text-sm text-red-500">{errors?.bio}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-[#ff8800] text-white rounded-md hover:bg-[#e67a00]"
                >
                  Save
                </button>
              </div>
            </>
          }
        />
      )}
      {showEditPassword && (
        <Modal
          isOpen={showEditPassword}
          onClose={passModalClose}
          children={
            <>
              <h2 className="text-xl text-center font-bold mb-4">
                Change Password
              </h2>
              <div className="space-y-4">
              <div className="relative">
                <InputField
                  id={"currentPassword"}
                  name="currentPassword"
                  value={editPassword.currentPassword || ""}
                  placeholder="Enter Current Password" 
                  error={passError?.currentPassword || ""}
                  className={""}
                  type={isCurrentPasswordVisible ? "text" : "password"}
                  onChange={(e) =>
                    setEditPassword({
                      ...editPassword,
                      currentPassword: e.target.value,
                    })
                  }
                />
              
                 <button
            type="button"
            onClick={()=>setIsCurrentPasswordVisible((pre)=>!pre)}
            aria-label={isCurrentPasswordVisible ? "Hide Password" : "Show Password"}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" // Position the icon to the right of the input field
          >
            {isCurrentPasswordVisible ? <EyeClosedIcon /> : <EyeIcon />}
          </button>
    
                </div>
                <div className="relative">
                <InputField
                  id={"newPassword"}
                  name="newPassword"
                  value={editPassword.newPassword || ""}
                  placeholder="Enter New Password"
                  error={passError?.newPassword || ""}
                  className={""}
                  type={isPasswordVisible ? "text" : "password"}
                  onChange={(e) =>
                    setEditPassword({
                      ...editPassword,
                      newPassword: e.target.value,
                    })
                  }
                />
                 <button
            type="button"
            onClick={()=>setIsPasswordVisible((pre)=>!pre)}
            aria-label={isPasswordVisible ? "Hide Password" : "Show Password"}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
          >
            {isPasswordVisible ? <EyeClosedIcon /> : <EyeIcon />}
          </button>
    
                </div>
                <div className="relative">
                <InputField
                  id={"confirmPassword"}
                  name="confirmPassword"
                  value={editPassword.confirmPassword || ""}
                  placeholder="Enter Confirm Password"
                  error={passError?.confirmPassword || ""}
                  className={""}
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  onChange={(e) =>
                    setEditPassword({
                      ...editPassword,
                      confirmPassword: e.target.value,
                    })
                  }
                />

               <button
               type="button"
               onClick={()=>setIsConfirmPasswordVisible((prev)=>!prev)}
               aria-label={isConfirmPasswordVisible ? "Hide Password" : "Show Password"}
               className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
             >
               {isConfirmPasswordVisible ? <EyeClosedIcon /> : <EyeIcon />}
             </button>
       
                   </div>
                   </div>
              <div className="mt-6 flex justify-end">

                <button
                  onClick={handleChangePassword}
                  className="px-4 py-2 bg-[#ff8800] text-white rounded-md hover:bg-[#e67a00]"
                >
                  Save
                </button>
              </div>
            </>
          }
        />
      )}
    </div>
  );
};

export default MenteeProfile;
