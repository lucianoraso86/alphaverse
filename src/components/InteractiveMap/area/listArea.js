import { Grid } from "@mui/material";
import Area from "./area";

import "./listArea.scss";

const ListAreasCard = ({ idArea, listArea, handleArea }) => {
  return (
    <Grid container className="square-container">
      {listArea?.length > 0 &&
        listArea.map((area) => (
          <Area
            key={area.code}
            area={area}
            active={idArea === area.code}
            handleArea={handleArea}
          />
        ))}
    </Grid>
  );
};

export default ListAreasCard;
