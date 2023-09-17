import "./App.css";
import React from "react";
import Home from "./Containers/Home/Home";
import Members from "./Containers/Members/Members";
import Login from "./Containers/Login/LoginContainer";
import Cookies from "js-cookie";

import axios from "axios";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:3001";
if (Cookies.get("token")) {
  let AUTH_TOKEN = `Bearer ${Cookies.get("token")}`;
  axios.defaults.headers.common["authorization"] = AUTH_TOKEN;
}

function RequireAuth({ children }) {
  const location = useLocation();
  if (!Cookies.get("token")) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/members"
        element={
          <RequireAuth>
            <Members />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
