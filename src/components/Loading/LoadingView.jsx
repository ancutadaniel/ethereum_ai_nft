import React from "react";
import classes from "./LoadingView.module.css";

const LoadingView = ({ message }) => (
  <div className={classes.loading}>
    <p>{message}</p>
  </div>
);

export default LoadingView;
