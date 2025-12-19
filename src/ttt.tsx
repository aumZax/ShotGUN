import { Routes, Route, Link } from "react-router-dom";
import Home from "./Pages/Home";
import { useState } from 'react';

export default function App() {
    const [showModal, setShowModal] = useState(false);
  return (
    <div className="min-h-screen">

      {/* ░░ TOP NAV BAR ░░ */}
      <div className="w-full h-12 leading-tight  shadow-md flex items-center justify-between px-2 z-10 relative bar-dark">

        {/* LEFT — เมนูต่างๆ */}
        <div className="flex items-center gap-6 text-sm">
          {/* โลโก้ */}
          <Link to="/">
            <img
              src="/icon/color.png"
              className="w-6 h-6 rounded-md object-cover"
              alt="logo"
            />
          </Link>

          <Link className="hover:text-blue-600 " to="/">Inbox</Link>
          <Link className="hover:text-blue-600 " to="/tasks">My Tasks</Link>
          <Link className="hover:text-blue-600 " to="/media">Media</Link>

          {/* Dropdown แบบง่าย */}
          <div className="relative group">
            <span className="hover:text-blue-600  cursor-pointer">
              Projects ▼
            </span>
            <div className="absolute hidden group-hover:block bg-white shadow rounded mt-1 w-32">
              <Link to="/p1" className="block px-3 py-2 hover:bg-gray-100">Project 1</Link>
              <Link to="/p2" className="block px-3 py-2 hover:bg-gray-100">Project 2</Link>
            </div>
          </div>

          <div className="relative group">
            <span className="hover:text-blue-600  cursor-pointer">
              All Pages ▼
            </span>
            <div className="absolute hidden group-hover:block bg-white shadow rounded mt-1 w-32">
              <Link to="/page1" className="block px-3 py-2 hover:bg-gray-100">Page 1</Link>
              <Link to="/page2" className="block px-3 py-2 hover:bg-gray-100">Page 2</Link>
            </div>
          </div>

          <Link className="hover:text-blue-600 " to="/people">People</Link>
          <Link className="hover:text-blue-600 " to="/apps">Apps ▼</Link>
        </div>

        {/* RIGHT — Search, Icons, Profile */}
        <div className="flex items-center gap-4">

          <div className="text-xl cursor-pointer">🔍</div>
          {/* ช่องค้นหา */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-full pl-2 pr-3 py-1 text-sm w-48 focus:outline-blue-400"
            />
          </div>

          {/* Icon: แจ้งเตือน */}
          <div className="text-xl cursor-pointer">🎁</div>

          {/* Icon: เพิ่ม */}
          <div className="text-xl cursor-pointer">➕</div>

          {/* Dark mode toggle */}
          <div className="text-xl cursor-pointer">🌙</div>

          {/* Profile Avatar */}
          <img
            src="\icon\black-dog.png"
            className="w-8 h-8 rounded-full object-cover"

            alt="profile"
          />
        </div>

      </div>



      {/* ░░ SECOND NAV BAR ░░ */}
      <div className="w-full h-14 px-4 flex items-center justify-between shadow-md bar-gray">

        {/* LEFT: Title */}
        <div className="flex items-center gap-2">
          <h2 className="text-base font-normal text-gray-300">
            Projects <span className="text-white/70 italic">— shared</span>
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            Add Project
          </button>
        </div>

        {/* Modal Overlay */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="border-b border-gray-700 p-6">
                <h2 className="text-2xl font-semibold text-white">
                  Create New Project
                </h2>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Project Name Input */}
                <input
                  type="text"
                  placeholder="Enter your project name..."
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none mb-6"
                />

                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-700 mb-6">
                  <button className="px-4 py-2 text-white border-b-2 border-blue-500 font-medium">
                    Templates
                  </button>
                  <button className="px-4 py-2 text-gray-400 hover:text-white">
                    Projects
                  </button>
                </div>

                {/* Description */}
                <p className="text-gray-400 mb-6">
                  Choose a template to use as the default for your new project.
                  Save any project as a template to establish best practices for
                  new projects.
                </p>

                {/* Templates Grid */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="aspect-square bg-blue-500 rounded flex items-center justify-center text-white text-center p-4 cursor-pointer hover:bg-blue-600 transition-colors">
                    <div>
                      <div className="font-semibold">Animation</div>
                      <div className="text-sm">Template</div>
                    </div>
                  </div>
                  <div className="aspect-square bg-blue-500 rounded flex items-center justify-center text-white text-center p-4 cursor-pointer hover:bg-blue-600 transition-colors">
                    <div>
                      <div className="font-semibold">Automotive</div>
                      <div className="text-sm">Design</div>
                      <div className="text-sm">Template</div>
                    </div>
                  </div>
                  <div className="aspect-square bg-blue-500 rounded flex items-center justify-center text-white text-center p-4 cursor-pointer hover:bg-blue-600 transition-colors">
                    <div>
                      <div className="font-semibold">Episodic TV</div>
                      <div className="text-sm">Template</div>
                    </div>
                  </div>
                  <div className="aspect-square bg-blue-500 rounded flex items-center justify-center text-white text-center p-4 cursor-pointer hover:bg-blue-600 transition-colors">
                    <div>
                      <div className="font-semibold">Film VFX</div>
                      <div className="text-sm">Template</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-700 p-6 flex justify-between items-center">
                <button className="text-gray-400 hover:text-white">
                  Use the advanced form...
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                    Create Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* RIGHT: Sub menu */}
        <div className="flex items-center gap-6 text-sm text-gray-300">
          <Link className="hover:text-blue-500" to="/schedule">Schedule</Link>
          <Link className="hover:text-blue-500" to="/assets">Assets</Link>
          <Link className="hover:text-blue-500" to="/sequences">Sequences</Link>
          <Link className="hover:text-blue-500" to="/shots">Shots</Link>
          <Link className="hover:text-blue-500" to="/review">Review</Link>
          <Link className="hover:text-blue-500" to="/crew">Crew</Link>
        </div>

      </div>





      {/* ░░ ROUTES ░░ */}
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>

    </div>
  );
}
