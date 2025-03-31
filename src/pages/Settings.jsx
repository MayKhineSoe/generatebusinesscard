import React from "react";

const Settings = () => {
  return (
    <div className="p-6 bg-blue-100 shadow-md rounded-lg h-screen">
      <h1 className="text-2xl font-semibold text-gray-700">Settings</h1>
      <p className="text-gray-500 mt-2">Manage your application settings here.</p>

      {/* Example Setting */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-600">
          Enable Dark Mode
        </label>
        <input type="checkbox" className="mt-2 w-6 h-6" />
      </div>
    </div>
  );
};

export default Settings;
