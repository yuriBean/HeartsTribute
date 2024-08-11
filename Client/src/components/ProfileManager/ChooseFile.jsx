import { Label } from "./AddPost";
import { FileUploader } from "react-drag-drop-files";
import { useState } from "react";

export default function ChooseFile({
  value,
  onSelectValue,
  label,
  id,
  name,
  accept,
}) {
  const [selectedFile, setSelectedFile] = useState(value);

  const handleFileChange = (file) => {
    setSelectedFile(file);
    onSelectValue(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onSelectValue(null);
  };

  return (
    <>
      <div className="mb-1">
        <Label>
          {label}
          {<span className="text-red-500">*</span>}
        </Label>
      </div>
      <div className="flex flex-col">
        <FileUploader
          handleChange={handleFileChange}
          type="file"
          name={name}
          id={id}
          accept={accept}
          multiple={false}
          hoverTitle=""
          dropMessageStyle={{
            backgroundColor: "white",
            border: "none",
            color: "white",
          }}
          children={
            <div className="w-full px-2 py-16 mb-2 text-xs md:text-sm flex items-center justify-center border-2 border-dashed text-primary font-bold text-center rounded-md cursor-pointer">
              <p>
                Drag & Drop your file here or{" "}
                <span className="underline">click to browse </span>
              </p>
            </div>
          }
        />
        <div className="flex items-center md:text-left mt-2">
          {selectedFile && selectedFile?.name && (
            <div className="flex items-center space-x-2">
              <span className="border bg-gray-200 px-2 py-1 rounded-md break-all text-xs md:text-sm text-[#8D8D8D]">
                <img
                  src="/images/image-icon.svg"
                  alt="image"
                  className="inline pr-4 my-auto aspect-square"
                />
                {selectedFile?.name.split("/").length > 0
                  ? selectedFile?.name.split("/")[
                      selectedFile?.name.split("/").length - 1
                    ]
                  :selectedFile?.name}
              </span>
              <button
                onClick={handleRemoveFile}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
