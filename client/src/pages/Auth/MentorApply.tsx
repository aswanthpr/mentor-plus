import React, { useEffect, useState } from "react";
import ProfileImageUpload from "../../components/Common/Form/ProfileImageUpload";
import InputField from "../../components/Common/Form/InputField";
import SkillInput from "../../components/auth/SkillInput";
import FileUpload from "../../components/Common/Form/FileUpload";
import Button from "../../components/Common/Form/Button";
import { unProtectedAPI } from "../../Config/Axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Common/Spinner";

interface IFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  jobTitle: string;
  category: string;
  linkedinUrl: string;
  githubUrl: string;
  bio: string;
  skills?: string[];
  profileImage: Blob | null;
  resume: File | null;

}
interface IErrors {
  name: string;
  email: string;
  password: string;
  phone: string;
  jobTitle: string;
  category: string;
  linkedinUrl: string;
  githubUrl: string;
  bio: string;
  skills: string;
  resume: string;
  image: string
}
interface ICategory {
  id: string;
  category: string;
  isBlocked: boolean;
}

const MentorApply: React.FC = () => {
  const [formData, setFormData] = useState<IFormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    jobTitle: "",
    category: "",
    linkedinUrl: "",
    githubUrl: "",
    bio: "",
    skills: [],
    resume: null,
    profileImage: null


  });

  const [errors, setErrors] = useState<IErrors>({
    name: "",
    email: "",
    password: "",
    phone: "",
    jobTitle: "",
    category: "",
    linkedinUrl: "",
    githubUrl: "",
    bio: "",
    skills: '',
    resume: "",
    image: ''
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [resume, setResume] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<Blob | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      const response = await unProtectedAPI.get(`/auth/apply_as_mentor`);
      console.log(response.data.categories, 'this is the response')
      setCategories(response.data.categories);
    };

    fetchRole();
  }, []);

  const linkedinUrlPattern =
    /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
  const githubUrlPattern = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/?$/;
  const noNumbersOrSymbols = /^[a-zA-Z\s]+$/; // Allow only letters and spaces

  // Validation function
  const validateForm = () => {
    let formErrors: any = {};
    let isValid = true;

    if (!formData.name || formData.name.length < 3) {
      formErrors.name = "Name is required and must be at least 3 characters.";
      isValid = false;
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Valid email is required.";
      isValid = false;
    }

    if (!formData.password || formData.password.length < 6) {
      formErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (!formData.phone || formData.phone.length < 10) {
      formErrors.phone = "Phone number must be at least 10 characters.";
      isValid = false;
    }

    if (
      !formData.jobTitle ||
      formData.jobTitle.length < 4 ||
      formData.jobTitle.length > 50 ||
      !noNumbersOrSymbols.test(formData.jobTitle)
    ) {
      formErrors.jobTitle =
        "Job title must be between 4-50 characters and contain no numbers or symbols.";
      isValid = false;
    }

    if (formData.category === "") {
      formErrors.category = "Please select a valid category.";
      isValid = false;
    }
    if (formData.bio.length < 20 || formData.bio.length > 200) {
      formErrors.bio = "Bio must be between 20 and 200 characters.";
      isValid = false
    }
    if (
      skills.length === 0 ||
      skills.some(
        (skill) => skill.length < 3 || !noNumbersOrSymbols.test(skill)
      )
    ) {
      formErrors.skills =
        "Skills must be at least 3 characters long and contain no numbers or symbols.";
      isValid = false;
    }

    if (!linkedinUrlPattern.test(formData.linkedinUrl)) {
      formErrors.linkedinUrl =
        "Please enter a valid LinkedIn URL (https://www.linkedin.com/in/...).";
      isValid = false;
    }

    if (!githubUrlPattern.test(formData.githubUrl)) {
      formErrors.githubUrl =
        "Please enter a valid GitHub URL (https://github.com/...).";
      isValid = false;
    }

    if (!profileImage) {
      formErrors.image =
        "Profile image is required and must be in JPEG, PNG, or JPG format.";
      isValid = false;
    }

    if (
      resume &&
      (resume.size > 2 * 1024 * 1024 ||
        ![
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(resume.type))
    ) {
      formErrors.resume =
        "Resume must be a PDF or DOCX file and under 2MB in size.";
      isValid = false;
    }
    if (!resume) {
      formErrors.resume = 'resume cannot be empty'
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

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

    setLoading(true)
    try {
      const response = await unProtectedAPI.post(`/auth/apply_as_mentor`, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      if (response.data && response.data.status == 200) {
        console.log(response.data.message);
        toast.success(response.data.message);

        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          jobTitle: "",
          category: "",
          linkedinUrl: "",
          githubUrl: "",
          bio: "",
          skills: [],
          profileImage: null,
          resume: null,
        });
        navigate('/auth/login')
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        toast.error(message || "An error  occurred");
      } else {
        // Handle network or unexpected errors
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false)
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
    {  loading && <Spinner/>}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 flex flex-col">
        <h1 className="text-3xl font-bold text-black mb-1 text-center">
          Apply as a Mentor
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ProfileImageUpload onImageChange={setProfileImage} />
          {errors.image && (
            <p className=" text-center text-red-500 text-sm">{errors.image}</p>
          )} 
          <div className="grid md:grid-cols-2 gap-6 ">
            <div className="space-y-6 ">
              <InputField
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
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
                value={formData.email}
                error={errors.email}
                placeholder="Enter Email"
                className="border-orange-500"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("email", e.target.value)
                }
              />
              <InputField
                label="Password"
                name="password"
                type={"password"}
                value={formData.password}
                error={errors.password}
                placeholder="Enter Password"
                className="border-orange-500"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("password", e.target.value)
                }
              />
              <InputField
                label="Phone"
                name="phone"
                type={"text"}
                value={formData.phone}
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
                error={errors.jobTitle}
                type={"text"}
                value={formData.jobTitle}
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
                      <option key={category.category} value={category.category}>
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
            <div className="space-y-6">
              <InputField
                type="text"
                name="linkedinUrl"
                placeholder="Enter Linkedin url"
                label="Linkdin URL"
                value={formData.linkedinUrl}
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
                value={formData.githubUrl}
                error={errors.githubUrl}
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
                  value={formData.bio}
                  name="bio"
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself and your experience..."
                  rows={4}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500 resize-none"
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
            className="w-full font-bold mt-8"
            children={"Submit Application"}
          />
        </form>
        <p className="text-sm text-center text-gray-600 mt-8">
          Already have an account?
          <a
            href="/auth/login"
            className=" ml-1 font-medium text-[#ff8800] hover:text-[#ff9900]"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default MentorApply;
