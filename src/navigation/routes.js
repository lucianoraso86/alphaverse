import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../containers/home/home";
import FanZone from "../containers/fanZone/fanZone";
import Gridmap from "../containers/gridmap/gridmap";
import World from "../containers/world/world";
import Country from "../containers/country/country";

const Navigation = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/fanzones" element={<FanZone />} />
      <Route path="/world" element={<World />} />
      <Route path="/world/:country" element={<Country />} />
      <Route path="/world/:country/:district" element={<Gridmap />} />
      <Route path="/world/:country/:district/:editor" element={<Gridmap />} />
    </Routes>
  );
};

export default Navigation;
