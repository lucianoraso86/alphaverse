import { Grid } from "@mui/material";
import Soldout from "../../../assets/images/sold-out.svg";
import defaultThumb from "../../../assets/images/seats/standard.png";
import "./item.scss";

const Item = ({ item, active, color, disabled, handleChange }) => {
  const handleClick = (item) => {
    handleChange({
      ...item,
      color: color,
    });
  };

  return (
    <Grid
      item
      container
      xs={12}
      className={`list-item ${active} ${disabled ? "disabled" : ""}`}
      onClick={() => !disabled && handleClick(item)}
    >
      {item?.purchased && (
        <img className="img-soldout" src={Soldout} alt="img-soldout" />
      )}
      <Grid item container xs>
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="space-between"
          alignItems="start"
        >
          <h2 className="title">
            {item?.display_name} {item?.token_id}
          </h2>

          <div className="price-info">
            <span className="yellow">{item.available}</span>&nbsp;
          </div>
        </Grid>

        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="space-between"
          alignItems="end"
        >
          <div className="seat-info">
            <span className={`type ${item?.rarity}`} style={{ color: color }}>
              {item?.rarity}
            </span>
            &nbsp;
            <span>{item?.available}</span>
          </div>
          <div className="flex">
            <img src={item?.currency?.image} className="coin" alt="coin" />
            <div className="sm-content">
              <div className="sm-symbol">{item?.currency?.symbol}</div>
              <div className="sm-price">${item?.price}</div>
            </div>
          </div>
        </Grid>
      </Grid>

      <Grid item xs="auto">
        <img
          src={item?.image || defaultThumb}
          alt="seatLogo"
          onError={(evt) => (evt.target.src = defaultThumb)}
        />
      </Grid>
    </Grid>
  );
};

export default Item;
