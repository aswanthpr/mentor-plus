import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Modal from "../../components/Common/common4All/Modal";
import Spinner from "../../components/Common/common4All/Spinner";
import SkillInput from "../../components/Auth/SkillInput";
import FileUpload from "../../components/Auth/FileUpload";
import InputField from "../../components/Auth/InputField";
import ImageCropper from "../../components/Auth/ImageCropper";
import profile from "../../Asset/user.png";
import {
  Linkedin,
  Camera,
  Github,
  KeyRoundIcon,
  UserPenIcon,
  LucideMail,
  LucidePhone,
  LucideBook,
  LucideCode,
  FileUser,
  EyeClosedIcon,
  EyeIcon,
  BadgeCheckIcon,
} from "lucide-react";
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
  validateSkills,
} from "../../Validation/Validation";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import {
  fetchChangeImage,
  fetchChangePassword,
  fetchEditProfile,
  fetchMentorProfileData,
} from "../../service/mentorApi";
import {
  MENTE_PROFILE_PASS_CHANGE,
  MENTOR_PROFILE_FORM_ERROR_INITIAL,
  MENTOR_PROFILE_FORM_INITIAL,
} from "../../Constants/initialStates";
import { HttpStatusCode } from "axios";
import { Messages } from "../../Constants/message";

const MentorProfile: React.FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false);
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [resume, setResume] = useState<File | null>(null);
  const [showCropper, setShowcropper] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [mentor, setMentor] = useState<IMentor | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<IMentor>>(
    MENTOR_PROFILE_FORM_INITIAL
  );
  const [errors, setErrors] = useState<IMentorErrors>(
    MENTOR_PROFILE_FORM_ERROR_INITIAL
  );
  const [editPassword, setEditPassword] = useState<IPass>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passError, setPassError] = useState<IPass>(MENTE_PROFILE_PASS_CHANGE);

  useEffect(() => {
    const menterData = async () => {
      setLoading(true);
      const response = await fetchMentorProfileData();

      if (response.status == HttpStatusCode?.Ok && response.data.success) {
        setMentor(response.data?.result);
        setFormData(response.data?.result);
        setCategories(response.data?.categories);
        setSkills(response.data.mentor?.skills);
      }

      setLoading(false);
    };

    menterData();
  }, []);

  const handleValidation = useCallback(() => {
    const formErrors: IMentorErrors = MENTOR_PROFILE_FORM_ERROR_INITIAL;

    formErrors.bio = validateBio(formData?.bio || "");
    formErrors.name = validateNames(formData?.name || "");
    formErrors.email = validateEmails(formData?.email || "");
    formErrors.phone = validatePhones(formData?.phone || "");
    formErrors.skills = validateSkills(formData?.skills || []);
    formErrors.jobTitle = validateEducation(formData?.jobTitle || "");
    formErrors.githubUrl = validateGithubUrl(formData?.githubUrl || "");
    formErrors.category = validateCurrentPosition(formData?.category || "");
    formErrors.linkedinUrl = validateLinkedinUrl(formData?.linkedinUrl || "");

    setErrors(formErrors);

    return Object.values(formErrors).every((error) => error === "");
  }, [
    formData?.bio,
    formData?.category,
    formData?.email,
    formData?.githubUrl,
    formData?.jobTitle,
    formData?.linkedinUrl,
    formData?.name,
    formData?.phone,
    formData?.skills,
  ]);

  //password validation
  const handlePasswordValidation = useCallback(() => {
    const passErrors: IPass = {};
    passErrors.currentPassword = validatePassword(
      `${editPassword.currentPassword}`
    );
    passErrors.newPassword = validatePassword(`${editPassword.newPassword}`);
    passErrors.confirmPassword = validateConfirmPassword(
      ` ${editPassword?.confirmPassword}`,
      ` ${editPassword?.newPassword}`
    );

    setPassError(passErrors);

    // Return true if there are no errors
    return Object.values(passErrors).every((error) => error === undefined);
  }, [
    editPassword?.confirmPassword,
    editPassword?.currentPassword,
    editPassword?.newPassword,
  ]);
  const modalClose = useCallback(() => {
    setErrors(MENTOR_PROFILE_FORM_ERROR_INITIAL);
    setResume(null);
    setEditModalOpen(false);
  }, []);

  const handleSaveChanges = useCallback(async () => {
    if (!handleValidation()) {
      return;
    }

    setLoading(true);
    try {
      const Data = {
        _id: formData?._id,
        bio: formData?.bio,
        name: formData?.name,
        email: formData?.email,
        resume: resume,
        phone: formData?.phone,
        skills: formData?.skills,
        jobTitle: formData?.jobTitle,
        category: formData?.category,
        githubUrl: formData?.githubUrl,
        linkedinUrl: formData?.linkedinUrl,
      };

      const response = await fetchEditProfile(Data);

      if (response?.status === HttpStatusCode?.Ok && response?.data?.success) {
        setFormData(response.data?.result);
        setMentor(response.data?.result);
        toast.success(response.data?.message);
        modalClose();
      }
    } catch (error: unknown) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  }, [
    formData?._id,
    formData?.bio,
    formData?.category,
    formData?.email,
    formData?.githubUrl,
    formData?.jobTitle,
    formData?.linkedinUrl,
    formData?.name,
    formData?.phone,
    formData?.skills,
    handleValidation,
    modalClose,
    resume,
  ]);

  const passModalClose = useCallback(() => {
    setShowEditPassword(false);
    setEditPassword(MENTE_PROFILE_PASS_CHANGE);
  }, []);

  const handleChangePassword = useCallback(async () => {
   
      if (!handlePasswordValidation()) {
        return; // Stop if validation fails
      }
      const passFormData = {
        currentPassword: `${editPassword?.currentPassword}`,
        newPassword: `${editPassword?.newPassword}`,
        _id: `${formData._id}`,
      };

      const response = await fetchChangePassword(passFormData);

      if (response?.status === HttpStatusCode?.Ok && response?.data?.success) {
        toast.success(response.data?.message);
        passModalClose();
      }

      setLoading(false);
    
  }, [
    editPassword?.currentPassword,
    editPassword?.newPassword,
    formData._id,
    handlePasswordValidation,
    passModalClose,
  ]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const error = validateImageFile(file);

        if (error) {
          toast.error(Messages?.FILE_CHANGE_ERROR);
          
          return;
        }
        setProfileImage(file);
        setShowcropper(true);
      }
    },
    []
  );

  const handleCropComplete = useCallback(
    async (profileImage: Blob) => {
   
        setShowcropper(false);
        setLoading(true);

        const response = await fetchChangeImage(
          profileImage,
          formData?._id as string
        );

        if (response.data && response.data?.status == HttpStatusCode?.Ok) {
          toast.success(response.data?.message);

          setMentor((prevMentee) => {
            if (prevMentee === null) {
              return null;
            }
            return {
              ...prevMentee,
              profileUrl: response.data?.profileUrl,
            };
          });
        }

        setLoading(false);
     
    },
    [formData._id]
  );

  return (
    <div className="relative mt-16">
      {loading && <Spinner />}
      <div className="relative mb-10 ">
        <div className="h-48 bg-gradient-to-r from-[#ff8800] to-[#ff8800] rounded-b-lg">
          <div className="ml-14 absolute bottom-0 left-auto transform translate-y-20 flex items-end">
            <div className="relative group">
              <img
                src={ mentor?.profileUrl ?? profile}
                alt=""
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
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
              </label>
              {showCropper && profileImage && (
                <ImageCropper
                  imageFile={profileImage}
                  onCropComplete={handleCropComplete}
                  onCancel={() => setShowcropper(false)}
                />
              )}
            </div>
            <div className="ml-4 mb-0 ">
              <div className="flex flex-row">
                <h1 className="flex text-2xl font-bold text-gray-700 pt-2">
                  {mentor?.name}
                </h1>
                <span className="mt-3">
                  {" "}
                  <BadgeCheckIcon className="ml-1 text-green-600 w-5" />
                </span>
              </div>
              <div>
                <div>
                  <h3 className="text-sm font-medium  text-gray-500 ">
                    {mentor?.category}
                  </h3>
                  <h3 className="text-sm font-medium text-gray-500 ">
                    {mentor?.jobTitle}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="max-w-none mx-auto px-4 sm:px-4 lg:px">
        <div className="flex justify-end gap-4 mb-6">
          {mentor?.linkedinUrl ? (
            <div className="relative group">
              <Link to={mentor?.linkedinUrl}>
                <Linkedin className="text-[#00000] hover:text-[#ff8800] mr-6" />
              </Link>
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded px-2 py-1 transition-opacity">
                Linkedin
              </span>
            </div>
          ) : (
            ""
          )}
          {mentor?.githubUrl ? (
            <div className="relative group">
              <Link to={mentor?.githubUrl}>
                <Github className="text-[#000000] hover:text-[#ff8800] mr-5" />
              </Link>
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded px-2 py-1 transition-opacity">
                Github
              </span>
            </div>
          ) : (
            ""
          )}
        </div>

        {/* Edit and Change Password buttons with Tooltips */}
        <div className="flex justify-end  gap-4 mb-8">
          {mentor?.resume && (
            <div className="relative group ">
              <Link
                to={`${mentor?.resume}`}
                target="_blank"
                className=" px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-200 rounded-full transition-colors flex items-end"
              >
                <FileUser />
              </Link>
              {/* Tooltip for Edit Profile */}
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded px-2 py-1 transition-opacity">
                Resume
              </span>
            </div>
          )}
          {/* Edit Profile Button */}
          <div className="relative group ">
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
        </div>

        {/* Profile Information Section */}
        <section className="mt-0 grid grid-cols-1 md:grid-cols-2 gap-8 ml-6">
          <div className="space-y-2">
            {mentor?.email && (
              <div>
                <p className="mt-1 text-lg text-gray-900 flex">
                  <LucideMail className="mr-2" />
                  {mentor?.email}
                </p>
              </div>
            )}
            {mentor?.phone && (
              <div>
                <p className="mt-1 text-lg text-gray-900 flex ">
                  <LucidePhone className="mr-2" /> {mentor?.phone}
                </p>
              </div>
            )}
            {mentor?.skills && (
              <div>
                <div className="mt-1 text-lg text-gray-900 flex items-center">
                  <LucideCode className="mr-2" />
                  <div className="flex flex-wrap gap-2">
                    {mentor?.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {mentor?.bio && (
              <div>
                <span className="mt-1 text-lg text-gray-900 flex">
                  <p>
                    <LucideBook className="mr-2" />
                  </p>
                  {mentor?.bio}
                </span>
              </div>
            )}
          </div>
        </section>
      </section>
      {editModalOpen && (
        <Modal
          isOpen={editModalOpen}
          onClose={modalClose}
          children={
            <>
              <h2 className="text-xl text-center font-bold mb-4 ">
                Change User Data
              </h2>

              <div className="space-y-1">
                <InputField
                  id={"name"}
                  placeholder={"Enter name"}
                  error={errors?.name}
                  className={"border-orange-500"}
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
                  className={"border-orange-500"}
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
                  className="border-orange-500"
                  type="text"
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                <InputField
                  id={"jobTitle"}
                  name={"jobTitle"}
                  placeholder={"Enter your jobTitle"}
                  error={errors?.jobTitle}
                  value={formData?.jobTitle || ""}
                  className="border-orange-500"
                  type="text"
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                />

                <InputField
                  id={"linkedinUrl"}
                  placeholder={"Enter Your linkedin URL"}
                  error={errors?.linkedinUrl}
                  className={"border-orange-500"}
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
                  className={"border-orange-500"}
                  type="text"
                  name={"name"}
                  value={formData?.githubUrl || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, githubUrl: e.target.value })
                  }
                />

                <div className="space-y-2">
                  <select
                    name="category"
                    id="categoryId"
                    value={formData.category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setFormData({ ...formData, category: e.target.value });
                    }}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8800] border-orange-500"
                  >
                    {Array.isArray(categories) && categories.length ? (
                      categories.map((category) => (
                        <option key={category._id} value={category.category}>
                          {category.category}
                        </option>
                      ))
                    ) : (
                      <option disabled>No categories available</option>
                    )}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm">{errors.category}</p>
                  )}
                </div>

                <textarea
                  value={formData?.bio || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself and your experience..."
                  rows={4}
                  className="w-full px-4 py-2  rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 resize-none border-2 "
                />
                <p className="text-sm text-red-500">{errors?.bio}</p>

                <div className="space-y-2">
                  <SkillInput
                    skills={[...(skills ?? []), ...(formData.skills ?? [])]} //
                    onSkillsChange={(newSkills) =>
                      setFormData({ ...formData, skills: newSkills })
                    }
                    maxSkills={8}
                  />
                  {errors?.skills && (
                    <p className="text-red-500 text-sm">{errors?.skills}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <FileUpload onFileSelect={(file) => setResume(file)} />

                  {
                    mentor?.resume &&
                      typeof mentor?.resume === "string" &&
                      (resume ? (
                        ""
                      ) : (
                        <p className="from-neutral-600 text-gray-400">
                          {`${mentor?.resume}`.slice(-10)}
                        </p>
                      )) // Show file URL or name if it's just a string
                  }

                  {errors.resume && (
                    <p className="text-red-500 text-sm">{errors.resume}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
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
                    onClick={() => setIsCurrentPasswordVisible((pre) => !pre)}
                    aria-label={
                      isCurrentPasswordVisible
                        ? "Hide Password"
                        : "Show Password"
                    }
                    className="absolute right-4 top-7 transform -translate-y-1/2 text-gray-400" // Position the icon to the right of the input field
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
                    onClick={() => setIsPasswordVisible((pre) => !pre)}
                    aria-label={
                      isPasswordVisible ? "Hide Password" : "Show Password"
                    }
                    className="absolute right-4 top-7 transform -translate-y-1/2 text-gray-400"
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
                    onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                    aria-label={
                      isConfirmPasswordVisible
                        ? "Hide Password"
                        : "Show Password"
                    }
                    className="absolute right-4 top-7 transform -translate-y-1/2 text-gray-400"
                  >
                    {isConfirmPasswordVisible ? <EyeClosedIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              <div className="mt-6 flex justify-end ">
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

export default MentorProfile;
