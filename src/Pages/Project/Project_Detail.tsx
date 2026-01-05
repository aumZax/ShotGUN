import React from 'react';
import { BarChart3, CheckCircle2, Clock, AlertCircle, Film, Image, ListChecks } from 'lucide-react';
import Navbar_Project from "../../components/Navbar_Project";


export default function Project_Detail() {
    // ข้อมูลตัวอย่าง
    const projectStats = {
        totalShots: 45,
        completedShots: 12,
        inProgressShots: 20,
        pendingShots: 13,
        totalAssets: 28,
        completedAssets: 15,
        inProgressAssets: 8,
        pendingAssets: 5,
        totalTasks: 156,
        completedTasks: 89,
        inProgressTasks: 45,
        pendingTasks: 22
    };

    const recentActivities = [
        { id: 1, type: 'shot', name: 'SH010_Animation', status: 'completed', user: 'John', time: '2 ชั่วโมงที่แล้ว' },
        { id: 2, type: 'asset', name: 'Character_Hero', status: 'in-review', user: 'Sarah', time: '3 ชั่วโมงที่แล้ว' },
        { id: 3, type: 'task', name: 'Lighting - SH015', status: 'in-progress', user: 'Mike', time: '5 ชั่วโมงที่แล้ว' },
        { id: 4, type: 'shot', name: 'SH022_Compositing', status: 'pending', user: 'Anna', time: '1 วันที่แล้ว' }
    ];

    // คำนวณเปอร์เซ็นต์
    const shotPercentage = Math.round((projectStats.completedShots / projectStats.totalShots) * 100);
    const assetPercentage = Math.round((projectStats.completedAssets / projectStats.totalAssets) * 100);
    const taskPercentage = Math.round((projectStats.completedTasks / projectStats.totalTasks) * 100);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="pt-14">
                    <Navbar_Project />
                </div>
                <div className="h-10"></div>
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                
                {/* Stats Cards */}
                <div className='p-5'>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Total Shots Card */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <Film className="w-8 h-8 text-purple-400 mr-3" />
                                    <div>
                                        <h3 className="text-gray-400 text-sm">Total Shots</h3>
                                        <span className="text-2xl font-bold text-white">{projectStats.totalShots}</span>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-purple-400">{shotPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${shotPercentage}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>{projectStats.completedShots} เสร็จแล้ว</span>
                                <span>{projectStats.totalShots - projectStats.completedShots} remaining</span>
                            </div>
                        </div>

                        {/* Total Assets Card */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <Image className="w-8 h-8 text-blue-400 mr-3" />
                                    <div>
                                        <h3 className="text-gray-400 text-sm">Total Assets</h3>
                                        <span className="text-2xl font-bold text-white">{projectStats.totalAssets}</span>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-blue-400">{assetPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${assetPercentage}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>{projectStats.completedAssets} เสร็จแล้ว</span>
                                <span>{projectStats.totalAssets - projectStats.completedAssets} remaining</span>
                            </div>
                        </div>

                        {/* Total Tasks Card */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <ListChecks className="w-8 h-8 text-green-400 mr-3" />
                                    <div>
                                        <h3 className="text-gray-400 text-sm">Total Tasks</h3>
                                        <span className="text-2xl font-bold text-white">{projectStats.totalTasks}</span>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-green-400">{taskPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${taskPercentage}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>{projectStats.completedTasks} เสร็จแล้ว</span>
                                <span>{projectStats.totalTasks - projectStats.completedTasks} remaining</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Overview - 2 Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Shots Status */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <Film className="w-5 h-5 mr-2 text-purple-400" />
                                Shots Status
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3 bg-gray-750 rounded-lg border border-gray-700">
                                    <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-green-400">{projectStats.completedShots}</p>
                                    <p className="text-xs text-gray-400">Completed</p>
                                </div>
                                <div className="text-center p-3 bg-gray-750 rounded-lg border border-gray-700">
                                    <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-blue-400">{projectStats.inProgressShots}</p>
                                    <p className="text-xs text-gray-400">In Progress</p>
                                </div>
                                <div className="text-center p-3 bg-gray-750 rounded-lg border border-gray-700">
                                    <AlertCircle className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-yellow-400">{projectStats.pendingShots}</p>
                                    <p className="text-xs text-gray-400">Pending</p>
                                </div>
                            </div>
                        </div>

                        {/* Assets Status */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <Image className="w-5 h-5 mr-2 text-blue-400" />
                                Assets Status
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3 bg-gray-750 rounded-lg border border-gray-700">
                                    <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-green-400">{projectStats.completedAssets}</p>
                                    <p className="text-xs text-gray-400">Completed</p>
                                </div>
                                <div className="text-center p-3 bg-gray-750 rounded-lg border border-gray-700">
                                    <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-blue-400">{projectStats.inProgressAssets}</p>
                                    <p className="text-xs text-gray-400">In Progress</p>
                                </div>
                                <div className="text-center p-3 bg-gray-750 rounded-lg border border-gray-700">
                                    <AlertCircle className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-yellow-400">{projectStats.pendingAssets}</p>
                                    <p className="text-xs text-gray-400">Pending</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-blue-400" />
                            กิจกรรมล่าสุด
                        </h2>
                        <div className="space-y-3">
                            {recentActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-center justify-between p-4 bg-gray-750 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.type === 'shot' ? 'bg-purple-500/20' :
                                            activity.type === 'asset' ? 'bg-blue-500/20' : 'bg-green-500/20'
                                            }`}>
                                            {activity.type === 'shot' && <Film className="w-5 h-5 text-purple-400" />}
                                            {activity.type === 'asset' && <Image className="w-5 h-5 text-blue-400" />}
                                            {activity.type === 'task' && <ListChecks className="w-5 h-5 text-green-400" />}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{activity.name}</p>
                                            <p className="text-gray-400 text-sm">โดย {activity.user} • {activity.time}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${activity.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                            activity.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                                                activity.status === 'in-review' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {activity.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}