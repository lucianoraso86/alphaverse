import { Grid } from "@mui/material";
import Soldout from "../../../assets/images/sold-out.svg";
import defaultThumb from "../../../assets/images/seats/standard.png";

import "./rarity.scss";

const Rarity = ({ item, active, handleChange, disabled }) => {
  const disableClass = disabled ? "disabled" : "";
  return (
    <Grid
      item
      container
      xs={3}
      className={`card-item ${active} ${disableClass}`}
      onClick={() => !disabled && handleChange(item.code)}
    >
      {disabled && (
        <img className="img-soldout" src={Soldout} alt="img-soldout" />
      )}
      <Grid item xs={12}>
        <img 
          src={item.image} 
          alt="seat-img" 
          onError={(evt) => (evt.target.src = defaultThumb)}
        />
      </Grid>
      <Grid item xs={12} display="flex" justifyContent="center">
        <span className="title">{item.name}</span>
      </Grid>
    </Grid>
  );
};

export default Rarity;
