import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, List, ListItem, IconButton, ListItemText, Modal, Backdrop, Fade } from "@mui/material";

import CloseIcon from "../../../assets/images/close-icon.svg";
import Divider from "@mui/material/Divider";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import Close from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import CircularProgress from "@mui/material/CircularProgress";

import { GET_CATEGORIES, POST_CATEGORY, DELETE_CATEGORY } from "../../../services/categories";
import { useApolloClient, useMutation } from "@apollo/client";

import { TwitterPicker } from "react-color";
import "./editorCategories.scss";

const initValues = { code: "", name: "", description: "", color: "#15ff00" };
const palette = ["#15ff00", "#7200a2", "#ffe600", "#00D084", "#8ED1FC", "#0693E3", "#ABB8C3", "#EB144C", "#F78DA7", "#9900EF"];

const EditorCategories = ({ open, handleClose }) => {
  const client = useApolloClient();
  const [addCategory, { data: postResponse, loading }] = useMutation(POST_CATEGORY);
  const [removeCategory] = useMutation(DELETE_CATEGORY);

  const [formValues, setFormValues] = useState(initValues);
  const [categories, setCategories] = useState([]);

  const handleAddCategory = (evt) => {
    evt.preventDefault();
    const newCat = formValues;

    setFormValues(initValues);

    addCategory({
      variables: {
        input: {
          color: newCat.color,
          description: newCat.description,
          name: newCat.name,
        },
      },
    });
  };

  const handleDeleteCategory = (code) => {
    const newCategories = categories.filter((item) => item.code !== code);

    setCategories(newCategories);

    client.writeQuery({
      query: GET_CATEGORIES,
      data: {
        categories: [...newCategories],
      },
    });

    removeCategory({
      variables: {
        input: {
          code: code,
        },
      },
    });
  };

  useEffect(() => {
    if (postResponse?.upsertCategory) {
      const newCat = postResponse.upsertCategory;
      newCat.__typename = "Category";

      client.writeQuery({
        query: GET_CATEGORIES,
        data: {
          categories: [...categories, newCat],
        },
      });

      setCategories((prev) => [...prev, newCat]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postResponse]);

  // load data ---
  useEffect(() => {
    const data = client.readQuery({
      query: GET_CATEGORIES,
    });

    setCategories(data?.categories || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box className="modal-categories">
          <button className="btn-close" onClick={() => handleClose()}>
            <img src={CloseIcon} alt="closeicon" />
          </button>
          <Typography className="modal-title" px={1}>
            Categories
          </Typography>

          <Box p={1} component="form" autoComplete="off" onSubmit={handleAddCategory}>
            <div className="categories-form">
              <Box className="boxContainer">
                <Typography className="form-title" px={1}>
                  Add New Category
                </Typography>
                <TextField
                  m={1}
                  id="name_cat"
                  name="name"
                  label="Name"
                  size="small"
                  onChange={(evt) => setFormValues({ ...formValues, name: evt.target.value })}
                  value={formValues.name}
                  fullWidth
                  required
                />
                <TextField
                  m={1}
                  id="description_cat"
                  name="description"
                  label="Description"
                  size="small"
                  onChange={(evt) => setFormValues({ ...formValues, description: evt.target.value })}
                  value={formValues.description}
                  fullWidth
                  required
                />
              </Box>

              <Box pt={2} display={"flex"} justifyContent={"space-between"} alignItems={"end"}>
                <TwitterPicker
                  colors={palette}
                  width="auto"
                  triangle="hide"
                  display={"flex"}
                  color={formValues.color}
                  onChange={(color) => setFormValues({ ...formValues, color: color.hex })}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  endIcon={!loading ? <PlaylistAddIcon /> : <CircularProgress size="1rem" />}
                  disabled={loading}
                >
                  Add
                </Button>
              </Box>
            </div>
          </Box>

          <List className="categoriesList" dense={true}>
            {categories?.length > 0 ? (
              categories.map((item, pos) => (
                <div key={pos}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCategory(item.code)}>
                        <Close />
                      </IconButton>
                    }
                  >
                    <div className="square-color" style={{ backgroundColor: item?.color }}></div>
                    <ListItemText primary={item?.name} secondary={item?.description} />
                  </ListItem>
                  <Divider variant={"middle"} component="li" />
                </div>
              ))
            ) : (
              <ListItem>
                <ListItemText secondary={"Empty list. Please add an item"} />
              </ListItem>
            )}
          </List>

          <Box p={1} pt={4} pb={0} display={"flex"} justifyContent={"end"}>
            <Button variant="contained" onClick={() => handleClose()} endIcon={<LogoutIcon />}>
              Exit
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EditorCategories;
