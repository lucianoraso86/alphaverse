import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Grid, Select, MenuItem } from "@mui/material";

import AreaCard from "./area/area";

import "./stadium.scss";

const Stadium = ({ handleChangeStadium, handleChangeArea }) => {
  const [activeArea, setActiveArea] = useState(null);
  const [activeStadium, setActiveStadium] = useState("");

  const stadiumReducer = useSelector((state) => state.stadiumReducer);
  const [dataArea, setDataArea] = useState([]);
  const [dataStadium, setDataStadium] = useState([]);

  const handleArea = (id) => {
    setActiveArea(id);
    handleChangeArea(id);
  };

  const handleStadium = (evt) => {
    setActiveStadium(evt.target.value);
    handleChangeStadium(evt.target.value);
  };

  useEffect(() => {
    setDataStadium(stadiumReducer.stadiums);
    if (stadiumReducer?.stadiums?.length > 0) {
      // set the first option as active
      setActiveStadium(stadiumReducer.stadiums[0]._id);
      handleChangeStadium(stadiumReducer.stadiums[0]._id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stadiumReducer]);

  useEffect(() => {
    if (activeStadium && stadiumReducer) {
      const areas = stadiumReducer.stadiums.find(
        (x) => x._id === activeStadium
      ).areas;
      setDataArea(areas);

      if (areas?.length > 0) {
        setDataArea(areas);
        // set the first option as active
        setActiveArea(areas[0].code);
        handleChangeArea(areas[0].code);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStadium, stadiumReducer]);

  const area = dataArea.find((x) => x.code === activeArea);

  return (
    <div className="stadium-container">
      <Grid container className="alignment" flexDirection="column">
        <div className="fit-section">
          <Grid item xs>
            <Select
              value={activeStadium}
              onChange={handleStadium}
              className="select"
              inputProps={{
                MenuProps: {
                  disableScrollLock: true,
                  MenuListProps: {
                    sx: {
                      backgroundColor: "#000",
                      color: "#fff",
                      "& .MuiMenuItem-root": {
                        fontWeight: 400,
                        fontSize: "20px",
                        fontFamily: "Evogria",
                      },
                    },
                  },
                },
              }}
            >
              {dataStadium?.length > 0 &&
                dataStadium.map((option, pos) => (
                  <MenuItem value={option._id} key={pos}>
                    {option.name}
                  </MenuItem>
                ))}
            </Select>
          </Grid>
        </div>

        <div className="strech-section">
          <Grid item xs className="img-container">
              <img src={area?.image} alt="imagestadium" />
          </Grid>
        </div>

        <div className="fit-section">
          <Grid item xs>
            <AreaCard
              activeArea={activeArea}
              dataArea={dataArea}
              handleArea={handleArea}
            />
          </Grid>
        </div>

        <div className="fit-section">
          <Grid item container>
            <Grid item xs={"auto"}>
              <button
                key={1}
                className={activeStadium === "1" ? "active" : "btn"}
                id={"1"}
              >
                <p>STADIUM OUTDOOR</p>
              </button>
            </Grid>
            <Grid item xs textAlign="center">
              <p className="text">
                select the area where you <br />
                want to buy your seat
              </p>
            </Grid>
            <Grid item xs={"auto"}>
              <div className="indoor">
                <button className="btn" disabled>
                  <p>STADIUM INDOOR</p>
                </button>
                <span className="comming-text">COMMING SOON</span>
              </div>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </div>
  );
};

export default Stadium;
