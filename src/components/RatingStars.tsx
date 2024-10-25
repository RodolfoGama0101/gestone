import { IonIcon } from "@ionic/react";
import { star, starHalf, starOutline } from "ionicons/icons";
import React from "react";

interface RatingStarsProps {
  rating: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="star-rating">
      {Array.from({ length: fullStars }, (_, index) => (
        <IonIcon key={index} icon={star} className="star" color={"warning"} />
      ))}
      {hasHalfStar && (
        <IonIcon key={fullStars} icon={starHalf} className="star" color={"warning"} />
      )}
      {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }, (_, index) => (
        <IonIcon key={fullStars + (hasHalfStar ? index + 1 : index)} icon={starOutline} className="star" color={"warning"} />
      ))}
    </div>
  );
};

export default RatingStars;