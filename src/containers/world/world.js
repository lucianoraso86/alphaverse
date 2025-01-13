import { useState } from "react";
import { Grid } from "@mui/material";

import Layout from "../../components/layout/layout";
import WorldMap from "../../components/worldMap/worldMap";
import HoryouLogo from "../../assets/images/logos/Horyou_logo_white.svg";

import "./world.scss";
import ListCountries from "../../components/worldMap/listCountries";

const World = () => {
  const [countryOver, setCountryOver] = useState({ code: null, enable: false });
  return (
    <Layout hideFooter logo={HoryouLogo}>
      <Grid container className="main main-grid">
        <div className="main-border">
          <div className="world-list">
            <ListCountries setCountryOver={setCountryOver} />
          </div>
          <WorldMap countryOver={countryOver} />
        </div>
      </Grid>
    </Layout>
  );
};

export default World;
