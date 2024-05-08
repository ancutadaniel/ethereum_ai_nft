import React from "react";

import classes from "./ImageView.module.css";
import LoadingView from "../Loading/LoadingView";

import { MESSAGES } from "../../constants/messages.js"; 

const ImageView = ({ image, status }) => {
  if (status.message !== MESSAGES.mintComplete) return <LoadingView message={status.message} />;

  return (
    <div className={classes.image}>
      <img src={image} alt="AI generated" />
    </div>
  );
};

export default ImageView;
