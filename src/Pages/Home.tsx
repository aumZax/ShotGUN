import { useState } from 'react';
import { useNavigate } from "react-router-dom";

type ViewMode = 'one' | 'four' | 'three';

export default function Home() {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('four'); // เริ่มต้นที่ view mode "four"

    const templates = [
        { id: 1, name: 'Animation', subtitle: 'Template' },
        { id: 2, name: 'Automotive', subtitle: 'Design Template' },
        { id: 3, name: 'Episodic TV', subtitle: 'Template' },
        { id: 4, name: 'Film VFX', subtitle: 'Template' }
    ];

    // ข้อมูลตัวอย่างสำหรับแสดงในตาราง
    const projectData = [
        {
            id: 1,
            name: 'Lizard Project',
            status: 'Active',
            lastModified: '2024-12-15',
            owner: 'John Doe',
            description: 'Lizards are a widespread group of squamate reptiles'
        },
        {
            id: 2,
            name: 'Animation Work',
            status: 'In Progress',
            lastModified: '2024-12-18',
            owner: 'Jane Smith',
            description: 'Animation project for client presentation'
        },
        {
            id: 3,
            name: 'Animation Work',
            status: 'In Progress',
            lastModified: '2024-12-18',
            owner: 'Jane Smith',
            description: 'Animation project for client presentation'
        },
        {
            id: 4,
            name: 'Animation Work',
            status: 'In Progress',
            lastModified: '2024-12-18',
            owner: 'Jane Smith',
            description: 'Animation project for client presentation'
        },
        {
            id: 5,
            name: 'Animation Work',
            status: 'In Progress',
            lastModified: '2024-12-18',
            owner: 'Jane Smith',
            description: 'Animation project for client presentation'
        }
    ];

    const handleTemplateSelect = (templateName: string) => {
        setSelectedTemplate(templateName);
        setProjectName(templateName);
    };


    return (
        <div className="pt-12 min-h-screen m-0 p-0 ">
            <header className="w-full h-20 px-4 flex items-center justify-between bg-gray-800 fixed z-40">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-normal text-gray-300">
                        Projects <span className="text-white italic">-- shared</span>
                    </h2>

                    <div className="flex items-center gap-3 mt-2">
                        {/* View mode buttons */}
                        <div className="flex items-center gap-1">
                            {/* ปุ่ม One */}
                            <button 
                                onClick={() => setViewMode('one')}
                                className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${
                                    viewMode === 'one' 
                                    ? 'bg-blue-600' 
                                    : 'hover:bg-gray-700'
                                }`}
                            >
                                <div className="w-5 h-5 bg-gray-300 rounded" />
                            </button>

                            {/* ปุ่ม Four - Default selected */}
                            <button 
                                onClick={() => setViewMode('four')}
                                className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${
                                    viewMode === 'four' 
                                    ? 'bg-blue-600' 
                                    : 'hover:bg-gray-700'
                                }`}
                            >
                                <div className="grid grid-cols-2 gap-1">
                                    <div className="w-2 h-2 bg-gray-300 rounded" />
                                    <div className="w-2 h-2 bg-gray-300 rounded" />
                                    <div className="w-2 h-2 bg-gray-300 rounded" />
                                    <div className="w-2 h-2 bg-gray-300 rounded" />
                                </div>
                            </button>
                            
                            {/* ปุ่ม Three - Table view */}
                            <button 
                                onClick={() => setViewMode('three')}
                                className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${
                                    viewMode === 'three' 
                                    ? 'bg-blue-600' 
                                    : 'hover:bg-gray-700'
                                }`}
                            >
                                <div className="flex flex-col gap-1">
                                    <div className="w-5 h-1 bg-gray-300 rounded" />
                                    <div className="w-5 h-1 bg-gray-300 rounded" />
                                    <div className="w-5 h-1 bg-gray-300 rounded" />
                                </div>
                            </button>
                        </div>

                        {/* Add Project button */}
                        <button 
                            onClick={() => setShowModal(true)} 
                            className="px-4 h-8 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded flex items-center gap-1"
                        >
                            Add Project
                            <span className="text-xs">▼</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Projects..."
                            className="w-64 h-8 pl-3 pr-10 bg-gray-700 border border-gray-600 rounded text-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
            </header>

            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-gray-800 rounded-lg shadow-2xl">
                        <div className="border-b border-gray-700 p-6">
                            <h2 className="text-2xl font-semibold text-white">
                                Create New Project
                            </h2>
                        </div>

                        <div className="p-6">
                            <input
                                type="text"
                                placeholder="Enter your project name..."
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none mb-6"
                            />

                            <div className="flex gap-4 border-b border-gray-700 mb-6">
                                <button className="px-4 py-2 text-white border-b-2 border-blue-500 font-medium">
                                    Templates
                                </button>
                                <button className="px-4 py-2 text-gray-400 hover:text-white">
                                    Projects
                                </button>
                            </div>

                            <p className="text-gray-400 mb-6">
                                Choose a template to use as the default for your new project.
                                Save any project as a template to establish best practices for
                                new projects.
                            </p>

                            <div className="grid grid-cols-4 gap-4 mb-6">
                                {templates.map((template) => (
                                    <div
                                        key={template.id}
                                        onClick={() => handleTemplateSelect(template.name)}
                                        className={`aspect-square rounded flex items-center justify-center text-white text-center p-4 cursor-pointer transition-all ${
                                            selectedTemplate === template.name
                                                ? 'bg-blue-700 ring-4 ring-blue-400 scale-105'
                                                : 'bg-blue-500 hover:bg-blue-600'
                                        }`}
                                    >
                                        <div>
                                            <div className="font-semibold">{template.name}</div>
                                            <div className="text-sm opacity-90">{template.subtitle}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-gray-700 p-6 flex justify-between items-center">
                            <button className="text-gray-400 hover:text-white transition-colors">
                                Use the advanced form...
                            </button>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setProjectName('');
                                        setSelectedTemplate('');
                                    }}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                     onClick={() => navigate("/Project_Detail")}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                                >
                                    Create Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main className="pt-24 pb-8 px-4 md:px-6 lg:px-8">
                {/* Grid View (default - four) */}
                {viewMode === 'four' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {projectData.map((project) => (
                            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                                <div className="h-40 bg-gray-300 flex items-center justify-center">
                                    <span className="text-gray-600">Project Image</span>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                                    <div className="mb-2">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            project.status === 'Active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                                    <p className="text-gray-500 text-xs">Owner: {project.owner}</p>
                                    <p className="text-gray-500 text-xs">Modified: {project.lastModified}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Table View (three) - แบบตาราง Excel */}
                {viewMode === 'three' && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-800 text-white">
                                        <th className="border border-gray-600 px-4 py-3 text-left font-semibold">
                                            Project Name
                                        </th>
                                        <th className="border border-gray-600 px-4 py-3 text-left font-semibold">
                                            Status
                                        </th>
                                        <th className="border border-gray-600 px-4 py-3 text-left font-semibold">
                                            Last Modified
                                        </th>
                                        <th className="border border-gray-600 px-4 py-3 text-left font-semibold">
                                            Owner
                                        </th>
                                        <th className="border border-gray-600 px-4 py-3 text-left font-semibold">
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projectData.map((project, index) => (
                                        <tr 
                                            key={project.id} 
                                            className={`hover:bg-gray-100 cursor-pointer ${
                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            }`}
                                        >
                                            <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                                                {project.name}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    project.status === 'Active' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-gray-700">
                                                {project.lastModified}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-gray-700">
                                                {project.owner}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-gray-600 text-sm">
                                                {project.description}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Single View (one) - เตรียมไว้สำหรับอนาคต */}
                {viewMode === 'one' && (
                    <div className="flex flex-col gap-6">
                        {projectData.map((project) => (
                            <div key={project.id} className="w-full max-w-4xl mx-auto">
                                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                                    <div className="h-64 bg-gray-300 flex items-center justify-center">
                                        <span className="text-gray-600 text-xl">Project Image</span>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <h2 className="text-3xl font-semibold">{project.name}</h2>
                                            <span className={`px-3 py-1 rounded text-sm font-medium ${
                                                project.status === 'Active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {project.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-4 text-lg">{project.description}</p>
                                        <div className="flex gap-6 text-gray-500">
                                            <p><span className="font-medium">Owner:</span> {project.owner}</p>
                                            <p><span className="font-medium">Last Modified:</span> {project.lastModified}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}