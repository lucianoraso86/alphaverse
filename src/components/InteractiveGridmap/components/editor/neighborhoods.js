import { useEffect, useState } from "react";
import { Box, Button, Typography, List, ListItem, IconButton, ListItemText, Modal, Backdrop, Fade, TextField } from "@mui/material";

import CloseIcon from "../../../../assets/images/close-icon.svg";
import Divider from "@mui/material/Divider";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";

import { POST_NEIGHBORHOODS } from "../../../../services/neighborhoods";
import { GET_DISTRICT } from "../../../../services/districts";
import { useMutation } from "@apollo/client";

import "./neighborhoods.scss";

const EditorNeighborhoods = ({ open, handleClose, district, country }) => {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [formValues, setFormValues] = useState([]);

  const [updateNeighborhood] = useMutation(POST_NEIGHBORHOODS, {
    refetchQueries: [GET_DISTRICT],
  });

  const handleUpdate = (index) => {
    const item = formValues[index];
    const input = {
      new_name: item.name,
      neighborhood_id: item.id,
      district_id: district.id,
      country_id: country.id,
    };

    updateNeighborhood({ variables: { input } });

    setFormValues((prev) =>
      prev.map((item, pos) => {
        return pos === index ? { ...item, editable: false } : item;
      })
    );
  };

  const editableItem = (index) => {
    setFormValues((prev) =>
      prev.map((item, pos) => {
        return pos === index ? { ...item, editable: true } : item;
      })
    );
  };

  const setNameValues = (index, name) => {
    setFormValues((prev) =>
      prev.map((item, pos) => {
        return pos === index ? { ...item, name } : item;
      })
    );
  };

  // load data ---
  useEffect(() => {
    setNeighborhoods(district?.neighborhoods || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district, country]);

  useEffect(() => {
    const formValues = [];
    neighborhoods.forEach((item) => {
      formValues.push({ ...item, editable: false });
    });
    setFormValues(formValues);
  }, [neighborhoods]);

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
        <Box className="modal-neighborhoods">
          <button className="btn-close" onClick={() => handleClose()}>
            <img src={CloseIcon} alt="closeicon" />
          </button>
          <Typography className="modal-title" px={1}>
            Neighborhoods
          </Typography>

          <List className="neighborhoodsList">
            {neighborhoods?.length > 0 ? (
              neighborhoods.map((item, pos) => (
                <div key={pos}>
                  <ListItem
                    secondaryAction={
                      formValues[pos]?.editable !== true ? (
                        <IconButton edge="end" onClick={() => editableItem(pos)}>
                          <EditIcon />
                        </IconButton>
                      ) : (
                        <IconButton edge="end" onClick={() => handleUpdate(pos)}>
                          <CheckIcon />
                        </IconButton>
                      )
                    }
                  >
                    <div className="square-color" style={{ backgroundColor: item?.color }}></div>

                    <TextField
                      label=""
                      fullWidth
                      required
                      disabled={!formValues[pos]?.editable}
                      onChange={(evt) => setNameValues(pos, evt.target.value)}
                      value={formValues[pos]?.name}
                      className={!formValues[pos]?.editable ? "noborder" : ""}
                    />
                  </ListItem>
                  <Divider variant={"middle"} component="li" />
                </div>
              ))
            ) : (
              <ListItem>
                <ListItemText secondary={"Empty list"} />
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

export default EditorNeighborhoods;
