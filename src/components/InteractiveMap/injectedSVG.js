import { Grid } from "@mui/material";
import { ZoomIn, ZoomOut } from "@mui/icons-material";
import CropFreeIcon from "@mui/icons-material/CropFree";

import { useEffect, useRef, useState } from "react";
import { useElementSize, useWindowSize } from "usehooks-ts";
import { ReactSVGPanZoom, TOOL_AUTO, INITIAL_VALUE, fitToViewer } from "react-svg-pan-zoom";
import { ReactSvgPanZoomLoader } from "react-svg-pan-zoom-loader";

import waitForElement from "../../hooks/waitForElement";

import Tooltip from "./tooltip/tooltip";
import Area from "./area/area";
import "./injectedSVG.scss";

const INITIAL_SCALE = 500;

const InjectedSVG = (props) => {
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

  const Viewer = useRef(null);
  const [containerRef, { width, height }] = useElementSize();
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const [value, setValue] = useState(INITIAL_VALUE);
  const [tool, setTool] = useState(TOOL_AUTO);
  const [mapContainer, setMapContainer] = useState(null);
  const [svgLoad, setSvgLoad] = useState(false);
  const [svgDimensions, setSvgDimensions] = useState({ width: 800, height: 700 });
  const [fitValue, setFitValue] = useState({});
  const [tooltipData, setTooltipData] = useState({ visible: false, sector: null });

  const [hoverArea, setHoverArea] = useState(false);
  const [hoverSector, setHoverSector] = useState(false);

  // change map ---
  useEffect(() => {
    setMapContainer(null);
    setSvgLoad(false);
    console.log(activeSection?.image)

    if (activeSection?.image && activeSection?.code) {
      const img = new Image();
      img.onload = (event) => {
        const { naturalWidth, naturalHeight } = event.target;
        setSvgDimensions({ width: naturalWidth, height: naturalHeight });
        setSvgLoad(true);

        waitForElement(".injected-svg").then((element) => {
          setMapContainer(element);
        });
      };
      img.src = activeSection?.image;
    }
  }, [activeSection?.image, activeSection?.code]);

  // onChange map, load events ---
  useEffect(() => {
    if (mapContainer && listArea && listSection) {
      _initFitView();

      if (listArea.length && listSection.length && !("isload" in mapContainer.dataset)) {
        mapContainer.dataset.isload = "true";
        listArea.forEach((area) => {
          const elements = mapContainer.querySelectorAll(`[data-area="${area.code}"`);
          if (elements) _setAreaEvents(elements, area);
        });

        listSection.forEach((section) => {
          const elements = mapContainer.querySelectorAll(`[data-section="${section.code}"`);
          if (elements) _setSectionEvents(elements, section);
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapContainer, listArea, listSection]);

  const _setSectionEvents = (elements, section) => {
    elements.forEach(async (item) => {
      item.addEventListener("click", () => {
        handleChangeSection(section);
      });

      if (item.getAttribute("fill") === "#ffffff") item.classList.add("shadowSector");

      item.classList.add("inteactiveSector");
    });
  };

  const _setAreaEvents = (elements, area) => {
    elements.forEach(async (item) => {
      item.addEventListener("mouseover", () => {
        if (item.dataset?.sector) {
          const sector = area.sectors.find((x) => x.code === item.dataset?.sector);
          if (sector) {
            setTooltipData({ visible: true, sector: sector });
            setHoverSector(sector)
          }

          const hoverArea = listArea.find((x) => x.code === item.dataset?.area);
          if (hoverArea) setHoverArea(hoverArea);
        } else {
          setTooltipData({ visible: true, sector: { open: false } });
          setHoverArea(false);
          setHoverSector(false);
        }
      });

      item.addEventListener("mouseleave", () => {
        setTooltipData({ visible: false, sector: null });
        setHoverArea(false);
        setHoverSector(false);
      });

      item.addEventListener("click", () => {
        if (!item.dataset?.sector) return;

        const activeItem = mapContainer.querySelector('[data-active="true"]');
        if (activeItem) {
          delete activeItem.dataset.active;
          activeItem.classList.remove("activeSector");
        }

        item.dataset.active = true;
        item.classList.add("activeSector");

        const sector = area.sectors.find((x) => x.code === item.dataset?.sector) || null;
        handleChangeSector(sector);
        handleChangeArea(area);
      });

      if (item.dataset?.sector) {
        const sector = area.sectors.find((x) => x.code === item.dataset.sector);
        if (sector) {
          if (!sector.open) {
            item.style.fill = "#aaaaaa";
          } else if (sector.nfts === sector.purchased_nfts) {
            item.style.fill = "#323232";
          } else {
            item.dataset.available = true;
            item.style.fill = area.color;
          }
          item.classList.add("inteactiveSector");
        }
      } else {
        if (!item.getAttribute("fill")) item.style.fill = "transparent";
      }
    });
  };

  // fit init view map on resize window ---
  useEffect(() => {
    _initFitView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth, windowHeight]);

  // prevent min zoom ---
  useEffect(() => {
    if (value?.a < fitValue?.a) _fitCenter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, fitValue]);

  const _zoomIn = () => {
    Viewer.current.zoomOnViewerCenter(1.1);
  };

  const _zoomOut = () => {
    Viewer.current.zoomOnViewerCenter(0.9);
  };

  const _fitCenter = () => {
    Viewer.current?.fitToViewer("center");
    const minFitValue = fitToViewer(value);
    if (minFitValue) setFitValue(minFitValue);
  };

  const _initFitView = () => {
    if (svgDimensions?.width > INITIAL_SCALE) {
      Viewer.current?.fitSelection(-INITIAL_SCALE, 0, svgDimensions.width + INITIAL_SCALE * 2, 0);
    } else {
      _fitCenter();
    }
  };

  if (!activeSection?.image || !svgLoad) {
    return (
      <Grid container justifyContent={"center"} p={2}>
        <span>loading map...</span>
      </Grid>
    );
  }

  return (
    <div ref={containerRef} style={{ height: "100%", width: "100%" }}>
      <Grid item className="customToolbar">
        <ZoomIn onClick={_zoomIn} />
        <ZoomOut onClick={_zoomOut} />
        <CropFreeIcon onClick={_fitCenter} />
      </Grid>

      <Grid item className="containerLogo">
        <img src={activeDistrict?.logo} alt="logo" className="img-logo" />
      </Grid>

      {(activeSector || hoverSector) && (
        <Grid item className="containerArea">
          <Area area={activeArea || hoverArea} sector={activeSector || hoverSector} />
        </Grid>
      )}

      <Tooltip data={tooltipData} />

      <ReactSvgPanZoomLoader
        src={activeSection?.image}
        render={(content) => {
          return (
            <ReactSVGPanZoom
              ref={Viewer}
              value={value}
              onChangeValue={setValue}
              tool={tool}
              onChangeTool={setTool}
              width={width || 500}
              height={height || 500}
              SVGBackground={"transparent"}
              background={"transparent"}
              scaleFactorOnWheel={1.1}
              scaleFactorMax={10}
              miniatureProps={{
                position: "right",
                background: "#000000cc",
                width: 250,
                height: 250,
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
    </div>
  );
};

export default InjectedSVG;
