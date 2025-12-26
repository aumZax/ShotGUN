import { useState } from 'react';
import Navbar_Project from "../../components/Navbar_Project";
import { useParams } from 'react-router-dom';
// Mock data from database
const mockShotData = {
    id: 1,
    shotCode: "bunny_020_0010",
    sequence: "bunny_020",
    status: "In Progress",
    tags: [],
    thumbnail: "https://via.placeholder.com/400x240/334155/cbd5e1?text=Shot+Thumbnail",
    description: "Main character enters the forest scene ",
    dueDate: "2024-01-15"
};


export default function Others_AllForOne() {
    // จำลอง useParams ด้วย useState
   
     const { section } = useParams();
    const [activeTab, setActiveTab] = useState('Activity');

    return (
        <div className="min-h-screen flex flex-col bg-gray-900">
            <div className="pt-14">

                <Navbar_Project activeTab="other" />
            </div>


            <div className="pt-12 flex-1">
                {section === 'Project_Assets' && (
                    <header className="w-full h-22 px-4 flex items-center justify-between bar-gray fixed z-[50]">

                        <div className="flex flex-col">
                            <h2 className="text-2xl font-normal text-gray-300">
                                Assets ⭐
                            </h2>

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

                                    <button
                                        className="w-15 h-11 flex items-center justify-center rounded transition-colors "
                                    >
                                        <img
                                            src="/icon/three.png"
                                            alt="view one"
                                        />
                                    </button>
                                </div>

                                <button
                                    // onClick={() => setShowCreateShot(true)}
                                    className="px-4 h-8 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded flex items-center gap-1"
                                >
                                    Add Shot
                                    <span className="text-xs">▼</span>
                                </button>

                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search Shot..."
                                    className="w-64 h-8 pl-3 pr-10 bg-gray-700 border border-gray-600 rounded text-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </header>
                )}

                {section === 'Project_Shot' && (
                    <div className="p-6">
                        <div className="w-full bg-gray-800 p-6 rounded-lg shadow-lg">
                            {/* Top Section - Shot Info */}
                            <div className="flex items-start justify-between mb-6">
                                {/* Left Side - Shot Details */}
                                <div className="flex gap-6 w-full">
                                    {/* Thumbnail */}
                                    <img
                                        src={mockShotData.thumbnail}
                                        alt="Shot thumbnail"
                                        className="w-80 h-44 object-cover rounded-lg shadow-md border-2 border-gray-700"
                                    />

                                    {/* Shot Info Grid */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex-1 space-y-3">
                                            
                                            <div className="flex items-center gap-8">

                                                <div className="min-w-[200px]">
                                                    <span className="text-gray-400 text-sm block mb-1">Shot Code</span>
                                                    <p className="text-gray-100 font-semibold text-lg">{mockShotData.shotCode}</p>
                                                </div>

                                                <div className="min-w-[200px]">
                                                    <span className="text-gray-400 text-sm block mb-1">Sequence</span>
                                                    <p className="text-gray-100 font-medium flex items-center gap-2">
                                                        📁 {mockShotData.sequence}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="min-w-[200px]">
                                                    <span className="text-gray-400 text-sm block mb-1">Status</span>
                                                    <div className={`inline-block px-3 py-1 ${mockShotData} text-white text-sm rounded-full font-medium`}>
                                                        {mockShotData.status}
                                                    </div>
                                                </div>

                                               
                                            </div>

                                            <div className="flex items-start gap-8">
                                                <div className="min-w-[200px]">
                                                    <span className="text-gray-400 text-sm block mb-1">Tags</span>
                                                    {mockShotData.tags.length > 0 ? (
                                                        <div className="flex gap-2 flex-wrap">
                                                            {mockShotData.tags.map((tag, index) => (
                                                                <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 text-sm italic">No tags </p>
                                                    )}
                                                </div>
                                            </div>

                                            
                                        </div>

                                    </div>
                                    
                                </div>

                                {/* Right Side - Actions */}
                                <div className="flex flex-col gap-3">
                                    <button className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors font-medium">
                                        👁️ Follow
                                    </button>
                                    <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors font-medium">
                                        ✏️ Edit
                                    </button>
                                    <button className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors font-medium">
                                        ✓ Complete
                                    </button>
                                </div>
                            </div>

                            {/* Additional Info Section */}
                            <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                                <div className="grid grid-cols-3 gap-6 text-sm">
                                    
                                    <div>
                                        <span className="text-gray-400 block mb-1 font-medium">Due Date</span>
                                        <p className="text-gray-100">{mockShotData.dueDate}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-1 font-medium">Description</span>
                                        <p className="text-gray-100">{mockShotData.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Section - Navigation Tabs */}
                            <nav className="flex items-center gap-6 border-t border-gray-700 pt-4">
                                {['Activity', 'Shot Info', 'Tasks', 'Notes', 'Versions', 'Assets', 'Publishes', 'Files', 'History'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-2 transition-all ${activeTab === tab
                                                ? 'text-white border-b-2 border-blue-500 font-medium'
                                                : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Content Area Below Tabs */}
                        <div className="mt-6 p-6 bg-gray-800 rounded-lg shadow-lg">
                            <h3 className="text-xl text-gray-200 mb-4 font-semibold flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-500 rounded"></span>
                                {activeTab}
                            </h3>

                            {activeTab === 'Activity' && (
                                <div className="space-y-3">
                                    <div className="p-4 bg-gray-700/50 rounded-lg border-l-4 border-blue-500">
                                        <p className="text-gray-300 text-sm">
                                            <span className="font-semibold text-blue-400">John Doe</span> updated status to "In Progress"
                                        </p>
                                        <p className="text-gray-500 text-xs mt-2">2 hours ago</p>
                                    </div>
                                    <div className="p-4 bg-gray-700/50 rounded-lg border-l-4 border-green-500">
                                        <p className="text-gray-300 text-sm">
                                            <span className="font-semibold text-green-400">Jane Smith</span> added a new version
                                        </p>
                                        <p className="text-gray-500 text-xs mt-2">5 hours ago</p>
                                    </div>
                                    <div className="p-4 bg-gray-700/50 rounded-lg border-l-4 border-purple-500">
                                        <p className="text-gray-300 text-sm">
                                            <span className="font-semibold text-purple-400">Mike Johnson</span> commented on this shot
                                        </p>
                                        <p className="text-gray-500 text-xs mt-2">1 day ago</p>
                                    </div>
                                </div>
                            )}

                            {activeTab !== 'Activity' && (
                                <div className="text-center py-12">
                                    <p className="text-gray-400">Content for {activeTab} will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}