import { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";

import { getProfileImage } from "../utils/auth";
import { useToast } from "./ToastProvider";

import "../assets/css/components/imageUpload.css";

const MAX_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export default function ImageUpload({
  currentPhoto,
  editing,
  onUpload,
  onRemove,
}) {
  const fileInput = useRef(null);

  const { showError } = useToast();

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    setPreview(
      currentPhoto
        ? getProfileImage(currentPhoto)
        : null
    );
  }, [currentPhoto]);

  useEffect(() => {
    return () => {
      if (
        preview &&
        preview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const chooseFile = () => {
    if (editing) {
      fileInput.current?.click();
    }
  };

  const handleFile = ({ target }) => {
    const file = target.files?.[0];

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      showError(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );
      target.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      showError(
        "Maximum image size is 2 MB."
      );
      target.value = "";
      return;
    }

    if (
      preview &&
      preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(preview);
    }

    const image = URL.createObjectURL(file);

    setPreview(image);

    onUpload(file);

    target.value = "";
  };

  const handleRemove = () => {

    if (
      preview &&
      preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);

    onRemove();

  };

  return (
    <div className="image-upload">

      <div
        className={`image-preview ${editing ? "editable" : ""
          }`}
        onClick={chooseFile}
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile"
          />
        ) : (
          <div className="default-avatar">
            <FaCamera />
          </div>
        )}
      </div>

      {editing && (

        <div className="image-actions">

          <button
            type="button"
            className="upload-btn"
            onClick={chooseFile}
          >
            Choose Photo
          </button>

          {currentPhoto && (

            <button
              type="button"
              className="remove-btn"
              onClick={handleRemove}
            >
              Remove Photo
            </button>

          )}

        </div>

      )}

      <input
        ref={fileInput}
        type="file"
        hidden
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleFile}
      />

    </div>
  );
}