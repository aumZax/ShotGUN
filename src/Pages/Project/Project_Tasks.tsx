import { useState } from "react";
import Navbar_Project from "../../components/Navbar_Project";

// Mock data from database
const mockTasks = [
    { id: 1, thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=100', name: 'Asset Builds / Drone Craft / Modeling', type: 'Task (Modeling)', status: 'Approved', assignee: 'Leandra Rosa', startDate: '2025-11-17', dueDate: '2025-11-21', bidDays: '3.00', workedDays: '2.44', diffDays: 0.56 },
    { id: 2, thumbnail: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=100', name: 'Asset Builds / Drone Craft / Lookdev', type: 'Task (Lookdev)', status: 'Approved', assignee: 'Tony Williams', startDate: '2025-11-24', dueDate: '2025-12-03', bidDays: '5.00', workedDays: '2.00', diffDays: 3.00 },
    { id: 3, thumbnail: 'https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?w=100', name: 'BikeChase / bc0030 / Tracking', type: 'Task (Tracking)', status: 'Approved', assignee: 'Aniela Morin', startDate: '2025-11-26', dueDate: '2025-12-01', bidDays: '3.00', workedDays: '1.00', diffDays: 2.00 },
    { id: 4, thumbnail: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=100', name: 'BikeChase / bc0040 / Tracking', type: 'Task (Tracking)', status: 'Approved', assignee: 'Aniela Morin', startDate: '2025-12-05', dueDate: '2025-12-09', bidDays: '2.50', workedDays: '1.31', diffDays: 1.19 },
    { id: 5, thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', name: 'BikeChase / bc0050 / Tracking', type: 'Task (Tracking)', status: 'Approved', assignee: 'Aniela Morin', startDate: '2025-12-10', dueDate: '2025-12-11', bidDays: '1.00', workedDays: '1.25', diffDays: -0.25 },
    { id: 6, thumbnail: 'https://images.unsplash.com/photo-1511994477422-b69e44bd4ea9?w=100', name: 'BikeChase / bc0060 / Tracking', type: 'Task (Tracking)', status: 'Approved', assignee: 'Aniela Morin', startDate: '2025-12-15', dueDate: '2025-12-16', bidDays: '1.25', workedDays: '0.94', diffDays: 0.31 },
    { id: 7, thumbnail: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=100', name: 'BikeChase / bc0030 / Rotoscoping', type: 'Task (Rotoscoping)', status: 'Approved', assignee: 'Aniela Morin', startDate: '2025-12-04', dueDate: '2025-12-11', bidDays: '5.00', workedDays: '1.00', diffDays: 4.00 },
    { id: 8, thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100', name: 'BikeChase / bc0040 / Rotoscoping', type: 'Task (Rotoscoping)', status: 'Approved', assignee: 'Aniela Morin', startDate: '2025-12-09', dueDate: '2025-12-12', bidDays: '3.00', workedDays: '1.69', diffDays: 1.31 },
    { id: 9, thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', name: 'BikeChase / bc0050 / Rotoscoping', type: 'Task (Rotoscoping)', status: 'Approved', assignee: 'Aniela Morin', startDate: '2025-12-11', dueDate: '2025-12-16', bidDays: '2.50', workedDays: '1.88', diffDays: 0.63 },
    { id: 10, thumbnail: 'https://images.unsplash.com/photo-1603349206295-dde20617cb6a?w=100', name: 'BikeChase / bc0060 / Rotoscoping', type: 'Task (Rotoscoping)', status: 'In progress', assignee: 'Aniela Morin', startDate: '2025-12-16', dueDate: '2025-12-18', bidDays: '1.50', workedDays: '1.25', diffDays: 0.25 },
    { id: 11, thumbnail: 'https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?w=100', name: 'BikeChase / bc0030 / Layout', type: 'Task (Layout)', status: 'Approved', assignee: 'Leandra Rosa', startDate: '2025-12-11', dueDate: '2025-12-16', bidDays: '3.00', workedDays: '1.50', diffDays: 1.50 },
    { id: 12, thumbnail: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=100', name: 'BikeChase / bc0040 / Layout', type: 'Task (Layout)', status: 'Approved', assignee: 'Leandra Rosa', startDate: '2025-12-12', dueDate: '2025-12-18', bidDays: '4.00', workedDays: '1.13', diffDays: 2.88 },
];
type Task = {
    id: number;
    thumbnail: string;
    name: string;
    type: string;
    status: string;
    assignee: string;
    startDate: string;
    dueDate: string;
    bidDays: string;
    workedDays: string;
    diffDays: number;
};

export default function Project_Tasks() {
    const [showCreateMytask, setShowCreateMytask] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const [rightPanelWidth, setRightPanelWidth] = useState(600);
    const [activeTab, setActiveTab] = useState('notes');
    const [isResizing, setIsResizing] = useState(false);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsResizing(true);
        e.preventDefault();
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isResizing) {
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth >= 400 && newWidth <= 1000) {
                setRightPanelWidth(newWidth);
            }
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };


    return (
        <div
            className="fixed inset-0 pt-14 bg-black"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <Navbar_Project activeTab="Tasks" />

            <main className="pt-12 h-[calc(100vh-3.5rem)] flex">
                {/* Main content */}
                <div
                    className="flex-1 flex flex-col bg-gray-900 overflow-hidden transition-all duration-300"
                    style={{ marginRight: selectedTask ? `${rightPanelWidth}px` : '0' }}
                >
                    <div className="flex-1 overflow-auto">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 bg-[#1a1d24] z-10">
                                <tr className="border-b border-gray-700">
                                    <th className="px-4 py-3 text-left text-sm font-normal text-gray-300 w-12"></th>
                                    <th className="px-4 py-3 text-left text-sm font-normal text-gray-300 w-16">
                                        <button onClick={() => setShowCreateMytask(true)} className="h-8 px-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm font-medium rounded-lg flex items-center gap-1 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-blue-500/50 hover:scale-105 whitespace-nowrap">
                                            Add Task
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-normal text-gray-300">
                                        <div className="flex items-center gap-1">
                                            Tasks ↑
                                            <div className="ml-4 text-xs text-gray-500">
                                                <div>Count (task)</div>
                                                <div className="font-semibold text-white">22</div>
                                            </div>
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-normal text-gray-300">Type</th>
                                    <th className="px-4 py-3 text-left text-sm font-normal text-gray-300">
                                        <div>Status</div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            <div>Done %</div>
                                            <div className="font-semibold text-white">63.64%</div>
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-normal text-gray-300">Assignee</th>
                                    <th className="px-4 py-3 text-left text-sm font-normal text-gray-300">
                                        <div>Start date</div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            <div>Min</div>
                                            <div className="font-semibold text-white">2025-11-17</div>
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-normal text-gray-300">
                                        <div>Due date</div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            <div>Max</div>
                                            <div className="font-semibold text-white">2025-12-29</div>
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-normal text-gray-300">
                                        <div>Bid days</div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            <div>Sum</div>
                                            <div className="font-semibold text-white">55.25</div>
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-normal text-gray-300">
                                        <div>Worked days</div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            <div>Sum</div>
                                            <div className="font-semibold text-white">29.31</div>
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-normal text-gray-300">
                                        <div>+/- days</div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            <div>Sum</div>
                                            <div className="font-semibold text-white">25.94</div>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockTasks.map((task, idx) => (
                                    <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-gray-400">{task.id}</td>
                                        <td className="px-4 py-3 flex items-center justify-center">
                                            <img src={task.thumbnail} alt="" className="w-12 h-12 object-cover rounded" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div
                                                className="flex items-center gap-2 text-sm text-blue-400 cursor-pointer hover:text-blue-300"
                                                onClick={() => setSelectedTask(task)}
                                            >
                                                <span className="text-lg">✓</span>
                                                <span>{task.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{task.type}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${task.status === 'Approved'
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-300">{task.assignee}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{task.startDate}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{task.dueDate}</td>
                                        <td className="px-4 py-3 text-sm text-gray-300">{task.bidDays}</td>
                                        <td className="px-4 py-3 text-sm text-gray-300">{task.workedDays}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-sm font-medium ${task.diffDays < 0 ? 'bg-red-500 text-white px-2 py-1 rounded' : 'text-gray-300'
                                                }`}>
                                                {task.diffDays}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Panel */}
                {selectedTask && (
                    <div
                        className="fixed right-0 top-26 bottom-0 bg-[#2a2d35] shadow-2xl flex"
                        style={{ width: `${rightPanelWidth}px` }}
                    >
                        {/* Resize Handle */}
                        <div
                            className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors"
                            onMouseDown={handleMouseDown}
                        />

                        {/* Panel Content */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {/* Header */}
                            <div className="bg-[#1a1d24] border-b border-gray-700">
                                <div className="flex items-center justify-between px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <img src={selectedTask.thumbnail} alt="" className="w-12 h-12 object-cover rounded" />
                                        <div>
                                            <div className="text-sm text-gray-400">
                                                Napo (Animation demo) › C005 › {selectedTask.name.split('/')[0].trim()}
                                            </div>
                                            <h2 className="text-xl text-white font-normal mt-1">
                                                <h2 className="text-xl text-white font-normal mt-1">
                                                    {selectedTask?.name.split('/').pop()?.trim()}
                                                </h2>

                                            </h2>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedTask(null)}
                                        className="text-gray-400 hover:text-white text-2xl"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Status bar */}
                                <div className="flex items-center gap-4 px-4 py-3">
                                    <span className={`px-3 py-1 rounded text-xs font-medium ${selectedTask.status === 'Approved'
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {selectedTask.status}
                                    </span>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <span>📅</span>
                                        <span>Due {selectedTask.dueDate}</span>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="flex border-t border-gray-700">
                                    <button
                                        onClick={() => setActiveTab('notes')}
                                        className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors ${activeTab === 'notes'
                                            ? 'text-white border-b-2 border-blue-500'
                                            : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        <span>📝</span>
                                        <span>NOTES</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('versions')}
                                        className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors ${activeTab === 'versions'
                                            ? 'text-white border-b-2 border-blue-500'
                                            : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        <span>💎</span>
                                        <span>VERSIONS</span>
                                    </button>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-auto p-4">
                                {activeTab === 'notes' && (
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Write a note..."
                                            className="w-full px-4 py-2 bg-[#1a1d24] border border-gray-700 rounded text-gray-300 text-sm focus:outline-none focus:border-blue-500 mb-4"
                                        />
                                        <div className="flex gap-2 mb-4">
                                            <input
                                                type="text"
                                                placeholder="Type to filter"
                                                className="flex-1 px-4 py-2 bg-[#1a1d24] border border-gray-700 rounded text-gray-300 text-sm focus:outline-none focus:border-blue-500"
                                            />
                                            <select className="px-4 py-2 bg-[#1a1d24] border border-gray-700 rounded text-gray-300 text-sm focus:outline-none focus:border-blue-500">
                                                <option>Any label</option>
                                            </select>
                                            <select className="px-4 py-2 bg-[#1a1d24] border border-gray-700 rounded text-gray-300 text-sm focus:outline-none focus:border-blue-500">
                                                <option>Any time</option>
                                            </select>
                                            <select className="px-4 py-2 bg-[#1a1d24] border border-gray-700 rounded text-gray-300 text-sm focus:outline-none focus:border-blue-500">
                                                <option>Any note</option>
                                            </select>
                                        </div>
                                        <div className="text-center text-gray-500 py-12">
                                            No notes
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'versions' && (
                                    <div>
                                        <div className="flex gap-2 mb-4 flex-wrap">
                                            <select className="px-4 py-2 bg-[#1a1d24] border border-gray-700 rounded text-gray-300 text-sm focus:outline-none focus:border-blue-500">
                                                <option>Any type</option>
                                            </select>
                                            <select className="px-4 py-2 bg-[#1a1d24] border border-gray-700 rounded text-gray-300 text-sm focus:outline-none focus:border-blue-500">
                                                <option>Any asset type</option>
                                            </select>
                                            <select className="px-4 py-2 bg-[#1a1d24] border border-gray-700 rounded text-gray-300 text-sm focus:outline-none focus:border-blue-500">
                                                <option>Any status</option>
                                            </select>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1d24] border border-gray-700 rounded text-gray-300 text-sm">
                                                <input type="checkbox" id="latestVersion" />
                                                <label htmlFor="latestVersion">Latest version</label>
                                            </div>
                                            <div className="flex-1"></div>
                                            <button className="p-2 bg-[#1a1d24] border border-gray-700 rounded hover:bg-gray-700">
                                                ⊞
                                            </button>
                                            <button className="p-2 bg-[#1a1d24] border border-gray-700 rounded hover:bg-gray-700">
                                                ☰
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {[1, 2, 3, 4].map((v) => (
                                                <div key={v} className="bg-[#1a1d24] rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors">
                                                    <div className="relative aspect-video bg-gray-800">
                                                        <img
                                                            src={selectedTask.thumbnail}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                                                            v{v}
                                                        </div>
                                                    </div>
                                                    <div className="p-3">
                                                        <div className="text-sm text-white mb-1">Animation v{v}</div>
                                                        <div className="text-xs text-gray-400 mb-2">{selectedTask.name.split('/')[0].trim()}</div>
                                                        <div className="text-xs text-gray-500 mb-2">Napo (Animation demo) / C...</div>
                                                        <div className="text-xs text-gray-400">Animation</div>
                                                        <div className={`mt-2 h-1 rounded ${v === 3 ? 'bg-emerald-500' : v === 2 ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                                            <div className="text-4xl text-gray-600 mb-2">☁️</div>
                                            <div className="text-sm text-gray-400">Drag and drop your files here, or browse</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {showCreateMytask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setShowCreateMytask(false)}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-2xl bg-[#4a4a4a] rounded shadow-2xl">
                        {/* Header */}
                        <div className="px-6 py-3 bg-[#3a3a3a] rounded-t flex items-center justify-between">
                            <h2 className="text-lg text-gray-200 font-normal">
                                Create a new Task <span className="text-gray-400 text-sm font-normal">- Global Form</span>
                            </h2>
                            <button
                                onClick={() => setShowCreateMytask(false)}
                                className="text-gray-400 hover:text-white text-xl"
                            >
                                ⚙️
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                <label className="text-sm text-gray-300 text-right">
                                    Task Name:
                                </label>
                                <input
                                    type="text"
                                    className="h-9 px-3 bg-[#3a3a3a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                <label className="text-sm text-gray-300 text-right">
                                    Link:
                                </label>
                                <input
                                    type="text"
                                    className="h-9 px-3 bg-[#3a3a3a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                <label className="text-sm text-gray-300 text-right">
                                    Pipeline Step:
                                </label>
                                <input
                                    type="text"
                                    className="h-9 px-3 bg-[#3a3a3a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                <label className="text-sm text-gray-300 text-right">
                                    Start Date:
                                </label>
                                <input
                                    type="text"
                                    className="h-9 px-3 bg-[#3a3a3a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                <label className="text-sm text-gray-300 text-right">
                                    Due Date:
                                </label>
                                <input
                                    type="text"
                                    className="h-9 px-3 bg-[#3a3a3a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                <label className="text-sm text-gray-300 text-right">
                                    Assigned To:
                                </label>
                                <input
                                    type="text"
                                    className="h-9 px-3 bg-[#3a3a3a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                <label className="text-sm text-gray-300 text-right">
                                    Reviewer:
                                </label>
                                <input
                                    type="text"
                                    className="h-9 px-3 bg-[#3a3a3a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                <label className="text-sm text-gray-300 text-right">
                                    Project:
                                </label>
                                <input
                                    type="text"
                                    className="h-9 px-3 bg-[#3a3a3a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                <div></div>
                                <button className="text-sm text-gray-400 hover:text-gray-200 text-left flex items-center gap-1">
                                    More fields <span>▾</span>
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3 bg-[#3a3a3a] rounded-b flex justify-end items-center gap-3">
                            <button
                                onClick={() => setShowCreateMytask(false)}
                                className="px-4 h-9 bg-[#5a5a5a] hover:bg-[#6a6a6a] text-white text-sm rounded flex items-center justify-center"
                            >
                                Cancel
                            </button>

                            <button
                                className="px-4 h-9 bg-[#2d7a9e] hover:bg-[#3a8db5] text-white text-sm rounded flex items-center justify-center"
                            >
                                Create Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}