// import { useState } from "react";

// import StarRating from "../../components/StarRating";
// import reviewService from "../../services/reviewService";

// import { useToast } from "../../components/ToastProvider";

// import "../../assets/css/pages/reviewModal.css";

// export default function ReviewModal({

//     open,

//     onClose,

//     request,

//     onSuccess,

// }) {

//     const { showSuccess, showError } = useToast();

//     const [rating, setRating] = useState(0);

//     const [review, setReview] = useState("");

//     const [loading, setLoading] = useState(false);

//     if (!open) {

//         return null;

//     }

//     const submitReview = async () => {

//         if (rating === 0) {

//             showError("Please select a rating.");

//             return;

//         }

//         if (!review.trim()) {

//             showError("Please enter your review.");

//             return;

//         }

//         try {

//             setLoading(true);

//             await reviewService.saveReview({

//                 requestId: request.requestId,

//                 rating,

//                 review,

//             });

//             showSuccess(
//                 "Thank you for your valuable feedback."
//             );

//             onSuccess();

//             onClose();

//         } catch (error) {

//             console.error(error);

//             showError(

//                 error?.response?.data?.msg ||

//                 "Unable to submit review."

//             );

//         } finally {

//             setLoading(false);

//         }

//     };

//     return (

//         <div className="review-overlay">

//             <div className="review-modal">

//                 <h2>

//                     Rate Your Service

//                 </h2>

//                 <p>

//                     Please rate the service provided by

//                     <strong>

//                         {" "}

//                         {request?.technician?.name}

//                     </strong>

//                 </p>

//                 <StarRating

//                     rating={rating}

//                     onChange={setRating}

//                 />

//                 <textarea

//                     placeholder="Write your review..."

//                     rows="5"

//                     value={review}

//                     onChange={(e) =>
//                         setReview(e.target.value)
//                     }

//                 />

//                 <div className="review-actions">

//                     <button

//                         className="cancel-btn"

//                         onClick={onClose}

//                         disabled={loading}

//                     >

//                         Cancel

//                     </button>

//                     <button

//                         className="submit-btn"

//                         onClick={submitReview}

//                         disabled={loading}

//                     >

//                         {loading

//                             ? "Submitting..."

//                             : "Submit Review"}

//                     </button>

//                 </div>

//             </div>

//         </div>

//     );

// }

import { useEffect, useState } from "react";
import StarRating from "../../components/StarRating";
import reviewService from "../../services/reviewService";
import { useToast } from "../../components/ToastProvider";

import "../../assets/css/pages/reviewModal.css";

export default function ReviewModal({
  open,
  onClose,
  request,
  onSuccess,
}) {
  const { showSuccess, showError } = useToast();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setRating(0);
      setReview("");
    }
  }, [open]);

  if (!open) return null;

  const submitReview = async () => {
    if (loading) return;

    if (rating === 0) {
      showError("Please select a rating.");
      return;
    }

    if (!review.trim()) {
      showError("Please enter your review.");
      return;
    }

    try {
      setLoading(true);

      await reviewService.saveReview({
        requestId: request.requestId,
        rating,
        review: review.trim(),
      });

      showSuccess("Thank you for your valuable feedback.");

      onSuccess?.();
      onClose();

    } catch (error) {
      console.error(error);

      showError(
        error?.response?.data?.msg ||
        "Unable to submit review."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-overlay">
      <div className="review-modal">

        <h2>Rate Your Service</h2>

        <p>
          Please rate the service provided by{" "}
          <strong>{request?.technician?.name}</strong>
        </p>

        <StarRating
          rating={rating}
          onChange={setRating}
        />

        <textarea
          rows="5"
          placeholder="Write your review..."
          value={review}
          disabled={loading}
          onChange={(e) => setReview(e.target.value)}
        />

        <div className="review-actions">

          <button
            className="cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="submit-btn"
            onClick={submitReview}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>

        </div>

      </div>
    </div>
  );
}