import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./components/layout/Dashboard";
import Login from "./components/auth";
import PrivateRoute from "./hooks/PrivateRoute";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import Profile from "./components/Profile/Profile";
import ModulePage from "./components/Form/page";
import {productsConfig} from "./config/products/config";
import { DarkModeProvider } from "./hooks/DarkModeContext";
import { SubmissionProvider } from "./components/Form/context";
import { salesConfig } from "./config/sales/config";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <DarkModeProvider>
        <SubmissionProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/products" element={<ModulePage config={productsConfig} showAddNew={true}/>} />
                  <Route path="/sales" element={<ModulePage config={salesConfig} showAddNew={true}/>} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Route>
            </Routes>
          </Router>
        </SubmissionProvider>
      </DarkModeProvider>
    </Provider>
  );
};

export default App;
