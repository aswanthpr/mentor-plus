import React, { useState } from "react";
import { Upload } from "lucide-react";


export const FileUpload: React.FC<IFileUpload> = ({
  onFileSelect,
  accept = ".pdf,.doc,.docx",
}) => {
  const [fileName, setFileName] = useState<string>("");
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      alert("File size exceeds the 5MB limit.");
      return;
    }
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };
  return (
    <div className="border-2 border-dashed border-orange-500 rounded-lg p-2 ">
      <label className="flex flex-col items-center justify-center cursor-pointer">
        {fileName ? (
          <span className="text-gray-600 ">{fileName}</span>
        ) : (
          <>
            <Upload className="w-5 h-5 text-orange-500 mb-2 " />
            <span className="text-gray-600 ">Click to upload your resume</span>
            <span className="text-xs text-gray-500 mt-1">
              {" "}
              PDF, DOC, DOCX (MAX 3MB)
            </span>
          </>
        )}   

        <input
          type="file"
          name="resume"
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
        />
      </label>
    </div>
  );
};

export default FileUpload;
