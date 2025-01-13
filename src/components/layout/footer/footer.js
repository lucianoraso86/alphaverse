import React from "react";
import { Grid, Container, Stack, Link, Typography } from "@mui/material";

import IconFacebook from "../../../assets/images/social/facebook.svg";
import IconInstagram from "../../../assets/images/social/instagram.svg";
import IconDiscord from "../../../assets/images/social/discord.svg";
import IconTelegram from "../../../assets/images/social/telegram.svg";
import IconTwitter from "../../../assets/images/social/twitter.svg";

import "./footer.scss";

const Footer = () => {
  return (
    <div className="footer-container">
      <Container>
        <Grid container>
          <Grid item xs={2}>
            <Stack>
              <Link href="https://alphaverse.com/news/" target="_blank" underline="none">
                NEWS
              </Link>
              <Link href="mailto:contact@alphaverse.com" target="_blank" underline="none">
                CONTACT US
              </Link>
              <Link href="https://cbicorp.io/" target="_blank" underline="none">
                CORPORATE INFO
              </Link>
            </Stack>
          </Grid>
          <Grid item xs={2}>
            <Stack>
              <Link href="https://home.alphaverse.com/terms-of-use" target="_blank" underline="none">
                TERMS OF USE
              </Link>
              <Link href="https://alphaverse.com/token-disclaimer/" target="_blank" underline="none">
                TOKEN DISCLAIMER
              </Link>
              <Link href="https://alphaverse.com/aml-cft-policy/" target="_blank" underline="none">
                AML & CFT POLICY
              </Link>
            </Stack>
          </Grid>
          <Grid item xs={2}>
            <Stack>
              <Link href="https://alphaverse.com/cookie-policy/" target="_blank" underline="none">
                COOKIE POLICY
              </Link>
              <Link href="https://alphaverse.com/privacy-policy/" target="_blank" underline="none">
                PRIVACY POLICY
              </Link>
            </Stack>
          </Grid>

          <Grid item xs pt={2}>
            <Stack direction="row" spacing={3} justifyContent={"end"} className="social-icons">
              <Link href="https://t.me/Alphaversegame" target="_blank" underline="none">
                <img src={IconTelegram} alt="IconTelegram" />
              </Link>
              <Link href="https://discord.gg/FTVHJNu6Mb" target="_blank" underline="none">
                <img src={IconDiscord} alt="IconDiscord" />
              </Link>
              <Link href="https://twitter.com/AlphaVersegame" target="_blank" underline="none">
                <img src={IconTwitter} alt="IconTwitter" />
              </Link>
              <Link href="https://www.instagram.com/alphaverse_game/" target="_blank" underline="none">
                <img src={IconInstagram} alt="IconInstagram" />
              </Link>
              <Link href="https://www.facebook.com/alphaversegame" target="_blank" underline="none">
                <img src={IconFacebook} alt="IconFacebook" />
              </Link>
            </Stack>
          </Grid>
        </Grid>

        <Grid container py={2}>
          <Grid item xs={12}>
            <Typography className="bottom-text">Crypto Blockchain Industries, SA., 38 Rue de Berri, 75800, Paris</Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <Typography className="bottom-text">
              Copyright @2022 Crypto Blockchain Industries, SA. All rights reserved. “AlphaVerse”, the logos and any other AlphaVerse
              product or service name or logo are trademarks or service marks of Crypto Blockchain Industries, SA (“CBI”) and may not be
              copied, imitated or used, in whole or in part, except as expressly permitted in these Terms of Use or on the Site or with the
              prior written permission of CBI. The other trademarks are the ownership of their respective owners and may not be copied,
              imitated or used, in whole or in part, except as expressly permitted by these respective owners. The website and games are
              created and offered by Crypto Blockchain Industries, SA (“CBI”). The operation of such website and games are strictly under
              the supervision of CBI.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Footer;
