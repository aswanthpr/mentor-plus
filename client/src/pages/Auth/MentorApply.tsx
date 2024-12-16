import React, { useState } from "react";
import ProfileImageUpload from "../../components/Common/Form/ProfileImageUpload";
import InputField from "../../components/Common/Form/InputField";
import SkillInput from "../../components/auth/SkillInput";
import FileUpload from "../../components/Common/Form/FileUpload";
import Button from "../../components/Common/Form/Button";

const CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "UI/UX Design",
  "DevOps",
  "Machine Learning",
  "Cloud Computing",
  "Cybersecurity",
];

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
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [resume, setResume] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<Blob | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData, skills, resume, profileImage);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 flex flex-col">
        <h1 className="text-3xl font-bold text-black mb-1 text-left ">
          Apply as a Mentor
        </h1>
        <ProfileImageUpload onImageChange={setProfileImage} />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6 ">
            <div className="space-y-6 ">
              <InputField
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
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
                className="border-orange-500"
                placeholder="Enter Passowrd"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("password", e.target.value)
                }
              />
              <InputField
                label="Phone"
                name="phone"
                type={"text"}
                value={formData.phone}
                placeholder="Enter Phone"
                className="border-orange-500"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("phone", e.target.value)
                }
              />
              <InputField
                label="Job Title"
                name="jobTitle"
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
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-6">
              <InputField
                type="text"
                placeholder="Enter Linkdin url"
                label="Linkdin URL"
                value={formData.linkedinUrl}
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
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself and your experience..."
                  rows={4}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500 resize-none"                />
              </div>
              <div className="space-y-1">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor=""
                >
                  Skills
                </label>
                <SkillInput
                 skills={skills}
                  onSkillsChange={setSkills}
                  maxSkills={8}
                   />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Resume
                </label>
                <FileUpload onFileSelect={(file) => setResume(file)} />
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
              <a href="/auth/login" className=" ml-1 font-medium text-[#ff8800] hover:text-[#ff9900]">
                 Sign in
              </a>
            </p>
      </div>
    
    </div>
  );
};

export default MentorApply;
