import "../assets/css/components/confirmDialog.css";

export default function ConfirmDialog({
  show,
  title = "Confirmation",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}) {
  if (!show) return null;

  return (
    <>
      <div className="confirm-overlay" onClick={onCancel}></div>

      <div className="confirm-modal">
        <div className="confirm-header">
          <h4>{title}</h4>
        </div>

        <div className="confirm-body">
          <p>{message}</p>
        </div>

        <div className="confirm-footer">
          <button
            className="btn-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className={`btn-confirm ${confirmVariant}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
}