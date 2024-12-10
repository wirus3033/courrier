import React from "react";
import { AppBar, Toolbar, Box, Typography } from "@mui/material";
import logo from "../assets/logoFinance.png";

const Topbar = () => {
  return (
    <AppBar
      position="sticky"
      style={{
        background: "#129bc0",
        borderBottom: "1px solid white",
      }}
    >
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          GESTION DE COURRIER
        </Typography>
        <Box
          component="img"
          sx={{
            height: 80,
            marginLeft: 2,
          }}
          alt="Logo"
          src={logo}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
