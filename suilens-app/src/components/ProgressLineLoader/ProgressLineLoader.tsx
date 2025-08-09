import React from "react";
import "./ProgressLineLoader.scss";

const ProgressLineLoader: React.FC = () => {
  return (
    <div className="mdc-linear-progress">
      <div className="mdc-linear-progress__bar mdc-linear-progress__bar--primary">
        <span className="mdc-linear-progress__bar-inner"></span>
      </div>
    </div>
  );
};

export default ProgressLineLoader;