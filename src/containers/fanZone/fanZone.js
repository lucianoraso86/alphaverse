import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Grid, Select, MenuItem } from "@mui/material";

import Layout from "../../components/layout/layout";
import ListNFTs from "../../components/nft/listNFTs";
import ModalStadium from "../../components/modal/modalStadium";
import InteractiveMap from "../../components/InteractiveMap/interactiveMap";
import SectionButtons from "../../components/sectionButtons/sectionButtons";
import CloseIcon from "../../assets/images/close-icon.svg";
import FAVLogo from "../../assets/images/logos/FAV_logo_white.svg";

import { useQuery } from "@apollo/client";
import { GET_DISTRICTS } from "../../services/districts";

import "./fanZone.scss";

const FanZone = () => {
  const [openModal, setOpenModal] = useState(false);
  const [activeNftsView, setActiveNftsView] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);

  // id for select
  const [codeDistrict, setCodeDistrict] = useState("");

  // list data
  const [listDistrict, setListDistrict] = useState([]);
  const [listSection, setListSection] = useState([]);
  const [listArea, setListArea] = useState([]);

  // selected data
  const [activeDistrict, setActiveDistrict] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [activeArea, setActiveArea] = useState(null);
  const [activeSector, setActiveSector] = useState(null);
  const [activeNFT, setActiveNFT] = useState({});
  
  const { data } = useQuery(GET_DISTRICTS, {
    variables: {
      district_type: "stadium",
    },
  });
  // reducer
  const districtReducer = useSelector((state) => state.districtReducer);

  const handleChangeDistrict = (codeDistrict) => {
    setCodeDistrict(codeDistrict);
    setActiveDistrict(() => listDistrict.find((x) => x.code === codeDistrict));
  };

  const handleChangeSection = (section) => {
    setOpenPanel(false);
    setActiveArea(null);
    setActiveSection(section);
  };

  const handleChangeArea = (area) => {
    setActiveArea(area);
    if (window.innerWidth < 900) {
      // only mobile
      setActiveNftsView(true);
      setActiveSector(null);
    }
  };

  const handleChangeSector = (sector) => {
    if (sector) {
      setActiveSector(sector);
      setOpenPanel(true);
    } else {
      setActiveSector(null);
      setOpenPanel(false);
    }
  };

  const handleBackView = () => {
    setActiveNftsView(false);
  };

  const handleClosePanel = () => {
    setOpenPanel(false);
    setActiveArea(null);
    setActiveSector(null);
  };

  // load and set data
  useEffect(() => {
    if (window.innerWidth < 900) setOpenPanel(true);
  }, []);

  useEffect(() => {
    setListDistrict(data);
    if (data?.districts.length > 0) {
      setCodeDistrict(data.districts[0].code);
      setActiveDistrict(data.districts[0]);
    }
  }, [districtReducer, data]);

  useEffect(() => {
    if (activeDistrict?.code) {
      const sections = activeDistrict.sections;
      if (sections?.length > 0) {
        setListSection(sections);

        const firstSection = sections[0];
        if (firstSection?.code) {
          // set the first option as active
          setActiveSection(firstSection);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDistrict]);

  useEffect(() => {
    if (activeSection?.code) {
      const areas = activeSection.areas;
      if (areas?.length > 0) {
        setListArea(areas);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  return (
    <Layout hideFooter logo={FAVLogo}>
      <Grid container className="main main-fanzone">
        <div className="main-border">
          <Grid
            container
            item
            xs={12}
            className={`bg-stadium grid-stadium ${
              activeNftsView ? "areaActive" : ""
            } ${openPanel ? "slideActive" : ""}`}
            flexDirection="column"
          >
            <div className="fit-section">
              <Grid item container>
                <Grid item xs="auto" pt={2} pl={1}>
                  <Select
                    value={codeDistrict}
                    onChange={handleChangeDistrict}
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
                    {listDistrict?.districts?.length > 0 &&
                      listDistrict.districts.map((option, pos) => (
                        <MenuItem value={option.code} key={pos}>
                          {option.name}
                        </MenuItem>
                      ))}
                  </Select>

                  {activeArea && !activeArea?.open && (
                    <div className="info-container coming-soon hidden-mobile">
                      <p className="coming-soon">
                        coming soon {activeArea?.name} area
                      </p>
                    </div>
                  )}

                  {activeArea?.open &&
                    activeArea?.purchased_nfts === activeArea?.nfts && (
                      <div className="info-container soldout hidden-mobile">
                        <p className="soldout">
                          this area has been sold <span className="sold-img" />
                        </p>
                      </div>
                    )}
                </Grid>
              </Grid>
            </div>

            <div className="strech-section">
              <InteractiveMap
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

            <div className="fit-section show-mobile">
              <SectionButtons
                listSection={listSection}
                activeSection={activeSection}
                handleChangeSection={handleChangeSection}
              />
            </div>

            <ModalStadium
              open={openModal}
              activeNFT={activeNFT}
              openPanel={openPanel}
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
            className={`slide-panel bg-seats grid-seats ${
              activeNftsView ? "areaActive" : ""
            } ${openPanel ? "slideActive" : ""}`}
          >
            <button className={"btn-close"} onClick={handleClosePanel}>
              <img src={CloseIcon} alt="closeicon" />
            </button>

            <ListNFTs
              activeDistrict={activeDistrict}
              activeSection={activeSection}
              activeArea={activeArea}
              activeSector={activeSector}
              setDataNFT={setActiveNFT}
              setOpenModal={setOpenModal}
              handleBackView={handleBackView}
            />
          </Grid>
        </div>
      </Grid>
    </Layout>
  );
};

export default FanZone;
