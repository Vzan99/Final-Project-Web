declare module "react-star-ratings" {
  import * as React from "react";

  interface StarRatingsProps {
    rating: number;
    changeRating?: (newRating: number) => void;
    numberOfStars?: number;
    starDimension?: string;
    starSpacing?: string;
    starRatedColor?: string;
    starHoverColor?: string;
    starEmptyColor?: string;
    name: string;
  }

  export default class StarRatings extends React.Component<StarRatingsProps> {}
}
