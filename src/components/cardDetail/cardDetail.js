import { useState, useEffect } from "react";
import { Grid, CardMedia } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import "./cardDetail.scss";

const CardDetail = ({ item, handleClick }) => {

  const [isLoading, setIsLoading] = useState(true);

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
  }, [item?.animation_url]);

  return (
    <>
      <Grid item container sm={6} className="card-item-detail" onClick={handleClick}>
        <Grid item xs={12}>
          <div className="superior-content">
            <div className="head-title">
              {item?.display_name} {item?.token_id}
            </div>
          </div>
        </Grid>

        <Grid item xs={12} textAlign="center">
          {isLoading && (
            <Grid item container xs className="loader-container">
              <CircularProgress />
            </Grid>
          )}

          <CardMedia className={isLoading ? "d-none" : ""}>
            <video loop autoPlay height={"auto"} src={item?.animation_url} onLoadedData={handleLoadedData} style={{maxHeight: "420px"}} />
          </CardMedia>
        </Grid>

        <Grid item xs={12} display="flex" justifyContent="center">
          <span className={`title ${item?.rarity}`} style={{ color: item?.color }}>
            {item?.rarity}
          </span>
        </Grid>
      </Grid>
      
      <p className="text-disponible">{item?.available}</p>
      
      <div className="price-container">
        <img src={item?.currency?.image} className="coin" alt="coin" />
        <div className="sm-content">
          <div className="sm-symbol">{item?.currency?.symbol}</div>
          <div className="sm-price">${item?.price}</div>
        </div>
      </div>
    </>
  );
};

export default CardDetail;
