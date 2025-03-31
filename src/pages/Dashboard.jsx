import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { MdSpaceDashboard, MdRecentActors, MdAutoGraph } from "react-icons/md";


const Dashboard = () => {

  const [totalProfiles, setTotalProfiles] = useState(0);
  const [newProfileThisMonth, setNewProfileThisMonth] = useState(0);
  const [newProfilesThisWeek, setNewProfilesThisWeek] = useState(0);
  const [recentProfiles, setRecentProfiles] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchProfiles();
    fetchRecentProfiles();
    weeklyProfileChart();
  }, [])

  const fetchProfiles = async () => {
    const { data, error } = await supabase.from("business_cards").select("*");

    if (error) {
      console.error("Error Fetching Profiles:", error);
      return;
    }

    // Total Profiles Count
    setTotalProfiles(data.length);

    // Filter Profiles created this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const dayOfWeek = new Date().getDay();// Get the current day of the week (0 - Sunday, 1 - Monday, ..., 6 - Saturday)

    // Calculate the date for the start of the current week (Sunday)
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek); // Adjust the date back to the previous Sunday

    // Filter profiles created this month
    const newProfiles = data.filter((profile) => {
      const createdAt = new Date(profile.created_at);
      return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
    })

    // Filter profiles created this week
    const newProfilesThisWeek = data.filter((profile) => {
      const createdAt = new Date(profile.created_at);
      return createdAt >= startOfWeek;
    });

    setNewProfileThisMonth(newProfiles.length)
    setNewProfilesThisWeek(newProfilesThisWeek.length)
  }

  const fetchRecentProfiles = async () => {
    const { data, error } = await supabase
      .from("business_cards")
      .select("*")
      .order("created_at", { ascending: false }) //sort by newest first
      .limit(3);

    if (error) {
      console.error("Error Fetching Recent Profiles:", error);
      return;
    }

    setRecentProfiles(data); //save to state
  }

  // Function to Get Week Number
  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  };

  // Weekly Profile Chart
  const weeklyProfileChart = async () => {
    const { data, error } = await supabase
      .from("business_cards")
      .select("created_at")

    if (error) {
      console.error("Error Fetching Profile Data:", error);
      return;
    }

    // Process Data to Group by Week
    const weeklyData = data.reduce((acc, { created_at }) => {
      const weekNumber = getWeekNumber(created_at)
      acc[weekNumber] = (acc[weekNumber] || 0) + 1;
      return acc;
    }, {});

    // Convert Object to Array for Chart
    // const formattedData = Object.keys(weeklyData).map((week) => {
    //   const startOfWeek = new Date(new Date().getFullYear(), 0, (week - 1) * 7 + 1);
    //   return {
    //     week: `Start: ${startOfWeek.toLocaleDateString()}`,
    //     count: weeklyData[week],
    //   };
    // });

    // Convert Object to Array for Chart
    const formattedData = Object.keys(weeklyData).map((week) => ({
      week: `Week ${week}`,
      count: weeklyData[week],
    }));

    setChartData(formattedData)

  }

  return (
    <div className="p-6">
      <h1 className="flex items-center text-2xl font-semibold mb-4"><MdSpaceDashboard className='mr-2 text-blue-400' />Dashboard</h1>

      <div className='grid grid-cols-3 md:grid-cols-3 gap-3 items-center'>
        {/* Total Profiles */}
        <div className="bg-gradient-to-r h-44 from-red-300 via-pink-300 to-pink-200 text-white p-7 rounded-lg shadow-md">
          <h2 className="text-lg">Total Profiles</h2>
          <p className="text-3xl font-bold">{totalProfiles}</p>
          <p className='text-sm pt-7'>All Profiles currently stored</p>
        </div>

        {/* New Profiles This Month */}
        <div className="bg-gradient-to-r h-44 from-indigo-300 via-blue-400 to-blue-300 text-white p-7 rounded-lg shadow-md">
          <h2 className="text-lg">New Profiles This Month</h2>
          <p className="text-3xl font-bold">{newProfileThisMonth}</p>
          <p className='text-sm pt-7'>Added in the last 30 days</p>
        </div>

        {/* New Profiles This Weeks */}
        <div className="bg-gradient-to-r h-44 from-teal-300 via-cyan-400 to-cyan-300 text-white p-7 rounded-lg shadow-md">
          <h2 className="text-lg">New Profiles This Week</h2>
          <p className="text-3xl font-bold">{newProfilesThisWeek}</p>
          <p className='text-sm pt-7'>Created since this week's start</p>
        </div>
      </div>

      {/* Recent Profiles */}

      <div className='mt-12'>
        <h2 className="flex items-center text-2xl font-semibold mb-4 mt-7"><MdRecentActors className='mr-2 text-blue-400' />Recent Profiles</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 place-items-center gap-4 px-6">
          {recentProfiles.map((profile) => (
            <div
              key={profile.id}
              className="w-full  bg-white shadow-md rounded-xl overflow-hidden 
                 p-5 transform space-y-2 transition-all hover:scale-105 hover:shadow-lg"
            >
              {/* Profile Image */}
              <div className="w-20 h-20 mx-auto mb-3">
                <img
                  src={profile.profile_image}
                  className="w-full h-full object-cover rounded-full border border-gray-300"
                />
              </div>

              {/* Profile Name */}
              <h2 className="text-lg font-bold text-center" style={{ color: profile?.color || "#f87171" }}>
                {profile.name || "No Name"}
              </h2>

              {/* Job Title & Company */}
              <p className="text-sm text-center text-gray-600">{profile.job_title || "No Title"}</p>
              <p className="text-xs text-center text-gray-400">{profile.company || "No Company"}</p>


            </div>
          ))}
        </div>

        {/* Weekly Profiles Chart */}
        <div className='mt-12'>
          <h1 className="flex items-center text-2xl font-semibold mb-4"><MdAutoGraph className='mr-2 text-blue-400' />Profiles Created Per Week</h1>

          <div className="bg-white p-6 rounded-lg shadow-lg mt-5">

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 12, fill: "#555" }}
                  angle={-10}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 12, fill: "#555" }} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", padding: "10px" }} />
                <Legend />
                <Bar dataKey="count" fill="url(#gradient)" radius={[8, 8, 0, 0]} barSize={40} />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard