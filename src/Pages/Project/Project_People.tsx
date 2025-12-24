import Navbar_Project from "../../components/Navbar_Project";
import { useState } from "react";

export default function Project_People() {


    // Mock data จำลองข้อมูลจาก database
    const mockPeople = [
        {
            id: 1,
            name: "Chanikarn Nonthai",
            email: "chanikarn.no@mail.com",
            status: "Active",
            password: "65011212006@msu.ac.th",
            permissionGroup: "Admin",
            projects: "My Animation",
            groups: "My Animation"
        },
        {
            id: 2,
            name: "Thanat Phisuthikul",
            email: "thanat.phisut@mail.com",
            status: "Active",
            password: "thanat.phisut@gmail.com",
            permissionGroup: "Worker",
            projects: "My Animation",
            groups: "My Animation"
        },
        {
            id: 3,
            name: "Phisuthikul sssssss",
            email: "thanat.phisut@mail.com",
            status: "Active",
            password: "thanat.phisut@gmail.com",
            permissionGroup: "Worker",
            projects: "My Animation",
            groups: "My Animation"
        }
    ];

    // Add People
    const [showCreatePerson, setShowCreatePerson] = useState(true);
    const [showMoreFields, setShowMoreFields] = useState(false);

      // Get current date and time
    const now = new Date();
    const isToday = true; // Always show as "Today" for current date
    const timeString = now.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    });


    /* ================================
     Excel-like column width control
  ================================= */
    const [columnWidths, setColumnWidths] = useState<number[]>([
        48,   // checkbox
        220,  // name
        220,  // status
        260,  // email
        220,  // password
        160,  // permission
        200,  // projects
        220,  // groups
    ]);

    const startResize = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = columnWidths[index];

        const onMouseMove = (ev: MouseEvent) => {
            const newWidths = [...columnWidths];
            newWidths[index] = Math.max(80, startWidth + ev.clientX - startX);
            setColumnWidths(newWidths);
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };


    const totalSeats = 50;
    const usedSeats = mockPeople.length;
    const availableSeats = totalSeats - usedSeats;


    return (
        <div className="h-screen flex flex-col">
            <div className="pt-14">
                <Navbar_Project activeTab="other" />
            </div>
            <div className="pt-12">
                <header className="w-full h-22 px-4 flex items-center justify-between bar-gray fixed z-40">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-normal text-gray-300">
                                People ⭐
                            </h2>
                            <span className="text-sg text-gray-400">
                                {availableSeats}/{totalSeats} subscription seats available
                            </span>
                            <span className="text-2xl text-gray-400">
                                |
                            </span>
                            <span className="text-sg text-gray-400">
                                {usedSeats} currently in use on your Flow Production Tracking site
                            </span>
                        </div>

                        <div className="flex items-center gap-3 mt-2">


                            {/* View mode buttons */}
                            <div className="flex items-center gap-1">
                                <button className="w-15 h-11 flex items-center justify-center rounded transition-colors">
                                    <img
                                        src="/icon/one.png"
                                        alt="view one"
                                    />
                                </button>

                                <button className="w-15 h-11 flex items-center justify-center rounded transition-colors ">
                                    <img
                                        src="/icon/four.png"
                                        alt="view one"
                                    />
                                </button>

                                <button className="w-15 h-11 flex items-center justify-center rounded transition-colors ">
                                    <img
                                        src="/icon/three.png"
                                        alt="view one"
                                    />
                                </button>
                            </div>

                            <button
                                onClick={() => setShowCreatePerson(true)}
                                className="px-4 h-8 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded flex items-center gap-1"
                            >
                                Add Person
                                <span className="text-xs">▼</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search People..."
                                className="w-64 h-8 pl-3 pr-10 bg-gray-700 border border-gray-600 rounded text-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </header>
            </div>
            <div className="h-22"></div>

            {/* ===== Excel-like Table ===== */}
            <main className="flex-1 overflow-hidden">
                <div className="bar-gray h-full overflow-hidden">
                    <div className="h-full overflow-x-auto overflow-y-auto">
                        <table
                            className="border-collapse table-fixed w-full"
                            style={{
                                width: columnWidths.reduce((a, b) => a + b, 0),
                            }}
                        >
                            {/* ===== TABLE HEADER ===== */}
                            <thead className="select-none border border-white/30">
                                <tr>
                                    {[
                                        "",
                                        "Name",
                                        "Status",
                                        "Email",
                                        "Password",
                                        "Permission",
                                        "Projects",
                                        "Groups",
                                    ].map((title, index) => (
                                        <th
                                            key={index}
                                            className="
                                                    relative
                                                    px-2 py-2
                                                    text-left text-xs font-semibold uppercase
                                                    sticky top-0 z-30
                                                    bg-gray-700
                                                "
                                            style={{
                                                width: columnWidths[index],
                                                    boxShadow: `
                                                    inset 0 -1px 0 rgba(255,255,255,0.3),
                                                    inset -1px 0 0 rgba(255,255,255,0.3),
                                                    inset 1px 0 0 rgba(255,255,255,0.3),
                                                    inset 0 1px 0 rgba(255,255,255,0.3)
                                                    `,
                                            }}
                                        >

                                            {title}

                                            {/* resize handle */}
                                            <div
                                                onMouseDown={(e) => startResize(e, index)}
                                                className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
                                            />
                                        </th>
                                    ))}
                                </tr>
                            </thead>


                            {/* ===== TABLE BODY ===== */}
                            <tbody>
                                {mockPeople.map((p) => (
                                    <tr
                                        key={p.id}
                                        className="border-t border-gray-700 hover:bg-gray-750"
                                    >
                                        <td
                                            className="px-2 py-2 border-r border-gray-700"
                                            style={{ width: columnWidths[0] }}
                                        >
                                            <input type="checkbox" />
                                        </td>

                                        <td
                                            className="px-3 py-1 whitespace-nowrap overflow-hidden text-ellipsis border-r border-gray-700"
                                            style={{ width: columnWidths[1] }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bar-dark flex items-center justify-center text-white text-sm">
                                                    {p.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm">{p.name}</div>
                                                   
                                                </div>
                                            </div>
                                        </td>

                                        <td
                                            className="px-3 py-2 text-sm text-blue-400 whitespace-nowrap overflow-hidden text-ellipsis border-r border-gray-700"
                                            style={{ width: columnWidths[2] }}
                                        >
                                            {p.status}
                                        </td>

                                        <td
                                            className="px-3 py-2 text-sm text-blue-400 whitespace-nowrap overflow-hidden text-ellipsis border-r border-gray-700"
                                            style={{ width: columnWidths[3] }}
                                        >
                                            {p.email}
                                        </td>

                                        <td
                                            className="px-3 py-2 text-sm whitespace-nowrap overflow-hidden text-ellipsis border-r border-gray-700"
                                            style={{ width: columnWidths[4] }}
                                        >
                                            {p.password}
                                        </td>

                                        <td
                                            className="px-3 py-2 text-sm whitespace-nowrap border-r border-gray-700"
                                            style={{ width: columnWidths[5] }}
                                        >
                                            {p.permissionGroup}
                                        </td>

                                        <td
                                            className="px-3 py-2 text-sm text-blue-400 whitespace-nowrap border-r border-gray-700"
                                            style={{ width: columnWidths[6] }}
                                        >
                                            {p.projects}
                                        </td>

                                        <td
                                            className="px-3 py-2 text-sm text-blue-400 whitespace-nowrap border-r border-gray-700"
                                            style={{ width: columnWidths[7] }}
                                        >
                                            {p.groups}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {showCreatePerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowCreatePerson(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-2xl bg-[#3b3b3b] rounded shadow-xl">
            {/* Header */}
            <div className="px-5 py-3 border-b border-gray-600 flex items-center justify-between">
              <h2 className="text-lg text-gray-200 font-normal">
                Create a new Person <span className="text-gray-400 text-base font-normal">- Global Form</span>
              </h2>
              <button
                onClick={() => setShowCreatePerson(false)}
                className="text-gray-400 hover:text-white"
              >
                ⚙️
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                <label className="text-sm text-gray-300 text-right">
                  First Name:
                </label>
                <input
                  type="text"
                  className="w-full h-9 px-3 bg-[#4a4a4a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                <label className="text-sm text-gray-300 text-right">
                  Last Name:
                </label>
                <input
                  type="text"
                  className="w-full h-9 px-3 bg-[#4a4a4a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                <label className="text-sm text-gray-300 text-right">
                  Email:
                </label>
                <input
                  type="email"
                  className="w-full h-9 px-3 bg-[#4a4a4a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-[140px_1fr] items-start gap-3">
                <label className="text-sm text-gray-300 text-right pt-2">
                  Status:
                </label>
                <div>
                  <select className="w-full h-9 px-3 bg-[#4a4a4a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    จำนวนที่นั่งคงเหลือ 
                    <span className="text-white"> {availableSeats}/{totalSeats} ที่ </span> 
                    (ข้อมูลล่าสุด: {isToday ? 'วันนี้' : now.toLocaleDateString('th-TH')} เวลา {timeString})
                    </p>

                </div>
              </div>

              <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                <label className="text-sm text-gray-300 text-right">
                  Permission Group<br />
                  <span className="text-xs">(Artist, Admin, or Manager):</span>
                </label>
                <select className="w-full h-9 px-3 bg-[#4a4a4a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500">
                  <option>Artist</option>
                  <option>Admin</option>
                  <option>Manager</option>
                </select>
              </div>

              <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                <label className="text-sm text-gray-300 text-right">
                  Projects:
                </label>
                <input
                  type="text"
                  value="My AnimationAAAAAAAAAAAAAAAAA"
                  className="w-full h-9 px-3 bg-[#4a4a4a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                <div></div>
                <button 
                  onClick={() => setShowMoreFields(!showMoreFields)}
                  className="text-sm text-gray-300 hover:text-gray-100 text-left flex items-center gap-1"
                >
                  More fields {showMoreFields ? '▴' : '▾'}
                </button>
              </div>

              <div className="grid grid-cols-[140px_1fr] items-start gap-3 pt-2">
                <div></div>
               <p className="text-sm text-gray-300">
                ระบบจะเพิ่มผู้ใช้ใหม่โดยอัตโนมัติ
                </p>

              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-600 flex justify-between items-center">
              <button className="text-sm text-blue-400 hover:underline">
                Open Bulk Import
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowCreatePerson(false)}
                  className="px-4 h-9 bg-[#4a4a4a] hover:bg-[#555555] text-gray-200 text-sm rounded flex items-center justify-center"
                >
                  Cancel
                </button>

                <button className="px-4 h-9 bg-[#4a4a4a] hover:bg-[#555555] text-gray-200 text-sm rounded flex items-center justify-center">
                  Add another person
                </button>

                <button className="px-4 h-9 bg-[#00a8e1] hover:bg-[#0096c7] text-white text-sm rounded flex items-center justify-center">
                  Add person
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


        </div>
    );
}
