import { Routes, Route, Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Home from "./Pages/Home";
import Inbox from "./Pages/Inbox";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Project_Detail from "./Pages/Project/Project_Detail";

import Project_Shot from "./Pages/Project/Project_Shot";
import Others_People from "./Pages/Project/Others_People";
import Others_AllForOne from "./Pages/Project/Others_AllForOne";
import Project_Assets from "./Pages/Project/Project_Assets";
import Project_Tasks from "./Pages/Project/Project_Tasks";
import Profile from "./Pages/Profile";


// import Project_Tasks from "./Pages/Project/Project_Tasks";
// import Project_Assets from "./Pages/Project/Project_Assets";
// import Project_Media from "./Pages/Project/Project_Media";



// ░░ Layout สำหรับหน้าที่มี Header ░░
function MainLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // ดึงข้อมูล user จาก localStorage แบบ lazy initialization
 const [authUser] = useState<{
  email: string;
  avatarURL: string;
}>(() => {
  try {
    const raw = localStorage.getItem("authUser");
    if (raw) {
      const u = JSON.parse(raw);
      return {
        email: u.email || "Anonymous@gmail.com",
        avatarURL: u.avatarURL || "/icon/black-dog.png",
      };
    }
  } catch (e) {
    console.error("AuthUser parse error:", e);
  }

  return {
    email: "Anonymous@gmail.com",
    avatarURL: "/icon/black-dog.png",
  };
});


  


  // ฟังก์ชัน Logout
  const handleLogout = () => {
    // ล้างข้อมูลทั้งหมดใน localStorage
    localStorage.clear();
    
    // นำทางไปยังหน้า Login
    navigate("/");
  };

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="min-h-screen">
      {/* ░░ TOP NAV BAR ░░ */}
      <header className="fixed  w-full h-14 leading-tight shadow-md flex items-center justify-between px-2 z-[150] bar-dark">
        {/* LEFT — เมนูต่างๆ */}
        <div className="flex items-center gap-6 text-sm">
          <Link to="/Home">
            <img
              src="/icon/color.png"
              className="w-12 h-12 rounded-md object-cover"
              alt="logo"
            />
          </Link>
          <Link className="hover:text-blue-600 text-xl" to="/Inbox">Inbox</Link>
          <Link className="hover:text-blue-600 text-xl" to="/Task">My Task</Link>
          <Link className="hover:text-blue-600 text-xl" to="/media">Media</Link>

          <div className="relative group">
            <span className="hover:text-blue-600 cursor-pointer text-xl">Projects ▼</span>
            <div className="absolute hidden group-hover:block bg-black shadow rounded mt-1 w-32 z-10">
              <Link to="/p1" className="block px-3 py-2 hover:bg-gray-100 text-xl">Project 1</Link>
              <Link to="/p2" className="block px-3 py-2 hover:bg-gray-100 text-xl">Project 2</Link>
            </div>
          </div>

          <div className="relative group">
            <span className="hover:text-blue-600 cursor-pointer text-xl">All Pages ▼</span>
            <div className="absolute hidden group-hover:block bg-black shadow rounded mt-1 w-32 z-10">
              <Link to="/page1" className="block px-3 py-2 hover:bg-gray-100 text-xl">Page 1</Link>
              <Link to="/page2" className="block px-3 py-2 hover:bg-gray-100 text-xl">Page 2</Link>
            </div>
          </div>

          <Link className="hover:text-blue-600 text-xl" to="/people">People</Link>
          <Link className="hover:text-blue-600 text-xl" to="/apps">Apps ▼</Link>
        </div>

        {/* RIGHT — Search, Icons, Profile */}
        <div className="flex items-center gap-4">
          <div className="text-xl cursor-pointer">
            <img
              src="/icon/search.png"
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
              alt="profile"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-full pl-2 pr-3 py-1 text-sm w-48 focus:outline-blue-400"
            />
          </div>
          <div className="text-xl cursor-pointer">
            <img
              src="/icon/gift.png"
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
              alt="profile"
            /></div>
          <div className="text-xl cursor-pointer">
            <img
              src="/icon/add.png"
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
              alt="profile"
            />
          </div>
          <div className="text-xl cursor-pointer">
             <img
              src="/icon/light.png"
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
              alt="profile"
            />
          </div>
          
          {/* Profile with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <img
              src={authUser.avatarURL}
              className="w-12 h-12 rounded-full object-cover cursor-pointer"
              alt="profile"
              onClick={() => setIsOpen(!isOpen)}
            />
            
            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bar-dark rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                 <a href="profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  {authUser.email}
                </a>
                <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </a>
             
                <hr className="my-2 border-gray-200" />
                <button 
                  onClick={handleLogout}
                  className="block dropDownLogOut px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content ของแต่ละหน้า - เพิ่ม padding-top */}
      <main className="">
        <Outlet />
      </main>
    </div>
  );
}

// ░░ Layout สำหรับหน้า Auth (ไม่มี Header) ░░
function AuthLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}

// ░░ Main App ░░
export default function App() {
  return (
    <Routes>
      {/* Routes ที่ไม่มี Header */}
      <Route element={<AuthLayout />}>
        {/* <Route path="/" element={<Login />} /> */}

        <Route path="/register" element={<Register />} />
      </Route>

      {/* Routes ที่มี Header */}
      <Route element={<MainLayout />}>
       {/* อย่าลืมเอาออก */}
        <Route path="/" element={<Login />} />



        <Route path="/Home" element={<Home />} />
        <Route path="/Inbox" element={<Inbox />} />
        <Route path="/Project_Detail" element={<Project_Detail/>} />

        <Route path="/Project_Detail" element={<Project_Detail/>} />
        <Route path="/Project_Shot" element={<Project_Shot/>} />
         <Route path="/Project_Assets" element={<Project_Assets/>} />
         <Route path="/Project_Tasks" element={<Project_Tasks/>} />
         <Route path="/Profile" element={<Profile/>} />


  

           
        <Route path="/:section/Others_AllForOne" element={<Others_AllForOne/>} />

        <Route path="/Others_People" element={<Others_People/>} />

        <Route path="/media" element={<div className="pt-20">Media Page</div>} />
        <Route path="/people" element={<div>People Page</div>} />

        {/* เพิ่ม route อื่นๆ ตามต้องการ */}
      </Route>
    </Routes>
  );
}