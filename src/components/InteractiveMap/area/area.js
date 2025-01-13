import { Grid } from "@mui/material";
import starImg from "../../../assets/images/star.svg";
import "./area.scss";

const Area = ({ area, sector, active = true, handleArea }) => {
  const handleClick = () => {
    handleArea(area);
  };

  const soldout = sector ? sector?.nfts === sector?.purchased_nfts : area?.nfts === area?.purchased_nfts;
  const available = sector ? sector?.nfts - sector?.purchased_nfts : area?.nfts - area?.purchased_nfts;
  const percent = sector ? Math.floor((available * 100) / sector?.nfts) : Math.floor((available * 100) / area?.nfts);

  return (
    <Grid onClick={handleClick}>
      {area?.type === "stadium" ? (
        area.open ? (
          <Grid item className={`btn-content ${soldout ? "disabled" : ""}`}>
            <div className="square" style={{ backgroundColor: area.color }}>
              {percent}%{soldout && <span className="sold-out" />}
            </div>

            <button className={`info-content ${active ? "selected" : ""}`}>
              <span className="label-active">{sector?.name && `SECTOR ${sector.name}`}</span>
              <p className="text-square">{area.name}</p>
              <p className="value">{area.seats}</p>
              <p className="sm-text">
                <span className="bold">{available}</span>
                &nbsp; seats available
              </p>
            </button>
          </Grid>
        ) : (
          <Grid item className="btn-content">
            <button className="square comming-soon" />
            <button className={`info-content ${active ? "selected" : ""}`}>
              <span className="label-active">COMMING SOON</span>
              <p className="text-square">{area?.name}</p>
            </button>
          </Grid>
        )
      ) : (
        <Grid item className={`btn-content ${soldout ? "disabled" : ""}`}>
          <div className="square wall-square-bg">
            <div className="star content">
              <img className={"small-star"} src={starImg} alt="small-star" />
              <div className="centered number">{area?.order}</div>
            </div>
          </div>

          <button className={`info-content ${active ? "selected" : ""}`}>
            <span className="label-active">{sector?.name && `SECTOR ${sector.name}`}</span>
            <p className="text-square">{area.name}</p>
            <p className="value">{area.seats}</p>
            <p className="sm-text">
              <span className="bold">{available}</span>
              &nbsp; walls available
            </p>
          </button>
        </Grid>
      )}
    </Grid>
  );
};

export default Area;
