import { Grid } from "@mui/material";

import Layout from "../../components/layout/layout";
import CountryMap from "../../components/countryMap/countryMap";
import HoryouLogo from "../../assets/images/logos/Horyou_logo_white.svg";

import "./country.scss";

const Country = () => {
  return (
    <Layout hideFooter logo={HoryouLogo}>
      <Grid container className="main main-grid">
        <div className="main-border">
          <CountryMap />
        </div>
      </Grid>
    </Layout>
  );
};

export default Country;
