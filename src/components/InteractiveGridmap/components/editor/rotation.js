import { useState } from "react";

import { Grid, Box, Button, Typography, Slider } from "@mui/material";

import CloseIcon from "../../../../assets/images/close-icon.svg";
import DoneIcon from "@mui/icons-material/Done";

import Rotate90DegreesCwIcon from "@mui/icons-material/Rotate90DegreesCw";
import FlipIcon from "@mui/icons-material/Flip";

import { POST_DISTRICT } from "../../../../services/districts";
import { useMutation } from "@apollo/client";

import "./rotation.scss";

const Rotation = ({ open, setOpen, position, setPosition, country, district }) => {
  const [rotation, setRotation] = useState(position.rotation || 0);
  const [horizontalFlip, setHorizontalFlip] = useState(position.flipH || false);
  const [verticalFlip, setVerticalFlip] = useState(position.flipV || false);
  const [originalPosition, setOriginalPosition] = useState(position);

  const [postDistrict] = useMutation(POST_DISTRICT);

  const handleCancel = () => {
    setOpen(false);
    setRotation(originalPosition.rotation);
    setHorizontalFlip(originalPosition.flipH);
    setVerticalFlip(originalPosition.flipV);
    setPosition(originalPosition);
  };

  const handleSetRotation = () => {
    setOpen(false);
    setOriginalPosition(position);

    const input = {
      country_id: country.id,
      district_id: district.id,
      rotation: `${rotation}`,
      flip_h: horizontalFlip,
      flip_v: verticalFlip,
    };

    postDistrict({ variables: { input } });
  };

  const calculateRotation = () => {
    const newRotation = rotation + 90;
    if (newRotation >= 360) {
      setRotation(0);
      setPosition((prev) => ({ ...prev, rotation: 0 }));
    } else {
      setRotation(newRotation);
      setPosition((prev) => ({ ...prev, rotation: newRotation }));
    }
  };

  const handleRotation = (evt, newRotation) => {
    setRotation(newRotation);
    setPosition((prev) => ({ ...prev, rotation: newRotation }));
    //}
  };

  const toggleFlipH = () => {
    setPosition((prev) => ({ ...prev, flipH: !horizontalFlip }));
    setHorizontalFlip(!horizontalFlip);
  };

  const toggleFlipV = () => {
    setPosition((prev) => ({ ...prev, flipV: !verticalFlip }));
    setVerticalFlip(!verticalFlip);
  };

  const handleReset = () => {
    setRotation(0);
    setHorizontalFlip(false);
    setVerticalFlip(false);
    setPosition({ rotation: 0, flipH: false, flipV: false });
  };

  return (
    <Grid container item className={`gridmap-editor ${open ? "active-panel" : ""}`}>
      <Grid item width={"100%"} p={1}>
        <button className="btn-close" onClick={handleCancel}>
          <img src={CloseIcon} alt="closeicon" />
        </button>

        <Typography className="rotation-title" pb={1}>
          Rotation
        </Typography>
        <Box className="actionContainer">
          <Box className="actionButtons">
            <Button
              variant="contained"
              endIcon={
                <Rotate90DegreesCwIcon
                  className={rotation === 90 ? "rotate90" : rotation === 180 ? "rotate180" : rotation === 270 ? "rotate270" : ""}
                />
              }
              color={rotation ? "success" : "primary"}
              onClick={calculateRotation}
            >
              Rotate
            </Button>
            <Slider
              defaultValue={0}
              valueLabelDisplay="auto"
              value={rotation}
              onChange={handleRotation}
              step={90}
              marks
              min={0}
              max={270}
            />
          </Box>

          <Box className="actionLabels">
            <Typography>Rotation: {rotation === 0 ? "None" : rotation + "°"}</Typography>
          </Box>
        </Box>

        <Typography className="rotation-title" pt={2} pb={1}>
          Flip
        </Typography>

        <Box className="actionContainer">
          <Box className="actionButtons">
            <Button
              variant="contained"
              color={verticalFlip ? "success" : "primary"}
              endIcon={<FlipIcon className={verticalFlip ? "rotate180" : ""} />}
              onClick={toggleFlipV}
            >
              Vertical Flip
            </Button>
            <Button
              variant="contained"
              color={horizontalFlip ? "success" : "primary"}
              endIcon={<FlipIcon className={horizontalFlip ? "rotate90" : "rotate-90"} />}
              onClick={toggleFlipH}
            >
              Horizontal Flip
            </Button>
          </Box>

          <Box className="actionLabels">
            <Typography>
              Flip: {horizontalFlip && verticalFlip ? "Both" : horizontalFlip ? "Horizontal" : verticalFlip ? "Vertical" : "None"}
            </Typography>
          </Box>
        </Box>

        <Box pt={2} display={"flex"} gap={"10px"} justifyContent={"end"}>
          <Button variant="contained" color="error" onClick={handleReset}>
            Reset default
          </Button>
          <Button variant="contained" onClick={handleSetRotation} endIcon={<DoneIcon />}>
            Save
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Rotation;
