import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Grid, Select, MenuItem } from "@mui/material";

import Layout from "../../components/layout/layout";
import distictImg from "../../assets/images/districtImg.svg";
import StadiumLogo from "../../assets/images/stadiumLogo.svg";

import { getDistricts } from "../../redux/actions/districtActions";

import "./district.scss";

import { useNavigate } from "react-router-dom";

const District = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [codeDistrict, setCodeDistrict] = useState("");
  const [listDistrict, setListDistrict] = useState([]);

  const districtReducer = useSelector((state) => state.districtReducer);

  const listSpot = districtReducer.district[0]?.spots;

  const handleChangeDistrict = (codeDistrict) => {
    setCodeDistrict(codeDistrict);
  };

  useEffect(() => {
    dispatch(getDistricts());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setListDistrict(districtReducer);
    if (districtReducer?.district.length > 0) {
      setCodeDistrict(districtReducer.district[0].code);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtReducer]);

  return (
    <Layout hideFooter>
      <Grid container className="main-container">
        <Grid
          container
          item
          xs={12}
          sm={12}
          md={7}
          lg={8}
          className={"bg-stadium grid-stadium"}
          flexDirection="column"
        >
          <div className="fit-section">
            <Grid item container>
              <Grid item xs="auto" pt={2} pl={1}>
                <Select
                  value={codeDistrict}
                  onChange={handleChangeDistrict}
                  className="select"
                  inputProps={{
                    MenuProps: {
                      disableScrollLock: true,
                      MenuListProps: {
                        sx: {
                          backgroundColor: "#000",
                          color: "#fff",
                          "& .MuiMenuItem-root": {
                            fontWeight: 400,
                            fontSize: "20px",
                            fontFamily: "Evogria",
                          },
                        },
                      },
                    },
                  }}
                >
                  {listDistrict.district?.length > 0 &&
                    listDistrict.district.map((option, pos) => (
                      <MenuItem value={option.code} key={pos}>
                        {option.name}
                      </MenuItem>
                    ))}
                </Select>
              </Grid>
            </Grid>
          </div>

          <div className="strech-section">
            <img className="homeImg" src={distictImg} alt="homeImg" />
          </div>

          <div className="fit-section">
            <p className="subtitle">select an area of the district</p>
            <Grid container textAlign="center" justifyContent="space-between" p={1}>
              {listSpot?.length > 0 &&
                listSpot.map((spot) => (
                  <Grid item key={spot.code}>
                    <button onClick={() => navigate(`/home/${spot.code}`)} className={"btn"}>
                      <p>{spot.name}</p>
                    </button>
                  </Grid>
                ))}
            </Grid>
          </div>
        </Grid>
        <Grid container item xs={12} sm={12} md={5} lg={4} className={"grid-seats"}>
          <div className="flexContent">
            <img className="logo" src={StadiumLogo} alt="logo" />
            <p className="title">Welcome to Atletico Madrid</p>
          </div>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default District;
