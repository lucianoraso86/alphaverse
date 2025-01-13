import { Grid } from "@mui/material";
import { ZoomIn, ZoomOut } from "@mui/icons-material";
import CropFreeIcon from "@mui/icons-material/CropFree";

import { useEffect, useRef, useState } from "react";
import { useElementSize } from "usehooks-ts";
import { ReactSVGPanZoom, TOOL_AUTO, INITIAL_VALUE } from "react-svg-pan-zoom";
import { ReactSvgPanZoomLoader } from "react-svg-pan-zoom-loader";
import waitForElement from "../../hooks/waitForElement";

import WorldMapSVG from "../../assets/images/maps/worldMap.svg";

const MAX_FACTOR = 4;

const WorldMap = ({ countryOver }) => {
  const Viewer = useRef(null);

  const [containerRef, { width, height }] = useElementSize();

  const [mapContainer, setMapContainer] = useState(null);
  const [svgLoad, setSvgLoad] = useState(false);
  const [value, setValue] = useState(INITIAL_VALUE);
  const [tool, setTool] = useState(TOOL_AUTO);
  const [svgDimensions, setSvgDimensions] = useState({ width: 2270, height: 1320 });

  // load map and data ---
  useEffect(() => {
    const img = new Image();
    img.onload = (event) => {
      const { naturalWidth, naturalHeight } = event.target;
      setSvgLoad(true);
      setSvgDimensions({ width: naturalWidth, height: naturalHeight });

      waitForElement(".injected-svg").then((element) => {
        _fitCenter();
        setMapContainer(element);
      });
    };
    img.src = WorldMapSVG;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // over fill ---
  useEffect(() => {
    if(!mapContainer) return;
    
    const elements = mapContainer?.querySelectorAll(".country-open,.country-sold");
    elements?.forEach((path) => {
      path.classList.remove("country-open", "country-sold");
    });

    if (countryOver?.code) {
      const element = mapContainer?.querySelector(`[data-country="${countryOver.code}"]`);
      if (element) element.classList.add(countryOver.enable ? "country-open" : "country-sold");
    }
  }, [mapContainer, countryOver]);

  if (!svgLoad) {
    return (
      <Grid container justifyContent={"center"} p={2}>
        <span>loading map...</span>
      </Grid>
    );
  }

  return (
    <div ref={containerRef} style={{ height: "100%", width: "100%" }}>
      <Grid item className="custom-toolbar">
        <ZoomIn onClick={_zoomIn} />
        <ZoomOut onClick={_zoomOut} />
        <CropFreeIcon onClick={_fitCenter} />
      </Grid>

      <ReactSvgPanZoomLoader
        src={WorldMapSVG}
        render={(content) => {
          return (
            <ReactSVGPanZoom
              ref={Viewer}
              value={value}
              tool={tool}
              onChangeValue={setValue}
              onChangeTool={setTool}
              width={width || 2270}
              height={height || 1320}
              SVGBackground={"transparent"}
              background={"transparent"}
              scaleFactorMax={MAX_FACTOR}
              scaleFactorMin={.5}
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

export default WorldMap;
