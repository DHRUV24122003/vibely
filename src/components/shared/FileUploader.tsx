import {
  useCallback,
  useState,
} from "react";

import { useDropzone } from "react-dropzone";

import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

const FileUploader = ({
  fieldChange,
  mediaUrl,
}: FileUploaderProps) => {
  const [fileUrl, setFileUrl] =
    useState<string>(mediaUrl || "");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      fieldChange(acceptedFiles);

      setFileUrl(
        convertFileToUrl(acceptedFiles[0])
      );
    },
    [fieldChange]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,

    accept: {
      "image/*": [
        ".png",
        ".jpeg",
        ".jpg",
      ],
    },

    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        group relative
        cursor-pointer
        overflow-hidden
        rounded-[22px]
        border
        transition-all
        duration-300

        ${
          isDragActive
            ? "border-violet-400/50 bg-violet-500/[0.06]"
            : "border-white/[0.07] bg-[#09090B] hover:border-violet-400/25 hover:bg-white/[0.02]"
        }
      `}
    >
      <input {...getInputProps()} />

      {fileUrl ? (
        /* =====================================================
            IMAGE PREVIEW
        ===================================================== */
        <div className="relative p-3">
          <div
            className="
              relative
              max-h-[620px]
              overflow-hidden
              rounded-[17px]
              bg-black
            "
          >
            <img
              src={fileUrl}
              alt="Post preview"
              className="
                max-h-[620px]
                min-h-[300px]
                w-full
                object-cover
              "
            />

            {/* Overlay */}
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-black/0
                opacity-0
                transition-all
                duration-300
                group-hover:bg-black/40
                group-hover:opacity-100
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/10
                  bg-black/60
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  backdrop-blur-xl
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-[18px] w-[18px]"
                >
                  <path
                    d="M4 16L8.5 11.5L12 15L15 12L20 17"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <circle
                    cx="8.5"
                    cy="7.5"
                    r="1.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />

                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                </svg>

                Replace image
              </div>
            </div>
          </div>

          {/* Preview footer */}
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              px-2
              pb-1
              pt-3
            "
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

              <p className="text-xs text-light-3">
                Image ready
              </p>
            </div>

            <p className="text-[11px] text-light-4">
              Click or drop another image to replace
            </p>
          </div>
        </div>
      ) : (
        /* =====================================================
            EMPTY UPLOADER
        ===================================================== */
        <div
          className="
            flex
            min-h-[310px]
            flex-col
            items-center
            justify-center
            px-6
            py-10
            text-center
          "
        >
          {/* Upload icon */}
          <div
            className={`
              mb-5
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              border
              transition-all
              duration-300

              ${
                isDragActive
                  ? "scale-105 border-violet-400/30 bg-violet-500/10 text-violet-300"
                  : "border-white/[0.07] bg-white/[0.03] text-light-3 group-hover:border-violet-400/20 group-hover:bg-violet-500/[0.05] group-hover:text-violet-300"
              }
            `}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7"
            >
              <path
                d="M12 16V4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />

              <path
                d="M7.5 8.5L12 4L16.5 8.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M5 14V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V14"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h3 className="text-base font-semibold text-white">
            {isDragActive
              ? "Drop your image here"
              : "Add an image"}
          </h3>

          <p className="mt-2 max-w-[320px] text-sm leading-6 text-light-3">
            Drag and drop an image here, or choose one from your computer.
          </p>

          <div
            className="
              mt-5
              rounded-xl
              border
              border-white/[0.07]
              bg-white/[0.035]
              px-4
              py-2.5
              text-xs
              font-medium
              text-light-2
              transition-all
              duration-200
              group-hover:border-violet-400/20
              group-hover:bg-violet-500/[0.06]
              group-hover:text-white
            "
          >
            Browse files
          </div>

          <p
            className="
              mt-4
              text-[10px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-light-4
            "
          >
            PNG • JPG • JPEG
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;