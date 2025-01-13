import { Grid } from "@mui/material";
import "./statusBox.scss";

const StatusBox = ({ item, active = true }) => {

  const percent = (item?.quantity * 100) / item?.total || 100;
  return (
    <Grid>
      {item?.open ? (
        <Grid item className={`btn-content ${item?.sold ? "disabled" : ""}`}>
          <div className="square" style={{ backgroundColor: item?.color }}>
            {percent.toFixed(0)}% {item?.sold && <span className="sold-out" />}
          </div>

          <button className={`info-content ${active ? "selected" : ""}`}>
            <span className="label-active">{item?.type}</span>
            <p className="text-square">{item?.name}</p>
            <p className="sm-text">
              <span className="bold">{item?.quantity}</span>
              &nbsp; available
            </p>
          </button>
        </Grid>
      ) : (
        <Grid item className="btn-content">
          <button className="square comming-soon" />
          <button className={`info-content ${active ? "selected" : ""}`}>+
            <span className="label-active">COMING SOON</span>
            <p className="text-square">{item?.name}</p>
          </button>
        </Grid>
      )}
    </Grid>
  );
};

export default StatusBox;
