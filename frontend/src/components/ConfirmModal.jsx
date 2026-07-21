// import "../assets/css/components/confirmModal.css";

// export default function ConfirmModal({
//   open,
//   title,
//   message,
//   confirmText = "Delete",
//   cancelText = "Cancel",
//   onConfirm,
//   onCancel,
// }) {
//   if (!open) return null;

//   return (
//     <div className="confirm-overlay">

//       <div className="confirm-modal">

//         <h3>{title}</h3>

//         <p>{message}</p>

//         <div className="confirm-actions">

//           <button
//             className="cancel-btn"
//             onClick={onCancel}
//           >
//             {cancelText}
//           </button>

//           <button
//             className="confirm-btn"
//             onClick={onConfirm}
//           >
//             {confirmText}
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// }

import { useEffect } from "react";
import "../assets/css/components/confirmModal.css";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <h3>{title}</h3>

        <p>{message}</p>

        <div className="confirm-actions">
          <button
            className="cancel-btn"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            className="confirm-btn"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}