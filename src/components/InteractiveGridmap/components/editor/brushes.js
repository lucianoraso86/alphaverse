import { useState } from "react";
import "./brushes.scss";

import SelectionIcon from "../../../../assets/images/icons/selection.js";
import DeleteIcon from "../../../../assets/images/icons/delete.js";
import Icon1 from "../../../../assets/images/icons/1x1.js";
import Icon2 from "../../../../assets/images/icons/2x2.js";
import Icon3 from "../../../../assets/images/icons/3x3.js";
import Icon4 from "../../../../assets/images/icons/4x4.js";
import Icon8 from "../../../../assets/images/icons/8x8.js";
import Icon16 from "../../../../assets/images/icons/16x16.js";

const Brushes = ({ editorMode, setBrushTool, setBrushSize }) => {
  const [tool, setTool] = useState(1);
  const [size, setSize] = useState(1);

  const handleTool = (tool) => {
    setTool(tool);
    setBrushTool(tool);
  };

  const handleSize = (size) => {
    setSize(size);
    setBrushSize(size);
  };

  return (
    <div className="brush-pointers">
      {editorMode && (
        <>
          <span onClick={() => handleTool(1)} className={tool === 1 ? "icon-active" : ""}>
            <SelectionIcon />
          </span>
          <span onClick={() => handleTool(2)} className={tool === 2 ? "icon-active" : ""}>
            <DeleteIcon />
          </span>
          <span>
            <div className="divider"></div>
          </span>
        </>
      )}
      
      <span onClick={() => handleSize(1)} className={size === 1 ? "icon-active" : ""}>
        <Icon1 />
      </span>
      <span onClick={() => handleSize(2)} className={size === 2 ? "icon-active" : ""}>
        <Icon2 />
      </span>
      <span onClick={() => handleSize(3)} className={size === 3 ? "icon-active" : ""}>
        <Icon3 />
      </span>
      <span onClick={() => handleSize(4)} className={size === 4 ? "icon-active" : ""}>
        <Icon4 />
      </span>
      <span onClick={() => handleSize(8)} className={size === 8 ? "icon-active" : ""}>
        <Icon8 />
      </span>
      <span onClick={() => handleSize(16)} className={size === 16 ? "icon-active" : ""}>
        <Icon16 />
      </span>
    </div>
  );
};

export default Brushes;
