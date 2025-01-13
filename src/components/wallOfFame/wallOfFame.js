import { useState, useEffect } from "react";
import { Grid, Select, MenuItem } from "@mui/material";
import walloffameImg from "../../../src/assets/images/walloffame.png";
import starImg from "../../../src/assets/images/star.svg";
import SpotButtons from "../../components/spotButtons/spotButtons";

import "./wallOfFame.scss";
import { useSelector } from "react-redux";

const WallOfFame = ({ handleChangeStadium }) => {
  const [activeStadium, setActiveStadium] = useState("");
  const [dataStadium, setDataStadium] = useState([]);
  const [activeStar, setActiveStar] = useState(null);

  const stadiumReducer = useSelector((state) => state.stadiumReducer);

  const rows = [
    { name: "club fundation", id: "1" },
    { name: "1st stadium", id: "2" },
    { name: "1st team photo", id: "3" },
    { name: "1st president/team", id: "4" },
    { name: "1st mayor trophy", id: "5" },
    { name: "1st club legend", id: "6" },
    { name: "one major event of 60s-80s", id: "7" },
    { name: "one major event of 90s-00s", id: "8" },
    { name: "another club legend", id: "9" },
    { name: "a coach legend", id: "10" },
    { name: "one mayor event of the last decade", id: "11" },
    { name: "opening of current stadium", id: "12" },
    { name: "last trophy won", id: "13" },
    { name: "most important game of the last 2 years", id: "14" },
    { name: "current pro team photo", id: "15" },
    { name: "current youth team photo", id: "16" },
    { name: "current female team photo", id: "17" },
  ];
  useEffect(() => {
    setDataStadium(stadiumReducer.stadiums);
    if (stadiumReducer?.stadiums?.length > 0) {
      setActiveStadium(stadiumReducer.stadiums[0]._id);
      handleChangeStadium(stadiumReducer.stadiums[0]._id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stadiumReducer]);


  const handleStadium = (evt) => {
    setActiveStadium(evt.target.value);
    handleChangeStadium(evt.target.value);
  };

  const handleClick = () => {
    setActiveStar(true);
  };

  return (
    <>
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
              <img src={walloffameImg} alt="imagestadium" />
            </Grid>
          </div>

          <div className="fit-section">
            <Grid container>
              {rows.map((row) => (
                <Grid item xs={2} sm={2}>
                  <button
                    className={activeStar === true ? "box-text" : "box-text"}
                    onClick={() => handleClick()}
                  >
                    <img className="small-star" src={starImg} alt="small-star" />
                    <span className="wall-text">{row.name}</span>
                  </button>
                </Grid>
              ))}
            </Grid>
            <div className="fit-section">
              <SpotButtons/>
            </div>
          </div>
        </Grid>
      </div>
    </>
  );
};

export default WallOfFame;
