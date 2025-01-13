import { useState } from "react";
import { Grid, Paper, FormControl, RadioGroup, FormControlLabel, Radio, FormLabel, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import "./filter.scss";

const Filter = ({ handleChange }) => {
  const [value, setValue] = useState("LOWPRICE");

  const handleChangeValue = (val) => {
    setValue(val);
    handleChange(val);
  };

  return (
    <Grid item container justifyContent="start" position="relative">
      <Grid item px={1}>
        <Paper className="title">
          <Typography component="p">SORT BY</Typography>
          <SearchIcon />
        </Paper>
      </Grid>

      <RadioGroup row name="FILTER" defaultValue="LOWPRICE" onChange={(evt) => handleChangeValue(evt.target.value)}>
        <Paper className="filter" style={{ marginRight: "5px" }}>
          <FormControl>
            <FormLabel className={value === "LOWPRICE" || value === "MAXPRICE" ? "optActive" : ""}>
              PRICE &nbsp;
              <span >
                {/*value === "LOWPRICE" ? "low to high" : "high to low"*/}
              </span>
            </FormLabel>
            <FormControlLabel
              value="LOWPRICE"
              control={<Radio icon={<PlayArrowIcon className="iconDown" />} checkedIcon={<PlayArrowIcon className="iconDown" />} />}
            />
            <FormControlLabel
              value="MAXPRICE"
              control={<Radio icon={<PlayArrowIcon className="iconUp" />} checkedIcon={<PlayArrowIcon className="iconUp" />} />}
            />
          </FormControl>
        </Paper>

        <Paper className="filter">
          <FormControl>
            <FormLabel className={value === "LOWAVAILABILITY" || value === "MAXAVAILABILITY" ? "optActive" : ""}>
              AVAILABILITY &nbsp;
              <span >
                {/*value === "LOWAVAILABILITY" ? "low to high" : "high to low"*/}
              </span>
            </FormLabel>
            <FormControlLabel
              value="LOWAVAILABILITY"
              control={<Radio icon={<PlayArrowIcon className="iconDown" />} checkedIcon={<PlayArrowIcon className="iconDown" />} />}
            />
            <FormControlLabel
              value="MAXAVAILABILITY"
              control={<Radio icon={<PlayArrowIcon className="iconUp" />} checkedIcon={<PlayArrowIcon className="iconUp" />} />}
            />
          </FormControl>
        </Paper>
      </RadioGroup>
    </Grid>
  );
};

export default Filter;
