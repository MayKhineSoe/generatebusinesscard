import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Profiles from "./pages/Profiles";
import Settings from "./pages/Settings";
import ManageProfiles from "./pages/ManageProfiles";
import ViewAllProfiles from "./pages/ViewAllProfiles";
import CreateNewProfiles from "./pages/CreateNewProfiles";
import FullProfileView from "./pages/FullProfileView";
import Auth from "./pages/Auth";

const App = () => {
  return (
    <Router>
      <Routes>
      {/* <Route path="/" element={<Auth />} />  Login/Signup Page */}

        {/* Admin Layout with Nested Routes */}
        <Route path="/" element={<AdminLayout />}>
          {/* <Route index element={<Dashboard />} />  Default route when visiting /admin */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manageprofiles" element={<ManageProfiles />} />
          <Route path="manageprofiles/viewall" element={<ViewAllProfiles />} />
          <Route path="manageprofiles/create" element={<CreateNewProfiles />} />
          
          <Route path="profiles" element={<Profiles />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/nbprintingservice/profile/:slug" element={<FullProfileView />} />
      </Routes>
    </Router>
  );
};

export default App;
