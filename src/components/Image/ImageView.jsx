import React from "react";

import classes from "./ImageView.module.css";
import LoadingView from "../Loading/LoadingView";

import { MESSAGES } from "../../constants/messages.js";

const ImageView = ({ image, status }) => {
  // Show loading whenever we're waiting
  if (status.isWaiting) {
    return <LoadingView message={status.message} />;
  }

  // No image yet
  if (!image) {
    return <p className={classes.placeholder}>{MESSAGES.noImageGenerated}</p>;
  }

  // Show image with the latest message
  return (
    <div className={classes.image}>
      <p className={classes.message}>{status.message}</p>
      <img src={image} alt="AI generated" />
    </div>
  );
};

export default ImageView;
