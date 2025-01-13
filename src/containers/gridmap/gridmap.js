import { Grid } from "@mui/material";

import Layout from "../../components/layout/layout";
import InteractiveGridmap from "../../components/InteractiveGridmap/interactiveGridmap";
import HoryouLogo from "../../assets/images/logos/Horyou_logo_white.svg";

import "./gridmap.scss";

const Gridmap = () => {
  return (
    <Layout hideFooter logo={HoryouLogo}>
      <Grid container className="main main-grid">
        <div className="main-border">
          <InteractiveGridmap />
        </div>
      </Grid>
    </Layout>
  );
};

export default Gridmap;
