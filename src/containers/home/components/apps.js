import React from "react";

import { Link, Stack } from "@mui/material";

import ImgAlphaverse from "../../../assets/images/home/alphaverse.svg";
import ImgFootball from "../../../assets/images/home/football.svg";
import ImgHoryou from "../../../assets/images/home/horyou.svg";

const Apps = () => {
  return (
    <Stack direction="row" spacing={3} px={3} className="home-list">
      <Link href="/#!">
        <img src={ImgAlphaverse} alt="ImgAlphaverse" />
      </Link>
      <Link href="/world">
        <img src={ImgHoryou} alt="ImgHoryou" />
      </Link>
      <Link href="/fanzones">
        <img src={ImgFootball} alt="ImgFootball" />
      </Link>
    </Stack>
  );
};

export default Apps;
