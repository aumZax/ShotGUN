import { Routes, Route, Link } from "react-router-dom";
import Home from "./Pages/Home";

export default function App() {
  
  return (
    <div className="min-h-screen">

      {/* ░░ TOP NAV BAR - Fixed ติดด้านบน ░░ */}
      <header className="fixed top-0 left-0 right-0 w-full h-12 leading-tight shadow-md flex items-center justify-between px-2 z-50 bar-dark">

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

          <Link className="hover:text-blue-600" to="/">Inbox</Link>
          <Link className="hover:text-blue-600" to="/tasks">My Tasks</Link>
          <Link className="hover:text-blue-600" to="/media">Media</Link>

          {/* Dropdown แบบง่าย */}
          <div className="relative group">
            <span className="hover:text-blue-600 cursor-pointer">
              Projects ▼
            </span>
            <div className="absolute hidden group-hover:block bg-white shadow rounded mt-1 w-32 z-10">
              <Link to="/p1" className="block px-3 py-2 hover:bg-gray-100">Project 1</Link>
              <Link to="/p2" className="block px-3 py-2 hover:bg-gray-100">Project 2</Link>
            </div>
          </div>

          <div className="relative group">
            <span className="hover:text-blue-600 cursor-pointer">
              All Pages ▼
            </span>
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
            src="/icon/black-dog.png"
            className="w-8 h-8 rounded-full object-cover"
            alt="profile"
          />
        </div>

      </header>

      {/* ░░ ROUTES - เพิ่ม padding-top เพื่อไม่ให้ content ถูกบัง ░░ */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>

    </div>
  );
}