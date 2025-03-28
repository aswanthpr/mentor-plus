import React, { useCallback, useEffect, useState } from "react";
import ProfileImageUpload from "../../components/Auth/ProfileImageUpload";
import InputField from "../../components/Auth/InputField";
import SkillInput from "../../components/Auth/SkillInput";
import FileUpload from "../../components/Auth/FileUpload";
import Button from "../../components/Auth/Button";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../components/Common/common4All/Spinner";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import {
  fetchMentorApplication,
  newMentorApply,
} from "../../service/mentorApi";
import { MentorApplyForm } from "../../Validation/Validation";
import bgImg from "../../Asset/background.jpg";
import { MENTOR_APPLY_INITIAL } from "../../Constants/initialStates";
import { HttpStatusCode } from "axios";
import { Messages, ROUTES } from "../../Constants/message";

const MentorApply: React.FC = () => {
  const [formData, setFormData] = useState<IFormData>(
    MENTOR_APPLY_INITIAL?.formData
  );
  const [errors, setErrors] = useState<IErrors>(MENTOR_APPLY_INITIAL?.errors);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [resume, setResume] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<Blob | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      const response = await fetchMentorApplication();

      setCategories(response.data.categories);
    };

    fetchRole();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const validateForm = MentorApplyForm(
        formData,
        resume,
        skills,
        profileImage
      );
      if (validateForm?.isValid) {
        setErrors(validateForm?.formErrors);
      }
      if (!validateForm.isValid) return;

      const form = new FormData();

      form.append("bio", formData.bio);
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("jobTitle", formData.jobTitle);
      form.append("password", formData.password);
      form.append("category", formData.category);
      form.append("githubUrl", formData.githubUrl);
      form.append("linkedinUrl", formData.linkedinUrl);

      if (resume) form.append("resume", resume);
      if (profileImage) form.append("profileImage", profileImage);
      if (skills.length > 0) {
        skills.forEach((skill) => {
          form.append("skills", skill);
        });
      }

      setLoading(true);

      const response = await newMentorApply(form);

      if (response?.data?.success && response?.status == HttpStatusCode?.Ok) {
        setFormData(MENTOR_APPLY_INITIAL?.formData);
        navigate(ROUTES?.MENTOR_LOGIN);

        toast.info(Messages?.MENTOR_APPLY_INFO);
      }

      setLoading(false);
    },
    [formData, navigate, profileImage, resume, skills]
  );

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);
  return (
    <div
      className="min-h-screen bg-gray-50 py-1 px-4 font-sans items-center justify-center flex"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {loading && <Spinner />}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 flex flex-col ">
        <h1 className="text-2xl font-bold text-black mb-1 text-center">
          Apply as a Mentor
        </h1>
        <form onSubmit={handleSubmit} className="space-y-1">
          <ProfileImageUpload onImageChange={setProfileImage} />
          {errors.profileImage && (
            <p className=" text-center text-red-500 text-sm">
              {errors?.profileImage}
            </p>
          )}
          <div className="grid md:grid-cols-2 gap-5 ">
            <div className="space-y-5 ">
              <InputField
                label="Full Name"
                type="text"
                name="name"
                value={formData?.name}
                error={errors.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("name", e.target.value)
                }
                placeholder="Enter your full name"
                className="border-orange-500 "
              />
              <InputField
                label="Email"
                name="email"
                type={"email"}
                value={formData?.email}
                error={errors.email}
                placeholder="Enter Email"
                className="border-orange-500"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("email", e.target.value)
                }
              />
              <div className="relative">
                <InputField
                  label="Password"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={formData?.password}
                  error={errors.password}
                  placeholder="Enter Password"
                  className="border-orange-500"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("password", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((pre) => !pre)}
                  aria-label={
                    isPasswordVisible ? "Hide Password" : "Show Password"
                  }
                  className="absolute right-4 top-12 transform -translate-y-1/2 text-gray-400" // Position the icon to the right of the input field
                >
                  {isPasswordVisible ? <EyeClosedIcon /> : <EyeIcon />}
                </button>
              </div>
              <InputField
                label="Phone"
                name="phone"
                type={"text"}
                value={formData?.phone}
                error={errors.phone}
                placeholder="Enter Phone"
                className="border-orange-500"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("phone", e.target.value)
                }
              />
              <InputField
                label="Job Title"
                name="jobTitle"
                error={errors?.jobTitle}
                type={"text"}
                value={formData?.jobTitle}
                placeholder="Enter Job Title"
                className="border-orange-500"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("jobTitle", e.target.value)
                }
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium" htmlFor="category">
                  Category
                </label>
                <select
                  name="category"
                  id="categoryId"
                  value={formData.category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    handleInputChange("category", e.target.value);
                  }}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8800] border-orange-500"
                >
                  <option value="">Select a category</option>
                  {categories.length ? (
                    categories.map((category) => (
                      <option
                        key={category?.category}
                        value={category.category}
                      >
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
            </div>
            <div className="space-y-2">
              <InputField
                type="text"
                name="linkedinUrl"
                placeholder="Enter Linkedin url"
                label="Linkdin URL"
                value={formData?.linkedinUrl}
                error={errors.linkedinUrl}
                className="border-orange-500"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("linkedinUrl", e.target.value)
                }
              />
              <InputField
                type="text"
                placeholder="Enter github url"
                label="Github URL"
                value={formData?.githubUrl}
                error={errors?.githubUrl}
                name="githubUrl"
                className="border-orange-500"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("githubUrl", e.target.value)
                }
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  value={formData?.bio}
                  name="bio"
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself and your experience..."
                  rows={4}
                  className="w-full px-4 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500 resize-none"
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm">{errors.bio}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Skills
                </label>
                <SkillInput
                  skills={skills}
                  onSkillsChange={setSkills}
                  maxSkills={8}
                />
                {errors.skills && (
                  <p className="text-red-500 text-sm">{errors.skills}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Resume
                </label>
                <FileUpload onFileSelect={(file) => setResume(file)} />
                {errors.resume && (
                  <p className="text-red-500 text-sm">{errors.resume}</p>
                )}
              </div>
            </div>
          </div>
          <Button
            type="submit"
            variant="orange"
            className="w-full font-bold"
            children={"Submit Application"}
          />
        </form>
        <p className="text-sm text-center text-gray-600 mt-2">
          Already have an account?
          <Link
            to={ROUTES?.MENTOR_LOGIN}
            className=" ml-1 font-medium text-[#ff8800] hover:text-[#ff9900]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default MentorApply;
