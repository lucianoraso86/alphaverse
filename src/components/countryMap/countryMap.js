import { Grid, Typography, Stack } from "@mui/material";
import { ZoomIn, ZoomOut } from "@mui/icons-material";
import CropFreeIcon from "@mui/icons-material/CropFree";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useElementSize } from "usehooks-ts";
import { ReactSVGPanZoom, TOOL_AUTO, INITIAL_VALUE } from "react-svg-pan-zoom";
import { ReactSvgPanZoomLoader } from "react-svg-pan-zoom-loader";
import waitForElement from "../../hooks/waitForElement";
import StatusBox from "../statusBox/statusBox";

import HugeIcon from "../../assets/images/icons/country-huge.svg";
import LargeIcon from "../../assets/images/icons/country-large.svg";
import MediumIcon from "../../assets/images/icons/country-medium.svg";
import SmallIcon from "../../assets/images/icons/country-small.svg";

//import FranceMapSVG from "../../assets/images/maps/franceMap.svg";
import BackArrow from "../../assets/images/icons/backArrow.svg";
import FlagLogo from "../../assets/images/flag-france.svg";

import { GET_COUNTRY } from "../../services/countries";
import { useQuery } from "@apollo/client";

import "./countryMap.scss";

const MAX_FACTOR = 4;

const CountryMap = () => {
  const Viewer = useRef(null);
  const navigate = useNavigate();
  const params = useParams();

  const [containerRef, { width, height }] = useElementSize();

  const [mapContainer, setMapContainer] = useState(null);
  const [svgMap, setSvgMap] = useState(false);
  const [svgMiniMap, setSvgMiniMap] = useState(false);
  const [value, setValue] = useState(INITIAL_VALUE);
  const [tool, setTool] = useState(TOOL_AUTO);

  const [svgDimensions, setSvgDimensions] = useState({ width: 1515, height: 1273 });
  const [hoverDistrict, setHoverDistrict] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [country, setCountry] = useState([]);

  // get data ---
  const { data: getCountry } = useQuery(GET_COUNTRY, {
    variables: {
      countryCode: countryCode,
    },
    skip: !countryCode,
  });

  // load map and data ---
  useEffect(() => {
    if (country?.map) {
      const img = new Image();
      const blob = new Blob([country?.map], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      img.src = url;

      img.onload = (event) => {
        setSvgMap(url);
        const { naturalWidth, naturalHeight } = event.target;
        setSvgDimensions({ width: naturalWidth, height: naturalHeight });

        waitForElement(".injected-svg").then((element) => {
          _fitCenter();
          setMapContainer(element);
        });
      };
    }
    if (country?.miniMap) {
      const blob2 = new Blob([country?.miniMap], { type: "image/svg+xml" });
      const url2 = URL.createObjectURL(blob2);
      setSvgMiniMap(url2);
    }
  }, [country?.map, country?.miniMap]);

  useEffect(() => {
    setCountry(getCountry?.country || []);
  }, [getCountry]);

  // onChange map, load events ---
  useEffect(() => {
    if (mapContainer && country?.districts?.length) {
      country.districts.forEach((district) => {
        const elements = mapContainer.querySelectorAll(`[data-district="${district.code}"]`);
        if (elements) _setSectionEvents(elements, district);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapContainer, country]);

  const _setSectionEvents = (elements, district) => {
    elements.forEach(async (path) => {
      path.addEventListener("click", () => {
        if (district?.code && district?.open) navigate(district?.code);
      });

      path.addEventListener("mouseover", () => {
        const color = district.open ? "#15cc00" : district.sold ? "#cc1500" : "#888888";
        setHoverDistrict({
          ...district,
          color,
          open: district.open || district.sold,
          type: "District",
          total: district.neighborhoodAvailability,
          quantity: district.neighborhoodSize,
        });
      });

      path.addEventListener("mouseleave", () => {
        setHoverDistrict(false);
      });

      path.classList.add("inteactivePath");
    });
  };

  useEffect(() => {
    setCountryCode(params?.country);
  }, [params?.country]);

  // zoom events ---
  const _zoomIn = () => {
    Viewer.current.zoomOnViewerCenter(1.1);
  };

  const _zoomOut = () => {
    Viewer.current.zoomOnViewerCenter(0.9);
  };

  const _fitCenter = () => {
    Viewer.current?.fitToViewer("center", "center");
  };

  if (!svgMap) {
    return (
      <Grid container justifyContent={"center"} p={2}>
        <span>loading map...</span>
      </Grid>
    );
  }

  return (
    <div ref={containerRef} style={{ height: "100%", width: "100%" }}>
      <Grid item className="container-flag">
        <Typography>{country?.name}</Typography>

        <img src={FlagLogo} alt="flagLogo" />

        <Grid item className="back-button" onClick={() => navigate(`/world`)}>
          <Typography>go back to the map</Typography>
          <img src={BackArrow} alt="backArrow" />
        </Grid>
      </Grid>

      <Grid item className="custom-toolbar">
        <ZoomIn onClick={_zoomIn} />
        <ZoomOut onClick={_zoomOut} />
        <CropFreeIcon onClick={_fitCenter} />
      </Grid>

      <Grid item className="district-size">
        <Stack>
          <Typography component={"span"}>
            huge <img src={HugeIcon} alt="HugeIcon" />
          </Typography>
          <Typography component={"span"}>
            large <img src={LargeIcon} alt="LargeIcon" />
          </Typography>
          <Typography component={"span"}>
            medium <img src={MediumIcon} alt="MediumIcon" />
          </Typography>
          <Typography component={"span"}>
            small <img src={SmallIcon} alt="SmallIcon" />
          </Typography>
        </Stack>
      </Grid>

      <Grid item className="container-minimap">
        <Grid className="minimap">
          <img src={svgMiniMap} alt="minimap" />
        </Grid>
        {hoverDistrict && <StatusBox item={hoverDistrict} />}
      </Grid>

      <ReactSvgPanZoomLoader
        src={svgMap}
        render={(content) => {
          return (
            <ReactSVGPanZoom
              ref={Viewer}
              value={value}
              tool={tool}
              onChangeValue={setValue}
              onChangeTool={setTool}
              width={width || 1515}
              height={height || 1273}
              SVGBackground={"transparent"}
              background={"transparent"}
              scaleFactorMax={MAX_FACTOR}
              scaleFactorMin={0.5}
              miniatureProps={{
                position: "none",
              }}
              toolbarProps={{
                position: "none",
              }}
              detectAutoPan={false}
              preventPanOutside={true}
            >
              <svg width={svgDimensions.width} height={svgDimensions.height}>
                {content}
              </svg>
            </ReactSVGPanZoom>
          );
        }}
      />

      <Grid container item className={`side-actions`}>
        <div className="leyend">
          <span>
            <span className="indicator green"></span> for sale
          </span>
          <span>
            <span className="indicator gray"></span> coming soon
          </span>
          <span>
            <span className="indicator red"></span> sold
          </span>
        </div>
      </Grid>
    </div>
  );
};

export default CountryMap;
