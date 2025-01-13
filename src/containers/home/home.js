import { Container } from "@mui/material";

import Apps from "./components/apps";
import Layout from "../../components/layout/layout";

import "./home.scss";

const Home = () => {
  return (
    <Layout>
      <Container className="main">
        <div className="main-border">
          <Apps />
        </div>
      </Container>
    </Layout>
  );
};

export default Home;
