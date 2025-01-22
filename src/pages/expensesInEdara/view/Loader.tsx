import React from "react";
import classes from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={classes["dot-spinner"]}>
      <div className={classes["dot-spinner__dot"]}></div>
      <div className={classes["dot-spinner__dot"]}></div>
      <div className={classes["dot-spinner__dot"]}></div>
      <div className={classes["dot-spinner__dot"]}></div>
      <div className={classes["dot-spinner__dot"]}></div>
      <div className={classes["dot-spinner__dot"]}></div>
      <div className={classes["dot-spinner__dot"]}></div>
      <div className={classes["dot-spinner__dot"]}></div>
    </div>
  );
};

export default Loader;
