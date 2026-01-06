import { useState } from "react";
import Navbar_Project from "../../components/Navbar_Project";
import { User, } from 'lucide-react';


export default function Others_People() {
    // Mock data with editable state
    const [people, setPeople] = useState([
        {
            id: 1,
            name: "Chanikarn Nonthai",
            email: "65011212006@msu.ac.th",
            status: "Active",
            permissionGroup: "Admin",
            projects: "My Animation",
            groups: "My Animation"
        },
        {
            id: 2,
            name: "Thanat Phisuthikul",
            email: "thanat.phisut@mail.com",
            status: "Active",
            permissionGroup: "Worker",
            projects: "My Animation",
            groups: "My Animation"
        },
        {
            id: 3,
            name: "Phisuthikul sssssss",
            email: "thanat.phisut@mail.com",
            status: "Active",
            permissionGroup: "Worker",
            projects: "My Animation",
            groups: "My Animation"
        }
    ]);

    const [editingCell, setEditingCell] = useState<{ id: number, field: string } | null>(null);
    const [editValue, setEditValue] = useState("");

    // Add People
    const [showCreatePerson, setShowCreatePerson] = useState(false);
    const [showMoreFields, setShowMoreFields] = useState(false);

    // Get current date and time
    const now = new Date();
    const isToday = true;
    const timeString = now.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    /* Column width control */
    const [columnWidths, setColumnWidths] = useState<number[]>([
        48, 220, 220, 260, 160, 200, 220,
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

    // Edit functions
    const handleCellClick = (id: number, field: string, currentValue: string) => {
        setEditingCell({ id, field });
        setEditValue(currentValue);
    };

    const handleCellBlur = () => {
        if (editingCell) {
            setPeople(people.map(p =>
                p.id === editingCell.id
                    ? { ...p, [editingCell.field]: editValue }
                    : p
            ));
        }
        setEditingCell(null);
        setEditValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCellBlur();
        } else if (e.key === 'Escape') {
            setEditingCell(null);
            setEditValue("");
        }
    };

    const totalSeats = 50;
    const usedSeats = people.length;
    const availableSeats = totalSeats - usedSeats;

    return (
        <div className="h-screen flex flex-col text-gray-200">
            <div className="pt-14">
                <Navbar_Project activeTab="other" />
            </div>
            <div className="pt-12">
                <header className="w-full h-22 px-4 flex items-center justify-between bar-gray border-b bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 backdrop-blur-sm shadow-lg">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">

                            <div className='flex'>
                                <h2 className="px-2 text-2xl font-normal bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    People
                                </h2>
                            <User className="w-8 h-8 text-blue-400 mr-3" />

                            </div>

                            <span className="text-sm text-gray-400">
                                {availableSeats}/{totalSeats} subscription seats available
                            </span>
                            <span className="text-2xl text-gray-400">|</span>
                            <span className="text-sm text-gray-400">
                                {usedSeats} currently in use on your Flow Production Tracking site
                            </span>
                        </div>

                        <div className="flex items-center gap-3 mt-2">


                            <button
                                onClick={() => setShowCreatePerson(true)}
                                className="px-4 h-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm font-medium rounded-lg flex items-center gap-1 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-blue-500/50 hover:scale-105"
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
                                placeholder="Search Asset..."
                                className="w-40 md:w-56 lg:w-64 h-8 pl-3 pr-10 bg-gray-800/50 border border-gray-600/50 rounded-lg text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/80 focus:bg-gray-800/80 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-200"
                            />
                        </div>
                    </div>
                </header>
            </div>

            {/* Excel-like Table */}
            <main className="flex-1 overflow-hidden">
                <div className="h-full overflow-hidden">
                    <div className="h-full overflow-x-auto overflow-y-auto">
                        <table
                            className="border-collapse table-fixed w-full"
                            style={{
                                width: columnWidths.reduce((a, b) => a + b, 0),
                            }}
                        >
                            {/* TABLE HEADER */}
                            <thead className="select-none">
                                <tr>
                                    {["", "Name", "Status", "Email", "Permission", "Projects", "Groups"].map((title, index) => (
                                        <th
                                            key={index}
                                            className="relative px-2 py-2 text-left text-xs font-semibold uppercase sticky top-0 z-30 bar-dark border border-white-700"
                                            style={{ width: columnWidths[index] }}
                                        >
                                            {title}
                                            <div
                                                onMouseDown={(e) => startResize(e, index)}
                                                className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
                                            />
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            {/* TABLE BODY */}
                            <tbody className="bar-gray">
                                {people.map((p) => (
                                    <tr key={p.id} className="border-t border-gray-500 hover:bg-gray-800">
                                        <td
                                            className="px-2 py-2 border-r border-gray-500"
                                            style={{ width: columnWidths[0] }}
                                        >
                                            <input type="checkbox" />
                                        </td>

                                        {/* Name */}
                                        <td
                                            className="px-3 py-1 border-r border-gray-500 cursor-pointer"
                                            style={{ width: columnWidths[1] }}
                                            onClick={() => handleCellClick(p.id, 'name', p.name)}
                                        >
                                            {editingCell?.id === p.id && editingCell?.field === 'name' ? (
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={handleCellBlur}
                                                    onKeyDown={handleKeyDown}
                                                    autoFocus
                                                    className="w-full bg-gray-700 border border-blue-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm">
                                                        {p.name.charAt(0)}
                                                    </div>
                                                    <div className="text-sm">{p.name}</div>
                                                </div>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td
                                            className="px-3 py-2 text-sm border-r border-gray-700 cursor-pointer"
                                            style={{ width: columnWidths[2] }}
                                            onClick={() => handleCellClick(p.id, 'status', p.status)}
                                        >
                                            {editingCell?.id === p.id && editingCell?.field === 'status' ? (
                                                <select
                                                    value={editValue}
                                                    onChange={(e) => {
                                                        setEditValue(e.target.value);
                                                        setPeople(people.map(person =>
                                                            person.id === p.id
                                                                ? { ...person, status: e.target.value }
                                                                : person
                                                        ));
                                                        setEditingCell(null);
                                                    }}
                                                    onBlur={handleCellBlur}
                                                    autoFocus
                                                    className="w-full bg-gray-700 border border-blue-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            ) : (
                                                p.status
                                            )}
                                        </td>

                                        {/* Email */}
                                        <td
                                            className="px-3 py-2 text-sm border-r border-gray-500 cursor-pointer"
                                            style={{ width: columnWidths[3] }}
                                            onClick={() => handleCellClick(p.id, 'email', p.email)}
                                        >
                                            {editingCell?.id === p.id && editingCell?.field === 'email' ? (
                                                <input
                                                    type="email"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={handleCellBlur}
                                                    onKeyDown={handleKeyDown}
                                                    autoFocus
                                                    className="w-full bg-gray-700 border border-blue-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
                                                />
                                            ) : (
                                                <span className="underline hover:text-blue-300">{p.email}</span>
                                            )}
                                        </td>

                                        {/* Permission */}
                                        <td
                                            className="px-3 py-2 text-sm border-r border-gray-700 cursor-pointer"
                                            style={{ width: columnWidths[4] }}
                                            onClick={() => handleCellClick(p.id, 'permissionGroup', p.permissionGroup)}
                                        >
                                            {editingCell?.id === p.id && editingCell?.field === 'permissionGroup' ? (
                                                <select
                                                    value={editValue}
                                                    onChange={(e) => {
                                                        setEditValue(e.target.value);
                                                        setPeople(people.map(person =>
                                                            person.id === p.id
                                                                ? { ...person, permissionGroup: e.target.value }
                                                                : person
                                                        ));
                                                        setEditingCell(null);
                                                    }}
                                                    onBlur={handleCellBlur}
                                                    autoFocus
                                                    className="w-full bg-gray-700 border border-blue-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
                                                >
                                                    <option value="Admin">Admin</option>
                                                    <option value="Worker">Worker</option>
                                                    <option value="Manager">Manager</option>
                                                </select>
                                            ) : (
                                                p.permissionGroup
                                            )}
                                        </td>

                                        {/* Projects */}
                                        <td
                                            className="px-3 py-2 text-sm border-r border-gray-500 cursor-pointer"
                                            style={{ width: columnWidths[5] }}
                                            onClick={() => handleCellClick(p.id, 'projects', p.projects)}
                                        >
                                            {editingCell?.id === p.id && editingCell?.field === 'projects' ? (
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={handleCellBlur}
                                                    onKeyDown={handleKeyDown}
                                                    autoFocus
                                                    className="w-full bg-gray-700 border border-blue-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
                                                />
                                            ) : (
                                                p.projects
                                            )}
                                        </td>

                                        {/* Groups */}
                                        <td
                                            className="px-3 py-2 text-sm border-r border-gray-500 cursor-pointer"
                                            style={{ width: columnWidths[6] }}
                                            onClick={() => handleCellClick(p.id, 'groups', p.groups)}
                                        >
                                            {editingCell?.id === p.id && editingCell?.field === 'groups' ? (
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={handleCellBlur}
                                                    onKeyDown={handleKeyDown}
                                                    autoFocus
                                                    className="w-full bg-gray-700 border border-blue-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
                                                />
                                            ) : (
                                                p.groups
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Create Person Modal */}
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