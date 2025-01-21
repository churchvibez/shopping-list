import React from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Active from "./pages/Active";
import History from "./pages/History";
import { AppBar, Toolbar, Typography, Tabs, Tab, Box } from "@mui/material";

const App: React.FC = () => {
  const location = useLocation();
  const currentTab = location.pathname;

  return (
    <Box className="app-container" sx={{ minHeight: "100vh", backgroundColor: "rgb(221, 230, 220)" }}>
      <AppBar position="sticky" sx={{ backgroundColor: "rgb(148, 181, 145)" }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Список Покупок
          </Typography>
          <Tabs value={currentTab} textColor="inherit" indicatorColor="primary">
            <Tab
              label="Покупки"
              value="/active"
              component={Link}
              to="/active"
              sx={{ fontWeight: "bold" }}
            />
            <Tab
              label="Все продукты"
              value="/history"
              component={Link}
              to="/history"
              sx={{ fontWeight: "bold" }}
            />
          </Tabs>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: "2rem" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/active" replace />} />
          <Route path="/active" element={<Active />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Navigate to="/active" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
