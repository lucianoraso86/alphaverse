import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Grid } from "@mui/material";

import Layout from "../../components/layout/layout";
import Seats from "../../components/seats/seats";

import ModalStadium from "../../components/modal/modalStadium";

import WallOfFame from "../../components/wallOfFame/wallOfFame";
import "./wallOfFamePage.scss";

import { getDistricts } from "../../redux/actions/districtActions";

const WallOfFamePage = () => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [activeStadium, setActiveStadium] = useState(null);
  const [activeArea, setActiveArea] = useState(null);
  const [activeSeat, setActiveSeat] = useState({});

  const handleChangeStadium = (idStadium) => {
    setActiveStadium(idStadium);
  };

  /*const handleChangeArea = (idArea) => {
    setActiveArea(idArea);
  };*/

  const handleBackView = () => {
    setActiveArea(null);
  };

  useEffect(() => {
    dispatch(getDistricts());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout hideFooter>
      <Grid container className="main-container">
        <Grid
          container
          item
          xs={12}
          sm={12}
          md={7}
          lg={8}
          className={`bg-stadium grid-stadium ${
            activeArea ? "areaActive" : ""
          }`}
        >
          <WallOfFame handleChangeStadium={handleChangeStadium} />
          <ModalStadium
            walloffameseattype={true}
            open={openModal}
            activeSeat={activeSeat}
            setOpen={setOpenModal}
          />
        </Grid>
        <Grid
          container
          item
          xs={12}
          sm={12}
          md={5}
          lg={4}
          className={`bg-seats grid-seats ${activeArea ? "areaActive" : ""}`}
        >
          <Seats
            walloffameseattype={true}
            activeArea={activeArea}
            activeStadium={activeStadium}
            setOpenModal={setOpenModal}
            setSeatActive={setActiveSeat}
            handleBackView={handleBackView}
          />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default WallOfFamePage;
