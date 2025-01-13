import { Grid } from "@mui/material";

import "./sectionButtons.scss";

const SectionButtons = ({ listSection, activeSection, handleChangeSection }) => {
  return (
    <Grid container textAlign="center" justifyContent="space-evenly" p={1} flexWrap="nowrap">
      {listSection?.length > 0 &&
        listSection.map((section) => (
          <Grid item key={section.code}>
            <button
              onClick={() => handleChangeSection(section)}
              className={`btn ${section.code === activeSection?.code ? "active" : ""}`}
            >
              <p>{section.name}</p>
            </button>
          </Grid>
        ))}
    </Grid>
  );
};

export default SectionButtons;
