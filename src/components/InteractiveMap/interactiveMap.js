import { Grid } from "@mui/material";

import InjectedSVG from "./injectedSVG";
import ListAreasCard from "./area/listArea";
import MiniStadium from "../../assets/images/miniStadium.svg";

import "./interactiveMap.scss";

const InteractiveMap = (props) => {
  const {
    activeDistrict,
    activeSection,
    activeArea,
    activeSector,
    listSection,
    listArea,
    handleChangeSection,
    handleChangeArea,
    handleChangeSector,
  } = props;

  return (
    <div className="stadium-container">
      <Grid container flexDirection="column" style={{ overflow: "inherit!important" }}>
        <div className="strech-section hidden-mobile">
          <Grid xs item container overflow="hidden" justifyContent="center" alignItems="center" sx={{ color: "white" }}>
            <div className="map-stadium">
              <InjectedSVG
                activeDistrict={activeDistrict}
                activeSection={activeSection}
                activeArea={activeArea}
                activeSector={activeSector}
                listSection={listSection}
                listArea={listArea}
                handleChangeSection={handleChangeSection}
                handleChangeArea={handleChangeArea}
                handleChangeSector={handleChangeSector}
              />
            </div>
          </Grid>
        </div>

        <div className="fit-section show-mobile">
          <Grid item xs px={1}>
            <div className="mobile-stadium">
              <img src={MiniStadium} alt="ministadium" />
            </div>
            <ListAreasCard idArea={activeArea?.code} listArea={listArea} handleArea={handleChangeArea} />
          </Grid>
        </div>
      </Grid>
    </div>
  );
};

export default InteractiveMap;
