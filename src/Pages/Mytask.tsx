import { useState } from 'react';

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

export default function Mytask() {
    const [showCreateMytask, setShowCreateMytask] = useState(false);
    
    return (
        <div className="pt-14 min-h-screen m-0 p-0 bg-black">
            <header className="w-full h-16 px-4 flex items-center justify-between bg-gray-900 sticky top-0 z-40 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 backdrop-blur-sm shadow-lg z-40">
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-semibold text-gray-200 flex items-center px-8 whitespace-nowrap">
                        My Task
                    </span>

                   
                    {/* Action buttons */}
                                
                    <button onClick={() => setShowCreateMytask(true)} className="h-8 px-3 text-gray-300 text-sm flex items-center  bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm font-medium rounded-lg flex items-center gap-1 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-blue-500/50 hover:scale-105 whitespace-nowrap">
                        Add Task
                    </button>

              
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Inbox..."
                            className="w-40 md:w-56 lg:w-64 h-8 pl-3 pr-10 bg-gray-800/50 border border-gray-600/50 rounded-lg text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/80 focus:bg-gray-800/80 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-200"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                    </div>

                    {/* Settings button */}
                    <button className="w-12 h-8 flex items-center justify-center  bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm font-medium rounded-lg flex items-center gap-1 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-blue-500/50 hover:scale-105">
                        <img
                            src="/icon/settings.png"
                            className="max-w-6 max-h-6 object-contain"
                        />
                    </button>
                </div>
            </header>

            <main className="flex h-[calc(100vh-8rem)]">
                {/* Main content */}
                <div className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
                    <div className="flex-1 overflow-auto">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 bg-[#1a1d24] z-10">
                                <tr className="border-b border-gray-700">
                                    <th className="px-4 py-3 text-left text-sm font-normal text-gray-300 w-12"></th>
                                    <th className="px-4 py-3 text-left text-sm font-normal text-gray-300 w-16"></th>
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
                                        <td className="px-4 py-3">
                                            <img src={task.thumbnail} alt="" className="w-12 h-12 object-cover rounded" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 text-sm text-blue-400">
                                                <span className="text-lg">✓</span>
                                                <span>{task.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{task.type}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                task.status === 'Approved' 
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
                                            <span className={`text-sm font-medium ${
                                                task.diffDays < 0 ? 'bg-red-500 text-white px-2 py-1 rounded' : 'text-gray-300'
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
            </main>
            
            {showCreateMytask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setShowCreateMytask(false)}
                    />

                    {/* Modal */}
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