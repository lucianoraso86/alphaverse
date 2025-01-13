import { Grid, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { GET_COUNTRIES } from "../../services/countries";
import { useQuery } from "@apollo/client";
import "./listCountries.scss";

const ListCountries = ({ setCountryOver }) => {
  const navigate = useNavigate();

  const handleChangeCountry = (evt) => {
    const code = evt.target.value;

    const country = countries.find((x) => x.code === code);
    if (country?.enable) {
      setCountry(code);
      navigate(code);
    } else {
      setCountryOver({ code: null, enable: false });
    }
  };

  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);

  // get data ---
  const { data: getResponse } = useQuery(GET_COUNTRIES);

  useEffect(() => {
    if (getResponse?.countries) setCountries(getResponse.countries);
  }, [getResponse]);

  return (
    <Grid item container>
      <Grid item xs="auto" pt={2} pl={1}>
        <Select
          value={country}
          onChange={handleChangeCountry}
          className="select"
          displayEmpty
          renderValue={country !== "" ? undefined : () => "District"}
          inputProps={{
            MenuProps: {
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
          {countries.length > 0 &&
            countries.map((country) => {
              const color = country?.enable ? "#4BA300" : "#6B0C0C";
              return (
                <MenuItem
                  value={country?.code}
                  key={country?.code}
                  sx={{ backgroundColor: `${color}!important`, margin: "5px 0" }}
                  onMouseOver={() => setCountryOver(country)}
                  onMouseLeave={() => setCountryOver({ code: null, enable: false })}
                >
                  {country.name}
                </MenuItem>
              );
            })}
        </Select>
      </Grid>
    </Grid>
  );
};

export default ListCountries;
