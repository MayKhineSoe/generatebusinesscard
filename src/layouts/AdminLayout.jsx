import { useState } from "react";
import {supabase} from '../utils/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { Link, Outlet } from "react-router-dom";
import { 
  Menu, X, LayoutDashboard, Users, Settings, LogOut, ChevronDown, ChevronUp, UserPlus, List
} from "lucide-react";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown state
    const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      console.log("User logged out successfully");
      navigate("/");
      window.location.reload(); // Reload the page or redirect
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-gradient-to-r from-indigo-300 via-blue-400 to-blue-300  text-white w-64 p-5 space-y-6 absolute md:relative md:block transition-all duration-300 ${
          isOpen ? "left-0" : "-left-64"
        } md:left-0`}
      >
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <nav className="mt-5 space-y-3">
          <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" setIsOpen={setIsOpen} />
          
          {/* Manage Profiles with Dropdown */}
          <div>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex justify-between items-center w-full p-2 rounded hover:bg-gradient-to-r from-red-300 via-pink-300 to-pink-200"
            >
              <div className="flex items-center space-x-2">
                <Users size={20} />
                <span>Manage Profiles</span>
              </div>
              {dropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="ml-6 mt-2 space-y-2">
                <SidebarLink to="/manageprofiles/viewall" icon={List} label="View All Profiles" setIsOpen={setIsOpen} />
                <SidebarLink to="/manageprofiles/create" icon={UserPlus} label="Create New Profile" setIsOpen={setIsOpen} />
              </div>
            )}
          </div>

          <SidebarLink to="/profiles" icon={Users} label="Profiles" setIsOpen={setIsOpen} />
          <SidebarLink to="/settings" icon={Settings} label="Settings" setIsOpen={setIsOpen} />
          
          {/* Logout Button */}
          <button onClick={handleLogout} className="flex items-center space-x-2 p-2 mt-5  hover:bg-gradient-to-r from-red-300 via-pink-300 to-pink-200">
            <LogOut size={20} /> <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Navbar */}
        <div className="bg-gradient-to-r from-blue-200 to-cyan-200 shadow-md p-4 flex justify-between items-center">
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h2 className="text-lg font-semibold ">Generate Business Card</h2>
        </div>
        
        {/* Page Content */}
        <div className="p-6">
          <Outlet /> {/* This will load the child routes (dashboard, profiles, etc.) */}
        </div>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon: Icon, label, setIsOpen }) => (
  <Link
    to={to}
    className="flex items-center space-x-2 p-2 rounded hover:bg-gradient-to-r from-red-300 via-pink-300 to-pink-200"
    onClick={() => setIsOpen(false)} // Close sidebar on mobile when clicked
  >
    <Icon size={20} />
    <span>{label}</span>
  </Link>
);

export default AdminLayout;
