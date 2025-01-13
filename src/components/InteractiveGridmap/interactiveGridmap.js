import { Grid, Typography, Stack, Box } from "@mui/material";
import { ZoomIn, ZoomOut } from "@mui/icons-material";
import CropFreeIcon from "@mui/icons-material/CropFree";

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useElementSize } from "usehooks-ts";
import { ReactSVGPanZoom, TOOL_AUTO, INITIAL_VALUE } from "react-svg-pan-zoom";
import { ReactSvgPanZoomLoader } from "react-svg-pan-zoom-loader";

import EditorPanel from "./components/editor/editorPanel2";
import SidePanel from "./components/sidePanel/sidePanel";
import waitForElement from "../../hooks/waitForElement";
import Tooltip from "../InteractiveMap/tooltip/tooltip";
import StatusBox from "../statusBox/statusBox";

//import HoryouMap from "../../assets/images/maps/horyouMap.svg";
import BackArrow from "../../assets/images/icons/backArrow.svg";
import FlagLogo from "../../assets/images/flag-france.svg";

import { POST_PLOT } from "../../services/plots";
import { GET_DISTRICT } from "../../services/districts";
import { GET_COUNTRY } from "../../services/countries";
import { useQuery, useMutation } from "@apollo/client";

import "./interactiveGridmap.scss";

const STATUS = { AVAILABLE: 1, SOLD: 2, COMMING_SOON: 3 };
const BRUSH_TYPE = { ADD: 1, REMOVE: 2 };
const MAX_FACTOR = 4;
const PATH_GRID = 24;
const PASS = "test";

const InteractiveGridmap = () => {
  const Viewer = useRef(null);
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [containerRef, { width, height }] = useElementSize();
  const [svgMap, setSvgMap] = useState(false);
  const [svgMiniMap, setSvgMiniMap] = useState(false);

  const [value, setValue] = useState(INITIAL_VALUE);
  const [tool, setTool] = useState(TOOL_AUTO);
  const [svgDimensions, setSvgDimensions] = useState({ width: 912, height: 912 });
  const [tooltipData, setTooltipData] = useState({ visible: false, sector: null });

  // grid
  const [gridData, setGridData] = useState([]);
  const [renderGrid, setRenderGrid] = useState([]);
  const [visualKeys, setVisualKeys] = useState([]);
  const [gridConfig, setGridConfig] = useState({ originX: 0, originY: 0, width: 0, height: 0 });

  //paths
  const [statusPaths, setStatusPaths] = useState([]);
  const [hoverPaths, setHoverPaths] = useState([]);
  const [selectedPaths, setSelectedPaths] = useState([]);

  const [activeSector, setActiveSector] = useState(null);
  const [editorMode, setEditorMode] = useState(false);
  const [actualStatus, setActualStatus] = useState(STATUS.AVAILABLE);
  const [activeNeighborhoods, setActiveNeighborhoods] = useState({});

  // brush
  const [brushTool, setBrushTool] = useState(BRUSH_TYPE.ADD);
  const [brushSize, setBrushSize] = useState(1);
  const [brushPointer, setBrushPointer] = useState(null);

  const [countryCode, setCountryCode] = useState(null);
  const [districtCode, setDistrictCode] = useState(null);
  const [country, setCountry] = useState({});
  const [district, setDistrict] = useState({});

  // flip and rotation
  const [position, setPosition] = useState({ rotation: 0, flipH: false, flipV: false });

  // get data ---
  const { data: getCountry } = useQuery(GET_COUNTRY, {
    variables: { countryCode: countryCode },
    skip: !countryCode,
  });

  const { data: getDistrict } = useQuery(GET_DISTRICT, {
    variables: { countryCode: countryCode, districtCode: districtCode },
    skip: !countryCode && !districtCode,
  });

  const [postPlot] = useMutation(POST_PLOT);

  // load map and data ---
  useEffect(() => {
    setDistrict(getDistrict?.distric_by_country_code_and_district_code || {});
  }, [getDistrict]);

  useEffect(() => {
    setCountry(getCountry?.country || {});
  }, [getCountry]);

  useEffect(() => {
    setCountryCode(params?.country);
    setDistrictCode(params?.district);
  }, [params?.country, params?.district]);

  useEffect(() => {
    if (district?.map) {
      const img = new Image();
      const blob = new Blob([district?.map], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      img.src = url;

      img.onload = (event) => {
        setSvgMap(url);
        const { naturalWidth, naturalHeight } = event.target;
        setSvgDimensions({ width: naturalWidth, height: naturalHeight });
        waitForElement(".injected-svg").then(() => _fitCenter());
      };

      const sectors = [];
      district?.neighborhoods?.forEach((neighborhood) => {
        neighborhood?.plots.forEach((plot) => {
          sectors.push({ ...plot, neighborhood_id: neighborhood.id });
        });
      });

      if (sectors?.length) setStatusPaths(sectors);
    }

    if (district?.miniMap) {
      const blob2 = new Blob([district?.miniMap], { type: "image/svg+xml" });
      const url2 = URL.createObjectURL(blob2);
      setSvgMiniMap(url2);
    }

    if (district?.rotation) {
      setPosition({
        rotation: parseInt(district?.rotation || 0),
        flipH: district?.flipH === "true" || false,
        flipV: district?.flipV === "true" || false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district?.map, district?.miniMap]);

  useEffect(() => {
    _drawGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusPaths, hoverPaths, selectedPaths, brushPointer, district]);

  // editor mode ---
  useEffect(() => {
    if (params?.editor === "editor") {
      setActiveSector(null);
      if (!editorMode) {
        const input = window.prompt("Enter password", "");
        if (input === PASS) {
          setEditorMode(true);
          setBrushTool(1);
          setBrushSize(1);
        } else {
          const newLocation = location.pathname.replace("/editor", "");
          navigate(newLocation);
        }
      }
    } else {
      setEditorMode(false);
    }

    _drawGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.editor, editorMode]);

  const setExitEditor = () => {
    setEditorMode(false);
    setActiveSector(null);
    setBrushTool(BRUSH_TYPE.ADD);
    setBrushSize(1);
    const newLocation = location.pathname.replace("/editor", "");
    navigate(newLocation);
  };

  // calculate grid data ---
  useEffect(() => {
    setGridConfig({
      originX: 0,
      originY: 0,
      width: svgDimensions.width / PATH_GRID,
      height: svgDimensions.height / PATH_GRID,
    });
  }, [svgDimensions.width, svgDimensions.height]);

  useEffect(() => {
    _drawGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridConfig.width, gridConfig.height]);

  // grid events ---
  const _drawGrid = () => {
    const gridData = [];
    const renderGrid = [];

    // draw no active paths
    for (let y = 0; y < gridConfig.height; y++) {
      for (let x = 0; x < gridConfig.width; x++) {
        const posX = x * PATH_GRID - gridConfig.originX;
        const posY = y * PATH_GRID - gridConfig.originY;
        const key = `${x}-${y}`;

        const statusPath = statusPaths.find((x) => x.key === key);
        const selected = selectedPaths.find((x) => x.key === key);
        const hover = !!hoverPaths.find((x) => x.key === key);

        const open = selected ? selected?.open : statusPath?.open;
        const sold = selected ? selected?.sold : statusPath?.sold;

        const item = { key, posX, posY, hover, open, sold, available: !!statusPath };
        gridData.push(item);
        renderGrid.push(_drawPath(item));
      }
    }

    // draw pointer path
    if (brushPointer) {
      const path = _drawPointer(brushPointer);
      renderGrid.push(path);
    }

    // brings to the front available, sold and pointer
    const sortedGrid = [...renderGrid].sort((a, b) => {
      return b.props.z_index < a.props.z_index ? 1 : -1;
    });

    setGridData(gridData);
    setRenderGrid(sortedGrid);
  };

  const _drawPath = ({ key, posX, posY, hover, open, sold, available }) => {
    const classes = ["grid-path"];

    if (available && hover) {
      classes.push(brushTool === 1 ? "hover-select" : "hover-delete");
    }

    if (sold) classes.push("sold-path");
    if (open) classes.push("active-path");
    if (available) classes.push("available-path");

    return (
      <rect
        key={key}
        data-key={key}
        x={posX}
        y={posY}
        width={PATH_GRID}
        height={PATH_GRID}
        onClick={_pathClick}
        onMouseOver={_pathMouseOver}
        onMouseLeave={_pathMouseLeave}
        className={classes.join(" ")}
        z_index={open || sold ? 1 : 0}
      />
    );
  };

  const _drawPointer = (item) => {
    return (
      <rect
        key={`pointer-${item.key}`}
        data-key={`pointer-${item.key}`}
        x={item.posX}
        y={item.posY}
        width={PATH_GRID * brushSize}
        height={PATH_GRID * brushSize}
        className="brush-pointer"
        z_index={2}
      />
    );
  };

  // paths events ---
  const _pathMouseOver = (evt) => {
    const classes = evt.target.classList;
    const key = evt.target.dataset.key;
    const code = visualKeys[key];

    // brush pointers
    _setBrushPointer(key);
    if (editorMode) _setBrushPaths(key);

    // tooltip data
    if (classes.contains("sold-path")) {
      setTooltipData({ visible: true, sector: { code, open: true, nfts: 1, purchased_nfts: 1 } });
    } else if (classes.contains("active-path")) {
      setTooltipData({ visible: true, sector: { code, open: true, nfts: 1, purchased_nfts: 0 } });

      const neighborhood = district?.neighborhoods?.find((x) => x?.plots?.find((y) => y.key === key));
      if (neighborhood) {
        setActiveNeighborhoods({
          ...neighborhood,
          open: true,
          name: neighborhood.name,
          type: "street",
          total: neighborhood.plots.length || 0,
          quantity: neighborhood.plots.filter((x) => !x.sold && x.open).length || 0,
        });
      }
    } else {
      if (editorMode) {
        setTooltipData({ visible: true, sector: { code, open: true, nfts: 1, purchased_nfts: 0 } });
      } else {
        if (classes.contains("available-path")) setTooltipData({ visible: true, sector: { code, open: false } });
      }
    }
  };

  const _pathMouseLeave = () => {
    setTooltipData({ visible: false, sector: null });
    setHoverPaths([]);
    setBrushPointer(null);
    /*if (!activeSector) */ setActiveNeighborhoods({});
  };

  const _pathClick = (evt) => {
    const item = evt.target;

    if (editorMode) {
      if (brushTool === BRUSH_TYPE.ADD) {
        const onlyAvailable = hoverPaths.filter((item) => item.key === statusPaths.find((x) => x.key === item.key)?.key); // only availables paths
        const noPrevSelect = onlyAvailable.filter((item) => item.key !== selectedPaths.find((x) => x.key === item.key)?.key); // no previous selected

        noPrevSelect.forEach((sector) => {
          sector.open = actualStatus === STATUS.COMMING_SOON ? false : true;
          sector.sold = actualStatus === STATUS.SOLD ? true : false;
        });

        setSelectedPaths((prev) => [...prev, ...noPrevSelect]);
      } else {
        if (selectedPaths?.length === 0) {
          const sectors = [];
          hoverPaths.forEach((item) => {
            const activePath = statusPaths?.find((x) => x.key === item.key);
            if (activePath) {
              sectors.push({
                country_id: country.id,
                district_id: district.id,
                neighborhood_id: activePath.neighborhood_id,
                plot_key: item.key,
                open: false,
                sold: false,
              });
            }
          });

          if (sectors.length) postPlot({ variables: { input: sectors } });
        } else {
          const newSelected = selectedPaths.filter((item) => item.key !== hoverPaths.find((x) => x.key === item.key)?.key); // remove selected paths
          setSelectedPaths(newSelected);
        }

        setStatusPaths(
          statusPaths.map((item) => {
            return hoverPaths.find((x) => x.key === item.key) ? { ...item, open: false, sold: false } : item;
          })
        );
      }
    } else {
      const path = statusPaths.find((x) => x.key === item.dataset.key);
      if (!path?.sold && path?.open) setActiveSector(path);
    }
  };

  // brush events ---
  const _setBrushPaths = (key) => {
    const [idX, idY] = key.split("-");
    for (let y = 0; y < brushSize; y++) {
      for (let x = 0; x < brushSize; x++) {
        const newX = parseInt(idX) + x;
        const newY = parseInt(idY) + y;
        const newKey = `${newX}-${newY}`;

        const item = gridData.find((x) => x.key === newKey);

        if (item) {
          const brushPath = { key: item.key, posX: item.posX, posY: item.posY, available: item.available };
          setHoverPaths((prev) => [...prev, brushPath]);
        }
      }
    }
  };

  const _setBrushPointer = (key) => {
    const item = gridData.find((x) => x.key === key);
    if (item) setBrushPointer(item);
  };

  useEffect(() => {
    if (actualStatus) {
      setSelectedPaths(
        selectedPaths.map((item) => {
          item.open = actualStatus === STATUS.COMMING_SOON ? false : true;
          item.sold = actualStatus === STATUS.SOLD ? true : false;
          return item;
        })
      );
      _drawGrid();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualStatus]);

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

  // tooltip key adjust ---
  useEffect(() => {
    const aKeys = [];
    for (let y = 0; y < gridConfig.height; y++) {
      for (let x = 0; x < gridConfig.width; x++) {
        let newX = x;
        let newY = y;

        switch (position.rotation) {
          case 90:
            newY = gridConfig.height - (y + 1);
            break;
          case 180:
            newX = gridConfig.width - (x + 1);
            newY = gridConfig.height - (y + 1);
            break;
          case 270:
            newX = gridConfig.width - (x + 1);
            break;
          default:
        }

        if (position.flipV) newX = gridConfig.width - (x + 1);
        if (position.flipH) newY = gridConfig.height - (y + 1);

        aKeys[`${x}-${y}`] = `${newX}-${newY}`;
      }
    }

    setVisualKeys(aKeys);
  }, [position, gridConfig]);

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
        <Typography>{district?.name}</Typography>
        <img src={FlagLogo} alt="flagLogo" />
        <Grid item className="back-button" onClick={() => navigate(`/world/${countryCode}`)}>
          <Typography>go back to the map</Typography>
          <img src={BackArrow} alt="backArrow" />
        </Grid>
      </Grid>

      <Grid item className="neighborhood-list">
        <Stack>
          {district?.neighborhoods?.length > 0 &&
            district.neighborhoods.map((item) => (
              <Typography component={"span"} key={item.id}>
                <Box
                  className="hexagon"
                  sx={{
                    background: item.color,
                    "&:before": { borderBottom: `6px solid ${item.color}` },
                    "&:after": { borderTop: `6px solid ${item.color}` },
                  }}
                ></Box>
                {item.name}
              </Typography>
            ))}
        </Stack>
      </Grid>

      <Grid item className={`custom-toolbar ${activeSector ? "slide-toolbar" : ""}`} sx={{top: "55px!important"}}>
        <ZoomIn onClick={_zoomIn} />
        <ZoomOut onClick={_zoomOut} />
        <CropFreeIcon onClick={_fitCenter} />
      </Grid>

      <Tooltip data={tooltipData} />

      <Grid item className="container-minimap">
        <Grid className="minimap">
          <img src={svgMiniMap} alt="minimap" />
        </Grid>
        {activeNeighborhoods?.id && <StatusBox item={activeNeighborhoods} />}
      </Grid>

      <ReactSvgPanZoomLoader
        src={svgMap}
        render={(renderMap) => {
          return (
            <ReactSVGPanZoom
              ref={Viewer}
              value={value}
              tool={tool}
              onChangeValue={setValue}
              onChangeTool={setTool}
              width={width || 912}
              height={height || 912}
              SVGBackground={"transparent"}
              background={"#00000033"}
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
                <g
                  transform={`rotate(${position.rotation}) scale(${position.flipV ? -1 : 1},${position.flipH ? -1 : 1})`}
                  transform-origin={`${svgDimensions.width / 2} ${svgDimensions.height / 2}`}
                >
                  {renderMap}
                  <g>{renderGrid}</g>
                </g>
              </svg>
            </ReactSVGPanZoom>
          );
        }}
      />

      {editorMode ? (
        <EditorPanel
          selectedPaths={selectedPaths}
          setSelectedPaths={setSelectedPaths}
          setStatusPaths={setStatusPaths}
          exitEditor={setExitEditor}
          setBrushTool={setBrushTool}
          setBrushSize={setBrushSize}
          setActualStatus={setActualStatus}
          setPosition={setPosition}
          position={position}
          actualStatus={actualStatus}
          statusPaths={statusPaths}
          district={district}
          country={country}
          visualKeys={visualKeys}
        />
      ) : (
        <SidePanel activeSector={activeSector} setActiveSector={setActiveSector} visualKeys={visualKeys} district={district} />
      )}
    </div>
  );
};

export default InteractiveGridmap;
