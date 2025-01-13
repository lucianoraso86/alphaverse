import { Grid, Typography, Paper, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Carousel from "react-material-ui-carousel";
import CloseIcon from "../../../../assets/images/close-icon.svg";
//import EditIcon from "@mui/icons-material/Edit";

import Horyou1 from "../../../../assets/images/gridmap/Horyou_20.jpg";
import Horyou2 from "../../../../assets/images/gridmap/Horyou_19.jpg";
import Horyou3 from "../../../../assets/images/gridmap/Horyou_18.jpg";

import Indicator1 from "../../../../assets/images/icons/carrousel-1x1.svg";
import Indicator2 from "../../../../assets/images/icons/carrousel-2x1.svg";
import Indicator3 from "../../../../assets/images/icons/carrousel-2x2.svg";

import animation_url from "../../../../assets/images/gridmap/Nfts_Grass-1.m4v";
import animation_image from "../../../../assets/images/gridmap/NFTS_Pitch_parcel_back.jpg";

import CardDetail from "../../../cardDetail/cardDetail";

import "./sidePanel.scss";

const item = {
  animation_url: animation_url,
  currency: {
    __typename: "Currency",
    name: "Binance Coin",
    symbol: "BNB",
    image: "https://nft-backend-stage.alphaverse.com/public/images/currencies/bnb.png",
  },
  image: animation_image,
  price: 0.01,
  purchased: false,
};

const SidePanel = ({ activeSector, district, setActiveSector, visualKeys }) => {
  const navigate = useNavigate();

  const gotoEditorMode = () => {
    navigate("editor");
  };

  const handleClick = () => {
    //window.open("/", "_blank");
  };

  
  const neighborhood = district?.neighborhoods?.find((x) => x?.plots?.find((y) => y.key === activeSector?.key));
console.log(neighborhood)
  return (
    <>
      <Grid container className={`gridmap-sidebar ${activeSector ? "active-panel" : ""}`}>
        <Grid container item className="side-neighborhood">
          <Typography sx={{color: neighborhood?.color || "#fff"}}>{neighborhood?.name}</Typography>
        </Grid>
        <Grid container item className="side-container">
          <span className={`for-sale hidden-mobile`} style={{ opacity: 1, zIndex: 10 }}>
            For sale
          </span>

          <Grid item>
            <button className={"btn-close-panel"} onClick={() => setActiveSector(null)}>
              <img src={CloseIcon} alt="closeicon" />
            </button>
          </Grid>

          <Grid item width={"100%"}>
            <Carousel
              animation="slide"
              className="sidebar-carousel"
              indicatorContainerProps={{
                style: {
                  position: "absolute",
                  zIndex: 1,
                  bottom: 0,
                },
              }}
              indicatorIconButtonProps={{
                style: {
                  color: "#ffffff",
                },
              }}
              activeIndicatorIconButtonProps={{
                style: {
                  color: "#51FF00",
                },
              }}
            >
              <Paper>
                <img className="carousel-item" src={Horyou1} alt="item_1" />
                <img className="carousel-indicator" src={Indicator1} alt="indicator_1x1" />
              </Paper>
              <Paper>
                <img className="carousel-item" src={Horyou2} alt="item_2" />
                <img className="carousel-indicator" src={Indicator2} alt="indicator_2x1" />
              </Paper>
              <Paper>
                <img className="carousel-item" src={Horyou3} alt="item_3" />
                <img className="carousel-indicator" src={Indicator3} alt="indicator_2x3" />
              </Paper>
            </Carousel>
          </Grid>

          <Grid item>
            <Typography className="side-info" p={0} pt={2}>
              you can <span className="info-yellow">build</span> bigger buildings if
            </Typography>
            <Typography className="side-info" p={0}>
              you <span className="info-green">buy</span> adjacent land
            </Typography>
          </Grid>

          <Grid item>
            <Typography className="side-title" px={1} py={2}>
              Sector <span>{visualKeys[activeSector?.key]}</span>
            </Typography>
          </Grid>

          <Grid item>
            <Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
              <CardDetail item={item} handleClick={handleClick} />
              <button className="btn top" onClick={handleClick}>
                BUY
              </button>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Grid container item className={`side-actions ${activeSector ? "slide-actions" : ""}`}>
        <div className="leyend">
          <span>
            <span onClick={gotoEditorMode} className="indicator green"></span> for sale
          </span>
          <span>
            <span className="indicator gray"></span> coming soon
          </span>
          <span>
            <span className="indicator red"></span> sold
          </span>
        </div>

        {/*
        <Button variant="contained" endIcon={<EditIcon />} onClick={gotoEditorMode}>
          Editor Mode
        </Button>
          */}
      </Grid>
    </>
  );
};

export default SidePanel;
