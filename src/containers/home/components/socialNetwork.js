import React from "react";
import { Link, Stack } from "@mui/material";

import IconTelegram from "../../../assets/images/social/telegram.svg";
import IconReddit from "../../../assets/images/social/reddit.svg";
import IconTwitter from "../../../assets/images/social/twitter.svg";
import IconInstagram from "../../../assets/images/social/instagram.svg";
import IconFacebook from "../../../assets/images/social/facebook.svg";

const SocialNetwork = () => {
  return (
    <Stack
      direction="column"
      spacing={4}
      marginLeft={"1em"}
      marginRight={"10%"}
      alignContent={"center"}
      justifyContent={"center"}
      className="social-network-container"
    >
      <Link href="https://t.me/Alphaversegame" target="_blank" underline="none">
        <img src={IconTelegram} alt="IconTelegram" height={"18px"} width={"100%"} />
      </Link>
      <Link href="#" underline="none">
        <img src={IconReddit} alt="IconReddit" height={"18px"} width={"100%"} />
      </Link>
      <Link href="https://twitter.com/AlphaVersegame" target="_blank" underline="none">
        <img src={IconTwitter} alt="IconTwitter" height={"18px"} width={"100%"} />
      </Link>
      <Link href="https://www.instagram.com/alphaverse_game/" target="_blank" underline="none">
        <img src={IconInstagram} alt="IconInstagram" height={"18px"} width={"100%"} />
      </Link>
      <Link href="https://www.facebook.com/alphaversegame" target="_blank" underline="none">
        <img src={IconFacebook} alt="IconFacebook" height={"24px"} width={"100%"} />
      </Link>
    </Stack>
  );
};

export default SocialNetwork;
