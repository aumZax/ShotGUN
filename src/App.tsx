import { Routes, Route, Link, Outlet, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Project_Detail from "./Pages/Project/Project_Detail";

// ░░ Layout สำหรับหน้าที่มี Header ░░
function MainLayout() {
  return (
    <div className="min-h-screen">
      {/* ░░ TOP NAV BAR ░░ */}
      <header className="fixed  w-full h-12 leading-tight shadow-md flex items-center justify-between px-2 z-50 bar-dark">
        {/* LEFT — เมนูต่างๆ */}
        <div className="flex items-center gap-6 text-sm">
          <Link to="/Home">
            <img
              src="/icon/color.png"
              className="w-6 h-6 rounded-md object-cover"
              alt="logo"
            />
          </Link>
          <Link className="hover:text-blue-600" to="/">Login</Link>
          <Link className="hover:text-blue-600" to="/Task">My Task</Link>
          <Link className="hover:text-blue-600" to="/media">Media</Link>

          <div className="relative group">
            <span className="hover:text-blue-600 cursor-pointer">Projects ▼</span>
            <div className="absolute hidden group-hover:block bg-white shadow rounded mt-1 w-32 z-10">
              <Link to="/p1" className="block px-3 py-2 hover:bg-gray-100">Project 1</Link>
              <Link to="/p2" className="block px-3 py-2 hover:bg-gray-100">Project 2</Link>
            </div>
          </div>

          <div className="relative group">
            <span className="hover:text-blue-600 cursor-pointer">All Pages ▼</span>
            <div className="absolute hidden group-hover:block bg-white shadow rounded mt-1 w-32 z-10">
              <Link to="/page1" className="block px-3 py-2 hover:bg-gray-100">Page 1</Link>
              <Link to="/page2" className="block px-3 py-2 hover:bg-gray-100">Page 2</Link>
            </div>
          </div>

          <Link className="hover:text-blue-600" to="/people">People</Link>
          <Link className="hover:text-blue-600" to="/apps">Apps ▼</Link>
        </div>

        {/* RIGHT — Search, Icons, Profile */}
        <div className="flex items-center gap-4">
          <div className="text-xl cursor-pointer">🔍</div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-full pl-2 pr-3 py-1 text-sm w-48 focus:outline-blue-400"
            />
          </div>
          <div className="text-xl cursor-pointer">🎁</div>
          <div className="text-xl cursor-pointer">➕</div>
          <div className="text-xl cursor-pointer">🌙</div>
          <img
            src="/icon/black-dog.png"
            className="w-8 h-8 rounded-full object-cover"
            alt="profile"
          />
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
      
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />
      </Route>

      {/* Routes ที่มี Header */}
      <Route element={<MainLayout />}>
        <Route path="/Home" element={<Home />} />

         {/*<Route path="/" element={<Login />} />อย่าลืมเอาออก */}

        <Route path="/Project_Detail" element={<Project_Detail/>} />
        <Route path="/media" element={<div>Media Page</div>} />
        <Route path="/people" element={<div>People Page</div>} />
        {/* เพิ่ม route อื่นๆ ตามต้องการ */}
      </Route>
    </Routes>
  );
}