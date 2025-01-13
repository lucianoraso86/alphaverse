import { useState } from "react";

import { ListItemText, MenuItem, FormControl, OutlinedInput, InputLabel } from "@mui/material";
import { Grid, Box, Button, Typography } from "@mui/material";
import Select from "@mui/material/Select";

import LogoutIcon from "@mui/icons-material/Logout";
//import DownloadIcon from "@mui/icons-material/Download";
import DoneIcon from "@mui/icons-material/Done";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CloseIcon from "../../../../assets/images/close-icon.svg";
import Rotate90DegreesCwIcon from "@mui/icons-material/Rotate90DegreesCw";

import Brushes from "./brushes";
import Neighborhood from "./neighborhoods";
import Rotation from "./rotation";

import { POST_PLOT } from "../../../../services/plots";
import { useMutation } from "@apollo/client";

import "./editorPanel.scss";

const STATUS = { AVAILABLE: 1, SOLD: 2, COMMING_SOON: 3 };

const EditorPanel = ({
  selectedPaths,
  setSelectedPaths,
  setStatusPaths,
  exitEditor,
  setBrushTool,
  setBrushSize,
  actualStatus,
  setActualStatus,
  setPosition,
  position,
  statusPaths,
  district,
  country,
  visualKeys
}) => {
  const [postPlot] = useMutation(POST_PLOT);
  const [modalNeighborhood, setModalNeighborhood] = useState(false);
  const [openRotation, setOpenRotation] = useState(false);

  const handleSetPaths = (evt) => {
    evt.preventDefault();

    const sectors = [];
    selectedPaths.forEach((item) => {
      const activePath = statusPaths?.find((x) => x.key === item.key);
      if (activePath) {
        const path = {
          country_id: country.id,
          district_id: district.id,
          neighborhood_id: activePath.neighborhood_id,
          plot_key: item.key,
          open: actualStatus === STATUS.COMMING_SOON ? false : true,
          sold: actualStatus === STATUS.SOLD ? true : false,
        };

        sectors.push(path);
      }
    });

    if (sectors.length) postPlot({ variables: { input: sectors } });

    setStatusPaths(
      statusPaths.map((item) => {
        if (selectedPaths.find((x) => x.key === item.key)) {
          return {
            ...item,
            open: actualStatus === STATUS.COMMING_SOON ? false : true,
            sold: actualStatus === STATUS.SOLD ? true : false,
          };
        }
        return item;
      })
    );

    setSelectedPaths([]);
  };

  // editor events ---
  const handleCancelPaths = () => {
    setSelectedPaths([]);
  };

  /*const handleDownloadData = () => {
    const cells = [];
    selectedPaths.forEach((item) => {
      const data = { key: item.key };
      cells.push(data);
    });

    const formatData = JSON.stringify(cells, null, "  ");

    const element = document.createElement("a");
    const file = new Blob([formatData], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "sectors.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };*/

  const handleChangeStatus = (event) => {
    const activeStatus = event.target.value;
    const sectors = selectedPaths;
    sectors.forEach((sector) => {
      sector.open = activeStatus === STATUS.COMMING_SOON ? false : true;
      sector.sold = activeStatus === STATUS.SOLD ? true : false;
    });

    setSelectedPaths(sectors);
    setActualStatus(activeStatus);
  };

  const handleCloseModal = () => {
    setModalNeighborhood(false);
  };

  return (
    <>
      <Grid container item className={`gridmap-editor ${selectedPaths?.length ? "active-panel" : ""}`}>
        <Grid item width={"100%"}>
          <button className="btn-close" onClick={handleCancelPaths}>
            <img src={CloseIcon} alt="closeicon" />
          </button>
          <div className="container-title">
            <Typography className="editor-title">
              Sector{selectedPaths.length > 1 ? "s" : ""} ({selectedPaths.length})
            </Typography>
            <div className="list-title">
              {selectedPaths.map((element, pos) => (
                <span key={pos}>{visualKeys[element?.key]}</span>
              ))}
            </div>
          </div>

          <Box p={1} component="form" autoComplete="off">
            <Box pt={2} display={"flex"}>
              <FormControl fullWidth size="small">
                <InputLabel className="label-category">Status</InputLabel>
                <Select
                  input={<OutlinedInput label="Status" />}
                  className="select-category"
                  value={actualStatus}
                  onChange={handleChangeStatus}
                >
                  <MenuItem key={1} value={1}>
                    <div className="square-color" style={{ backgroundColor: "#15ff00" }}></div>
                    <ListItemText primary="Available" />
                  </MenuItem>
                  <MenuItem key={2} value={2}>
                    <div className="square-color" style={{ backgroundColor: "#d10000" }}></div>
                    <ListItemText primary="Sold" />
                  </MenuItem>
                  <MenuItem key={3} value={3}>
                    <div className="square-color" style={{ backgroundColor: "#000000" }}></div>
                    <ListItemText primary="Coming soon" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box pt={2} display={"flex"} justifyContent={"end"}>
              <Button variant="contained" onClick={handleSetPaths} endIcon={<DoneIcon />}>
                Set and save
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid container item>
        <Neighborhood open={modalNeighborhood} handleClose={handleCloseModal} country={country} district={district} />
      </Grid>

      <Grid container item>
        <Rotation
          open={openRotation}
          setOpen={setOpenRotation}
          position={position}
          setPosition={setPosition}
          country={country}
          district={district}
        />
      </Grid>

      <Grid container item className="editor-actions">
        <Brushes editorMode={true} setBrushSize={setBrushSize} setBrushTool={setBrushTool} />

        <div className="actions">
          <Typography px={1}>Editor mode</Typography>
          {/*
            <Button variant="contained" color="success" onClick={handleDownloadData}>
              <DownloadIcon />
            </Button>
          */}

          <Button variant="contained" endIcon={<Rotate90DegreesCwIcon />} onClick={() => setOpenRotation(true)}>
            Rotation
          </Button>
          <Button variant="contained" endIcon={<FormatListBulletedIcon />} onClick={() => setModalNeighborhood(true)}>
            Neighborhood
          </Button>
          <Button variant="contained" color="error" endIcon={<LogoutIcon />} onClick={exitEditor}>
            Exit
          </Button>
        </div>
      </Grid>
    </>
  );
};

export default EditorPanel;
