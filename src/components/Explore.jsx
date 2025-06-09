import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addFeed } from "../utils/feedSlice";
import { BASE_URL } from "../utils/constants";
import ExploreFeedCard from "./ExploreFeedCard";

const Explore = () => {
  const exploreFeed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const [filterStatus, setFilterStatus] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter,setSkillFilter] = useState(""); 

  const getContent = async () => {
    try {
      const res = await axios.get(BASE_URL + "/explore", {
        withCredentials: true,
      });
      const users = res?.data?.data || [];
      dispatch(addFeed(users));
      setFilterData(users);
    } catch (err) {
      console.error("Failed to fetch explore feed", err);
    }
  };

  useEffect(() => {
    getContent();
  }, []);

useEffect(() => {
  let filtered = exploreFeed;

  if (filterStatus !== "") {
    filtered = filtered.filter(
      (user) =>
        user.status &&
        user.status.toLowerCase() === filterStatus.toLowerCase()
    );
  }


  if (searchTerm.trim() !== "") {
    filtered = filtered.filter((user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }


  if (skillFilter !== "") {
    filtered = filtered.filter(
      (user) =>
        user.skills &&
        user.skills.some(
          (skill) => skill.toLowerCase() === skillFilter.toLowerCase()
        )
    );
  }

  setFilterData(filtered);
}, [filterStatus, searchTerm, skillFilter, exploreFeed]);

const allSkills = Array.from(
  new Set(exploreFeed.flatMap((user) => user.skills || []))
);


  if (!exploreFeed) return <h1 className="flex justify-center my-10">Loading...</h1>;

  if (exploreFeed.length === 0)
    return <h1 className="flex justify-center my-10">No users found!</h1>;

  return (
    <div className="p-4">
      <div className="flex justify-end items-center gap-4 mb-4">
 <label className="input flex-grow relative border border-gray-300 rounded-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">

          <svg
            className="h-[1em] absolute left-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="search"
            placeholder="Search by name"
            className="w-full pl-10 py-2"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>

<select
  className="select select-bordered w-auto"
  value={skillFilter}
  onChange={(e) => setSkillFilter(e.target.value)}
>
  <option value="">All Skills</option>
  {allSkills.map((skill) => (
    <option key={skill} value={skill}>
      {skill}
    </option>
  ))}
</select>

<div className="flex items-center gap-2">
  <select
    className="select select-bordered w-auto"
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
  >
    <option value="">All Statuses</option>
    <option value="connected">Connected</option>
    <option value="notConnected">Not Connected</option>
  </select>

  <img
    src="https://static-00.iconduck.com/assets.00/filter-icon-512x512-v9trade2.png"
    alt="filter icon"
    className="h-6 w-6"
  />
</div>


      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filterData.map((user) => (
          <div
            key={user._id}
            className="inline-block transform scale-90 origin-top-left"
          >
            <ExploreFeedCard user={user} status={user.status} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
