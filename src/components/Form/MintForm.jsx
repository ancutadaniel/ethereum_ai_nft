import React from "react";

import classes from './MintForm.module.css';
import Button from "../UI/Button";

const MintForm = ({ updateMetadata, handleSubmit, isWaiting }) => {
  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <input
        type="text"
        placeholder="Name your creation..."
        onChange={(e) => updateMetadata("name", e.target.value)}
      />
      <input
        type="text"
        placeholder="Describe your creation..."
        onChange={(e) => updateMetadata("description", e.target.value)}
      />
      <Button type="submit" disabled={isWaiting}>Create & Mint</Button>
    </form>
  );
};

export default MintForm;
