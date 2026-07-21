import { FaStar } from "react-icons/fa";
import "../assets/css/components/starRating.css";

export default function StarRating({
  rating = 0,
  onChange,
  readOnly = false,
}) {

  return (

    <div className="star-rating">

      {[1, 2, 3, 4, 5].map((star) => (

        <FaStar
          key={star}
          className={
            star <= rating
              ? "star active"
              : "star"
          }
          onClick={() => {

            if (!readOnly && onChange) {

              onChange(star);

            }

          }}
        />

      ))}

    </div>

  );

}