import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Files from "./pages/Files";
import Layout from "./components/Layout";
import Activity from "./pages/Activity";
import DMCA from "./pages/admin/DMCA";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/files" element={<Files />} />
         <Route path="/activity" element={<Activity />} />
          <Route path="/dmca" element={<DMCA />} />



        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
