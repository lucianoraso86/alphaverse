import { useState, useEffect } from "react";

import { List, ListItem, IconButton, ListItemText, MenuItem, FormControl, OutlinedInput, InputLabel } from "@mui/material";
import { Grid, Box, Tabs, Tab, Button, TextField, Typography } from "@mui/material";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";

import LogoutIcon from "@mui/icons-material/Logout";
import DownloadIcon from "@mui/icons-material/Download";
import Close from "@mui/icons-material/Close";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import DoneIcon from "@mui/icons-material/Done";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CloseIcon from "../../../assets/images/close-icon.svg";
import Rotate90DegreesCcwIcon from "@mui/icons-material/Rotate90DegreesCcw";

import EditorNeighborhood from "./neighborhoods";
import Brushes from "./brushes";

import { GET_CATEGORIES } from "../../../services/categories";
import { POST_SECTOR } from "../../../services/sectors";
import { useApolloClient, useMutation } from "@apollo/client";

import "./editorPanel.scss";

const initNftsValues = { token_id: "", contract_address: "" };
const initLinkValues = { name: "", url: "" };

const EditorPanel = ({
  selectedPaths,
  setSelectedPaths,
  activePaths,
  setActivePaths,
  exitEditor,
  setBrushTool,
  setBrushSize,
  provinceId,
  countryId,
}) => {
  const client = useApolloClient();
  const [addSector, { data: postResponse }] = useMutation(POST_SECTOR);

  const [tabIndex, setTabIndex] = useState(0);
  const [nftsFormValues, setNftsFormValues] = useState(initNftsValues);
  const [linksFormValues, setLinksFormValues] = useState(initLinkValues);
  const [nftsValues, setNftsValues] = useState([]);
  const [linksValues, setLinksValues] = useState([]);

  const [activeCategory, setActiveCategory] = useState("");
  const [listCategories, setListCategories] = useState([]);
  const [modalNeighborhood, setModalNeighborhood] = useState(false);

  const handleTabChange = (evt, newTabIndex) => {
    setNftsFormValues(initNftsValues);
    setTabIndex(newTabIndex);
  };

  const handleAddNFTs = (evt) => {
    evt.preventDefault();

    if (tabIndex === 0) {
      setNftsValues((prev) => [...prev, nftsFormValues]);
    } else {
      setLinksValues((prev) => [...prev, linksFormValues]);
    }

    setNftsFormValues(initNftsValues);
    setLinksFormValues(initLinkValues);
  };

  const handleDeleteNFTs = (indexItem) => {
    setNftsValues((prev) => prev.filter((item, index) => index !== indexItem));
  };

  const handleDeleteLinks = (indexItem) => {
    setLinksValues((prev) => prev.filter((item, index) => index !== indexItem));
  };

  const handleSetSector = (evt) => {
    evt.preventDefault();

    const sector = {
      category_code: "default",
      tokens: nftsValues,
      links: linksValues,
      cells: [],
    };

    selectedPaths.forEach((path) => {
      path.nfts = nftsValues;
      path.links = linksValues;
      setActivePaths((prev) => [...prev, path]);

      const cell = { key: path.key, x: path.posX, y: path.posY, level: 1 };
      sector.cells.push(cell);
    });

    addSector({ variables: { input: sector } });

    setNftsValues([]);
    setLinksValues([]);
    setSelectedPaths([]);
  };

  // editor events ---
  const handleCancelSector = () => {
    setNftsValues([]);
    setSelectedPaths([]);
  };

  const handleDownloadData = () => {
    const cells = [];
    selectedPaths.forEach((item) => {
      const data = { key: item.key };
      cells.push(data);
    });

    const formatData = JSON.stringify(cells, null, "  ");

    const element = document.createElement("a");
    const file = new Blob([formatData], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "sectors.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  useEffect(() => {
    if (postResponse?.upsertSector) {
      const newSector = postResponse.upsertSector;
      const updatePaths = [...activePaths];

      newSector?.cells.forEach((cell) => {
        const actual = updatePaths.find((x) => x.key === cell.key);
        actual.code = newSector.code;
      });

      setActivePaths(updatePaths);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postResponse]);

  // categories ---
  /*const handleChangeCategory = (event) => {
    setActiveCategory(event.target.value);
    setActualCategory(listCategories.find((x) => x.code === event.target.value));
  };*/

  const handleCloseModal = () => {
    const data = client.readQuery({
      query: GET_CATEGORIES,
    });

    setListCategories(data?.categories || []);
    setModalNeighborhood(false);
  };

  useEffect(() => {
    const data = client.readQuery({
      query: GET_CATEGORIES,
    });

    setListCategories(data?.categories || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (listCategories?.length) {
      setActiveCategory(listCategories[0].code);
      //setActualCategory(listCategories[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listCategories]);

  return (
    <>
      <Grid container item className={`gridmap-editor ${selectedPaths?.length ? "active-panel" : ""}`}>
        <Grid item width={"100%"}>
          <button className="btn-close" onClick={handleCancelSector}>
            <img src={CloseIcon} alt="closeicon" />
          </button>
          <div className="container-title">
            <Typography className="editor-title">
              Sector{selectedPaths.length > 1 ? "s" : ""} ({selectedPaths.length})
            </Typography>
            <div className="list-title">
              {selectedPaths.map((element, pos) => (
                <span key={pos}>{element?.key}</span>
              ))}
            </div>
          </div>

          <Box p={1} component="form" autoComplete="off" onSubmit={handleAddNFTs}>
            <Box pt={2} display={"flex"}>
              <FormControl fullWidth size="small">
                <InputLabel className="label-category">Category</InputLabel>
                <Select
                  input={<OutlinedInput label="Category" />}
                  className="select-category"
                  value={activeCategory}
                  //onChange={handleChangeCategory}
                >
                  {listCategories?.length !== 0 ? (
                    listCategories.map((item) => (
                      <MenuItem key={item.code} value={item.code}>
                        <div className="square-color" style={{ backgroundColor: item?.color }}></div>
                        <ListItemText primary={item?.name} />
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      <em style={{ fontSize: "14px" }}>Please add a category</em>
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>

            <div className="nftsForm">
              <Box pb={2} pt={0}>
                <Tabs value={tabIndex} onChange={handleTabChange} className="tabContainer">
                  <Tab label="NFT" />
                  <Tab label="Link" />
                </Tabs>
              </Box>
              {tabIndex === 0 && (
                <Box className="boxContainer">
                  <TextField
                    m={1}
                    id="token_id"
                    name="token_id"
                    label="Token ID"
                    size="small"
                    onChange={(evt) => setNftsFormValues({ ...nftsFormValues, token_id: evt.target.value })}
                    value={nftsFormValues.token_id}
                    fullWidth
                    required
                  />
                  <TextField
                    m={1}
                    id="contract_address"
                    name="contract_address"
                    label="Contract Address"
                    size="small"
                    onChange={(evt) => setNftsFormValues({ ...nftsFormValues, contract_address: evt.target.value })}
                    value={nftsFormValues.contract_address}
                    inputProps={{ pattern: "^(0x)?[0-9a-fA-F]{40}$" }}
                    fullWidth
                    required
                  />
                </Box>
              )}
              {tabIndex === 1 && (
                <Box className="boxContainer">
                  <TextField
                    m={1}
                    id="name"
                    name="name"
                    label="Name"
                    size="small"
                    onChange={(evt) => setLinksFormValues({ ...linksFormValues, name: evt.target.value })}
                    value={linksFormValues.name}
                    fullWidth
                    required
                  />
                  <TextField
                    id="url"
                    name="url"
                    label="External Link"
                    size="small"
                    onChange={(evt) => setLinksFormValues({ ...linksFormValues, url: evt.target.value })}
                    value={linksFormValues.url}
                    inputProps={{ type: "url" }}
                    fullWidth
                    required
                  />
                </Box>
              )}

              <Box pt={2} display={"flex"} justifyContent={"end"}>
                <Button type="submit" variant="contained" color="error" endIcon={<PlaylistAddIcon />}>
                  Add item
                </Button>
              </Box>
            </div>

            <List className="nftsList" dense={true}>
              {nftsValues?.length > 0 &&
                nftsValues.map((item, pos) => (
                  <div key={pos}>
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteNFTs(pos)}>
                          <Close />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={item?.token_id} secondary={item?.contract_address} />
                    </ListItem>
                    <Divider variant={"middle"} component="li" />
                  </div>
                ))}

              {linksValues?.length > 0 &&
                linksValues.map((item, pos) => (
                  <div key={pos}>
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteLinks(pos)}>
                          <Close />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={item?.name} secondary={item?.url} />
                    </ListItem>
                    <Divider variant={"middle"} component="li" />
                  </div>
                ))}

              {!nftsValues?.length && !linksValues?.length && (
                <ListItem>
                  <ListItemText secondary={"Empty list. Please add an item"} />
                </ListItem>
              )}
            </List>

            <Box pt={2} display={"flex"} justifyContent={"end"}>
              <Button
                variant="contained"
                onClick={handleSetSector}
                disabled={!nftsValues?.length && !linksValues?.length}
                endIcon={<DoneIcon />}
              >
                Set and save
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid container item>
        <EditorNeighborhood open={modalNeighborhood} handleClose={handleCloseModal} provinceId={provinceId} countryId={countryId} />
      </Grid>

      <Grid container item className="editor-actions">
        <Brushes editorMode={true} setBrushSize={setBrushSize} setBrushTool={setBrushTool} />

        <div className="actions">
          <Typography px={1}>Editor mode</Typography>
          {
            <Button variant="contained" color="success" onClick={handleDownloadData}>
              <DownloadIcon />
            </Button>
          }

          <Button variant="contained" endIcon={<FormatListBulletedIcon />} onClick={() => setModalNeighborhood(true)}>
            Neighborhood
          </Button>
          <Button variant="contained" color="error" endIcon={<LogoutIcon />} onClick={exitEditor}>
            Exit
          </Button>
        </div>
      </Grid>
    </>
  );
};

export default EditorPanel;
