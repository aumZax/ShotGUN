import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ENDPOINTS from "../config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";


type ViewMode = 'one' | 'four' | 'three';

interface Project {
    id: string;
    name: string;
    status: string;
    lastModified: string;
    owner: string;
    description: string;
    image?: string; // เพิ่ม field สำหรับเก็บรูปภาพ
}

interface ProjectApiData {
    projectId?: string;
    id?: string;
    projectName: string;
    createdAt: string;
    createdBy?: {
        name?: string;
        username?: string;
        uid?: string;
    };
    description?: string;
    status?: string;
}

export default function Home() {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('four');
    const [, setLoading] = useState(false);
    const [projectData, setProjectData] = useState<Project[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});


    const templates = [
        { id: 1, name: 'Animation', subtitle: 'Template' },
        { id: 2, name: 'Automotive', subtitle: 'Design Template' },
        { id: 3, name: 'Episodic TV', subtitle: 'Template' },
        { id: 4, name: 'Film VFX', subtitle: 'Template' }
    ];

    // ดึงข้อมูล projects ตอน component mount
    useEffect(() => {
        fetchProjects();

    }, []);

    //  Function ดึงรูปจาก backend
    const fetchProjectImages = async (projects: Project[]) => {
        if (!projects.length) return;

        try {
            const projectIds = projects.map(p => p.id);

            const { data } = await axios.post(ENDPOINTS.GETPROJECTIMAGES, {
                projectIds,
            });

            const images = data.images as Record<string, string>;

            setProjectData(prev =>
                prev.map(p =>
                    images[p.id] && images[p.id] !== p.image
                        ? { ...p, image: images[p.id] }
                        : p
                )
            );

        } catch (err) {
            console.error("❌ Error fetching project images:", err);
        }
    };

    const fetchProjects = async () => {
        setLoadingProjects(true);

        try {
            const authUser = getAuthUser();
            const uid =
                authUser?.uid ??
                authUser?.username ??
                authUser?.id ??
                "admin";

            const { data } = await axios.post<{ projects: ProjectApiData[] }>(
                ENDPOINTS.PROJECTLIST,
                { uid }
            );

            const projects: Project[] = data.projects.map(p => ({
                id: p.projectId ?? p.id ?? "",
                name: p.projectName,
                status: p.status ?? "Active",
                lastModified: new Date(p.createdAt).toLocaleDateString("en-CA"),
                owner: p.createdBy?.name ?? p.createdBy?.username ?? "Unknown",
                description: p.description ?? "No description",
                image: undefined,
            }));

            setProjectData(projects);

            // ⚡ โหลดรูปแบบ async ไม่ block UI
            if (projects.length) {
                fetchProjectImages(projects);
            }

        } catch (err) {
            console.error("Error fetching projects:", err);
            setProjectData([]);
        } finally {
            setLoadingProjects(false);
        }
    };

    const [, setError] = useState("");

    // Fix: Handle null and invalid JSON from localStorage
    const getAuthUser = () => {
        try {
            const authUserString = localStorage.getItem("authUser");
            if (!authUserString || authUserString === "undefined" || authUserString === "null") {
                return null;
            }
            return JSON.parse(authUserString);
        } catch (error) {
            console.error("Error parsing authUser:", error);
            return null;
        }
    };

    const handleTemplateSelect = (templateName: string) => {
        setSelectedTemplate(templateName);
        setProjectName(templateName);
    };

    // ฟังก์ชันเมื่อคลิกที่รูป
    const handleImageClick = (projectId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // ป้องกันไม่ให้ trigger handleProjectClick
        fileInputRefs.current[projectId]?.click();
    };

    // ฟังก์ชันเมื่อเลือกไฟล์
    const handleFileChange = async (
        projectId: string,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const storagePath = `projects/${projectId}/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, storagePath);

        try {
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            // ⚡ update UI ทันที (ไม่ต้องรอ backend)
            setProjectData(prev =>
                prev.map(p =>
                    p.id === projectId && p.image !== downloadURL
                        ? { ...p, image: downloadURL }
                        : p
                )
            );

            // 🔄 sync backend (background)
            axios.post(ENDPOINTS.UPLOAD, {
                projectId,
                downloadURL,
                filename: file.name,
                storagePath,
                type: "images",
                description: "project image",
            });

        } catch (err) {
            console.error("❌ upload error", err);
        }
    };

    // ✅ ฟังก์ชันสำหรับคลิก project card
    const handleProjectClick = async (project: Project) => {
        const projectId = project.id;
        if (!projectId) return;

        const baseData = {
            projectId,
            projectName: project.name,
            fetchedAt: new Date().toISOString(),
        };

        try {
            // ⚡ ดึงข้อมูลพร้อมกัน
            const [{ data: projectInfo }, { data: projectDetails }] = await Promise.all([
                axios.post(ENDPOINTS.PROJECTINFO, { projectId }),
                axios.post(ENDPOINTS.PROJECTDETAIL, { projectId }),
            ]);

            localStorage.setItem(
                "projectData",
                JSON.stringify({
                    ...baseData,
                    projectInfo,
                    projectDetails,
                })
            );

        } catch {
            localStorage.setItem(
                "projectData",
                JSON.stringify({
                    ...baseData,
                    projectInfo: null,
                    projectDetails: null,
                    error: "Failed to fetch full data",
                })
            );
        }
        // 🚀 ไปหน้า detail ทันที ไม่ต้องรอ log
        navigate("/Project_Detail");
    };

    const handleCreateProject = async () => {
        const finalProjectName = projectName || selectedTemplate;
        if (!finalProjectName) {
            setError("Please enter Project Name or select a template");
            return;
        }

        setLoading(true);
        setError("");

        const authUser = getAuthUser();
        const createdBy = authUser
            ? {
                uid: authUser.uid ?? authUser.username ?? authUser.id ?? "admin",
                name: authUser.name ?? authUser.username ?? authUser.displayName ?? "admin",
            }
            : { uid: "admin", name: "admin" };

        try {
            // ✅ create project
            const { data } = await axios.post(ENDPOINTS.NEWPROJECT, {
                projectName: finalProjectName,
                template: selectedTemplate,
                createdBy,
            });

            if (data.token) localStorage.setItem("token", data.token);
            if (data.user) localStorage.setItem("authUser", JSON.stringify(data.user));

            const projectId = data.project?.projectId ?? data.projectId;
            if (!projectId) throw new Error("Project ID not found");

            const baseProjectData = {
                projectId,
                projectName: finalProjectName,
                fetchedAt: new Date().toISOString(),
            };

            try {
                // ⚡ โหลด info + detail พร้อมกัน
                const [{ data: projectInfo }, { data: projectDetails }] = await Promise.all([
                    axios.post(ENDPOINTS.PROJECTINFO, { projectId }),
                    axios.post(ENDPOINTS.PROJECTDETAIL, { projectId }),
                ]);

                localStorage.setItem(
                    "projectData",
                    JSON.stringify({ ...baseProjectData, projectInfo, projectDetails })
                );
            } catch {
                // fallback
                localStorage.setItem(
                    "projectData",
                    JSON.stringify({
                        ...baseProjectData,
                        projectInfo: null,
                        projectDetails: null,
                        error: "Failed to fetch full project data",
                    })
                );
            }

            // ⚡ UI action ไม่ต้องรอ backend
            setShowModal(false);
            setProjectName("");
            setSelectedTemplate("");

            fetchProjects(); // background refresh
            navigate("/Project_Detail");

        } catch {
            setError("Failed to create project");
        } finally {
            setLoading(false);
        }
    };

    
    return (
        <div className="pt-14 min-h-screen m-0 p-0 ">
            <header className="w-full h-22 px-4 flex items-center justify-between bar-gray sticky top-0 z-40">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-normal text-gray-300">
                        Projects <span className="text-white italic">-- shared</span>
                    </h2>

                    <div className="flex items-center gap-3 mt-2">
                        {/* View mode buttons */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setViewMode('one')}
                                className={`w-15 h-11 flex items-center justify-center rounded transition-colors ${viewMode === 'one'
                                    ? 'bg-blue-600'
                                    : 'hover:bg-gray-700'
                                    }`}
                            >
                                <img
                                    src="/icon/one.png"
                                    alt="view one"
                                />
                            </button>

                            <button
                                onClick={() => setViewMode('four')}
                                className={`w-15 h-11 flex items-center justify-center rounded transition-colors ${viewMode === 'four'
                                    ? 'bg-blue-600'
                                    : 'hover:bg-gray-700'
                                    }`}
                            >
                                <img
                                    src="/icon/four.png"
                                    alt="view one"
                                />
                            </button>

                            <button
                                onClick={() => setViewMode('three')}
                                className={`w-15 h-11 flex items-center justify-center rounded transition-colors ${viewMode === 'three'
                                    ? 'bg-blue-600'
                                    : 'hover:bg-gray-700'
                                    }`}
                            >
                                <img
                                    src="/icon/three.png"
                                    alt="view one"
                                />
                            </button>
                        </div>

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
                                        className={`aspect-square rounded flex items-center justify-center text-white text-center p-4 cursor-pointer transition-all ${selectedTemplate === template.name
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
                                    onClick={handleCreateProject}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                                >
                                    Create Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main className="pt-4 pb-8 px-4 md:px-6 lg:px-2">
                {loadingProjects ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-600 text-xl">Loading projects...</div>
                    </div>
                ) : projectData.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-600 text-xl">No projects yet. Create your first project!</div>
                    </div>
                ) : (
                    <>
                        {/* Grid View (default - four) */}
                        {viewMode === 'four' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                {projectData.map((project) => (
                                    <div
                                        key={project.id}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        {/* Hidden Input File */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={(el) => {
                                                fileInputRefs.current[project.id] = el;
                                            }}
                                            onChange={(e) => handleFileChange(project.id, e)}
                                        />

                                        {/* 🖼️ Image zone (upload only) */}
                                        <div
                                            onClick={(e) => handleImageClick(project.id, e)}
                                            className="h-40 bg-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors relative group"
                                        >
                                            {project.image ? (
                                                <>
                                                    <img
                                                        src={project.image}
                                                        alt={project.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                        <span className="text-white text-sm">
                                                            Click to change
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="text-gray-600">
                                                    Click to upload image
                                                </span>
                                            )}
                                        </div>

                                        {/* 📄 Content zone (navigate) */}
                                        <div
                                            onClick={() => handleProjectClick(project)}
                                            className="p-4 cursor-pointer hover:bg-gray-50 transition"
                                        >
                                            <h3 className="text-gray-700 text-xl font-semibold mb-2">
                                                {project.name}
                                            </h3>

                                            <div className="mb-2">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-medium ${project.status === 'Active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}
                                                >
                                                    {project.status}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-2">
                                                {project.description}
                                            </p>

                                            <p className="text-gray-500 text-xs">
                                                Owner: {project.owner}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                Modified: {project.lastModified}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Table View (three) */}
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
                                                    onClick={() => handleProjectClick(project)}
                                                    className={`hover:bg-gray-100 cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                        }`}
                                                >
                                                    <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                                                        {project.name}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${project.status === 'Active'
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

                        {/* Single View (one) */}
                        {viewMode === 'one' && (
                            <div className="flex flex-col gap-6">
                                {projectData.map((project) => (
                                    <div
                                        key={project.id}
                                        className="w-full max-w-4xl mx-auto"
                                    >
                                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">

                                            {/* Hidden Input File */}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                ref={(el) => {
                                                    fileInputRefs.current[project.id] = el;
                                                }}
                                                onChange={(e) => handleFileChange(project.id, e)}
                                            />

                                            {/* 🖼️ Image zone (upload only, no navigation) */}
                                            <div
                                                onClick={(e) => handleImageClick(project.id, e)}
                                                className="h-64 bg-gray-300 flex items-center justify-center cursor-pointer relative group"
                                            >
                                                {project.image ? (
                                                    <>
                                                        <img
                                                            src={project.image}
                                                            alt={project.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                            <span className="text-white text-lg">
                                                                Click to change
                                                            </span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-600 text-xl">
                                                        Click to upload image
                                                    </span>
                                                )}
                                            </div>

                                            {/* 📄 Content zone (navigate) */}
                                            <div
                                                onClick={() => handleProjectClick(project)}
                                                className="p-6 cursor-pointer hover:bg-gray-50 transition"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <h2 className="text-gray-700 text-3xl font-semibold">
                                                        {project.name}
                                                    </h2>
                                                    <span
                                                        className={`px-3 py-1 rounded text-sm font-medium ${project.status === 'Active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                    >
                                                        {project.status}
                                                    </span>
                                                </div>

                                                <p className="text-gray-600 mb-4 text-lg">
                                                    {project.description}
                                                </p>

                                                <div className="flex gap-6 text-gray-500">
                                                    <p>
                                                        <span className="font-medium">Owner:</span>{' '}
                                                        {project.owner}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Last Modified:</span>{' '}
                                                        {project.lastModified}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </>
                )}
            </main>
        </div>
    );
}
