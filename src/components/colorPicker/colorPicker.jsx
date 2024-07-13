import React, { useState } from "react";
import { ChromePicker } from "react-color";

function ColorPicker({ scene }) {
  const [state, setState] = useState({
    background: "#fff",
  });
  const handleChange = (color) => {
    setState({ background: color.hex });

    scene.traverse(function (element) {
      if (element.name === "Paint_Paint_0") {
        element.material.color.set(color.hex);
      }
      if (element.name === "DoorLF_Interior_InteriorBase_0002") {
        element.material.color.set(color.hex);
      }

      if (element.name === "Interior_InteriorBaseOpacity_0") {
        element.material.color.set(color.hex);
      }
    });
  };
  return (
    <div className="bye">
      <ChromePicker color={state.background} onChange={handleChange} />
    </div>
  );
}

export default ColorPicker;
