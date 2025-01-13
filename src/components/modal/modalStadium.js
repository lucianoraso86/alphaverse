import { Grid } from "@mui/material";
import CloseIcon from "../../assets/images/close-icon.svg";
import CardDetail from "../cardDetail/cardDetail";

import "./modalStadium.scss";

export default function ModalStadium({ open, setOpen, openPanel, activeNFT }) {
  const handleClose = () => setOpen(false);
  const handleClick = () => {
    if (activeNFT.opensea_link) window.open(activeNFT.opensea_link, "_blank");
  };
  return (
    <Grid
      container
      item
      xs={12}
      sm={12}
      md={openPanel ? 7 : 12}
      lg={openPanel ? 8 : 12}
      className={`modal-backdrop ${!open ? "d-none" : ""}`}
    >
      <div className="modal">
        <button className="close-btn" onClick={handleClose}>
          <img src={CloseIcon} alt="closeicon" />
        </button>
        <div className="alignment-box">
          <CardDetail item={activeNFT} handleClick={handleClick} />
          <button className="btn top" onClick={handleClick}>
            BUY
          </button>
        </div>
      </div>
    </Grid>
  );
}
