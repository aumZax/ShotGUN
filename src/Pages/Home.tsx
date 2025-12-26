import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ENDPOINTS from "../config";
import { supabase } from "../supabaseClient";

type ViewMode = 'one' | 'four' | 'three';

interface Project {
    id: string;
    name: string;
    status: string;
    lastModified: string;
    createdBy: string;
    description: string;
    image?: string;
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
    const [loading, setLoading] = useState(false);
    const [projectData, setProjectData] = useState<Project[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [error, setError] = useState("");
    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        projectId: string;
    } | null>(null);

    const templates = [
        { id: 1, name: 'Animation', subtitle: 'Template' },
        { id: 2, name: 'Automotive', subtitle: 'Design Template' },
        { id: 3, name: 'Episodic TV', subtitle: 'Template' },
        { id: 4, name: 'Film VFX', subtitle: 'Template' }
    ];

    useEffect(() => {
        fetchProjects();
    }, []);

    // เพิ่มตรงนี้
    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        if (contextMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [contextMenu]);

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

            console.log("✅ Project images updated:", Object.keys(images).length);

        } catch (err) {
            console.error("❌ Error fetching project images:", err);
        }
    };

    const fetchProjects = async () => {
        setLoadingProjects(true);

        try {
            const authUser = getAuthUser();
            const uid =
                authUser?.id ??
                authUser?.uid ??
                authUser?.username ??
                "admin";

            console.log("📋 Fetching projects for user:", uid);

            const { data } = await axios.post<{ projects: ProjectApiData[] }>(
                ENDPOINTS.PROJECTLIST,
                { uid }
            );

            console.log("📦 Raw API response:", data.projects);

            const projects: Project[] = data.projects.map(p => ({
                id: p.projectId ?? p.id ?? "",
                name: p.projectName,
                status: p.status ?? "Active",
                lastModified: new Date(p.createdAt).toLocaleDateString("en-CA"),
                createdBy: p.createdBy?.name ?? p.createdBy?.username ?? "Unknown",
                description: p.description ?? "No description",
                image: undefined,
            }));

            console.log("✅ Processed projects:", projects.length);

            setProjectData(projects);

            if (projects.length) {
                fetchProjectImages(projects);
            }

        } catch (err) {
            console.error("❌ Error fetching projects:", err);
            setProjectData([]);
        } finally {
            setLoadingProjects(false);
        }
    };

    const [deleteConfirm, setDeleteConfirm] = useState<{
        show: boolean;
        projectId: string;
        projectName: string;
    } | null>(null);

    const handleContextMenu = (e: React.MouseEvent, projectId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            projectId
        });
    };

      const handleImageClick = (projectId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        fileInputRefs.current[projectId]?.click();
    };


    const handleDeleteProject = async (projectId: string) => {
        if (!projectId) {
            alert("Project ID is missing");
            return;
        }

        try {
            const res = await fetch(ENDPOINTS.DELETEPROJECT, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // ถ้ามี auth
                },
                body: JSON.stringify({
                    projectId,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("❌ Delete failed:", data);
                alert(data.message || "Delete project failed");
                return;
            }

            console.log("✅ Delete success:", data);

            // ✅ ปิด modal
            setDeleteConfirm(null);

            // ✅ อัปเดต UI (ลบออกจาก state)
            setProjectData((prev) =>
                prev.filter((p) => p.id !== projectId)
            );

        } catch (error) {
            console.error("❌ Network error:", error);
            alert("Server error");
        }
    };

    const openDeleteConfirm = (projectId: string) => {
        const project = projectData.find(p => p.id === projectId);
        if (project) {
            setDeleteConfirm({
                show: true,
                projectId: project.id,
                projectName: project.name
            });
            setContextMenu(null);
        }
    };

    const handleTemplateSelect = (templateName: string) => {
        setSelectedTemplate(templateName);
        setProjectName(templateName);
    };

  

    const handleFileChange = async (
        projectId: string,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log("📤 Starting image upload for project:", projectId);

        try {
            // สร้างชื่อไฟล์
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 8);
            const fileExt = file.name.split('.').pop();
            const filename = `${projectId}_${timestamp}_${randomStr}.${fileExt}`;

            console.log("📤 Uploading to Supabase Storage:", filename);

            // อัปโหลดไปยัง Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("project_images")
                .upload(filename, file, {
                    cacheControl: "3600",
                    upsert: false,
                    contentType: file.type
                });

            if (uploadError) {
                console.error("❌ Upload error:", uploadError);
                throw new Error(`Upload failed: ${uploadError.message}`);
            }

            console.log("✅ Upload successful:", uploadData);

            // ดึง public URL
            const { data: urlData } = supabase.storage
                .from("project_images")
                .getPublicUrl(filename);

            const downloadURL = urlData.publicUrl;
            console.log("✅ Image URL:", downloadURL);

            // ⚡ Update UI ทันที
            setProjectData(prev =>
                prev.map(p =>
                    p.id === projectId && p.image !== downloadURL
                        ? { ...p, image: downloadURL }
                        : p
                )
            );

            // 🔄 Sync backend (บันทึกลง files_project table)
            await axios.post(ENDPOINTS.UPLOAD, {
                projectId,
                downloadURL,
                filename,
                storagePath: filename,
                type: "images",
                description: "project thumbnail",
            });

            console.log("✅ Image uploaded and saved to database");

        } catch (err) {
            console.error("❌ Upload error:", err);
            alert("Failed to upload image. Please try again.");
        }
    };

    const handleProjectClick = async (project: Project) => {
        const projectId = project.id;
        if (!projectId) return;

        console.log("🔍 Opening project:", projectId);

        const baseData = {
            projectId,
            projectName: project.name,
            fetchedAt: new Date().toISOString(),
        };

        try {
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

            console.log("✅ Project data saved to localStorage");

        } catch (err) {
            console.error("❌ Error fetching project data:", err);
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
                uid: authUser.id ?? authUser.uid ?? authUser.username ?? "admin",
                name: authUser.username ?? authUser.name ?? "admin",
            }
            : { uid: "admin", name: "admin" };

        console.log("🆕 Creating project:", finalProjectName, "by", createdBy.name);

        try {
            const { data } = await axios.post(ENDPOINTS.NEWPROJECT, {
                projectName: finalProjectName,
                template: selectedTemplate,
                description: `${selectedTemplate} project`,
                createdBy,
            });

            console.log("✅ Project creation response:", data);

            if (data.token) localStorage.setItem("token", data.token);

            const projectId = data.project?.projectId ?? data.projectId;
            if (!projectId) {
                console.error("❌ No project ID in response:", data);
                throw new Error("Project ID not found in response");
            }

            console.log("✅ New project ID:", projectId);

            const baseProjectData = {
                projectId,
                projectName: finalProjectName,
                fetchedAt: new Date().toISOString(),
            };

            try {
                const [{ data: projectInfo }, { data: projectDetails }] = await Promise.all([
                    axios.post(ENDPOINTS.PROJECTINFO, { projectId }),
                    axios.post(ENDPOINTS.PROJECTDETAIL, { projectId }),
                ]);

                localStorage.setItem(
                    "projectData",
                    JSON.stringify({ ...baseProjectData, projectInfo, projectDetails })
                );

                console.log("✅ Project data fetched and saved");

            } catch (fetchErr) {
                console.error("⚠️ Warning: Could not fetch full project data:", fetchErr);
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

            setShowModal(false);
            setProjectName("");
            setSelectedTemplate("");

            // Refresh project list
            await fetchProjects();

            console.log("🎉 Navigating to project detail");
            navigate("/Project_Detail");

        } catch (err) {
            console.error("❌ Create project error:", err);
            if (axios.isAxiosError(err)) {
                console.error("Response data:", err.response?.data);
                console.error("Response status:", err.response?.status);
            }
            setError("Failed to create project. Please try again.");
        } finally {
            setLoading(false);
        }

        // const [contextMenu, setContextMenu] = useState<{
        //     visible: boolean;
        //     x: number;
        //     y: number;
        //     projectId: string;
        // } | null>(null);
    };

    return (
        <div className="pt-14 min-h-screen m-0 p-0">
            <header className="w-full h-22 px-4 flex items-center justify-between bar-gray sticky top-0 z-40">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-normal text-gray-300">
                        Projects <span className="text-white italic">-- shared</span>
                    </h2>

                    <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setViewMode('one')}
                                className={`w-15 h-11 flex items-center justify-center rounded transition-colors ${viewMode === 'one' ? 'bg-blue-600' : 'hover:bg-gray-700'
                                    }`}
                            >
                                <img src="/icon/one.png" alt="view one" />
                            </button>

                            <button
                                onClick={() => setViewMode('four')}
                                className={`w-15 h-11 flex items-center justify-center rounded transition-colors ${viewMode === 'four' ? 'bg-blue-600' : 'hover:bg-gray-700'
                                    }`}
                            >
                                <img src="/icon/four.png" alt="view four" />
                            </button>

                            <button
                                onClick={() => setViewMode('three')}
                                className={`w-15 h-11 flex items-center justify-center rounded transition-colors ${viewMode === 'three' ? 'bg-blue-600' : 'hover:bg-gray-700'
                                    }`}
                            >
                                <img src="/icon/three.png" alt="view three" />
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

            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-gray-800 rounded-lg shadow-2xl">
                        <div className="border-b border-gray-700 p-6">
                            <h2 className="text-2xl font-semibold text-white">
                                Create New Project
                            </h2>
                        </div>

                        <div className="p-6">
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200">
                                    {error}
                                </div>
                            )}

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
                                        setError('');
                                    }}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateProject}
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Creating..." : "Create Project"}
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
                        {viewMode === 'four' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                {projectData.map((project) => (
                                    <div
                                        key={project.id}
                                        onContextMenu={(e) => handleContextMenu(e, project.id)}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={(el) => {
                                                fileInputRefs.current[project.id] = el;
                                            }}
                                            onChange={(e) => handleFileChange(project.id, e)}
                                        />

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
                                                Owner: {project.createdBy}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                Modified: {project.lastModified}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

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
                                                        {project.createdBy}
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

                        {viewMode === 'one' && (
                            <div className="flex flex-col gap-6">
                                {projectData.map((project) => (
                                    <div
                                        key={project.id}
                                        className="w-full max-w-4xl mx-auto"
                                    >
                                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                ref={(el) => {
                                                    fileInputRefs.current[project.id] = el;
                                                }}
                                                onChange={(e) => handleFileChange(project.id, e)}
                                            />

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
                                                        {project.createdBy}
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
                {contextMenu && (
                    <div
                        className="fixed rounded py-1 z-50 min-w-[150px]"
                        style={{
                            left: `${contextMenu.x}px`,
                            top: `${contextMenu.y}px`
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => openDeleteConfirm(contextMenu.projectId)}
                            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 text-sm"
                        >
                            <span>🗑️</span>
                            Delete Project
                        </button>
                    </div>
                )}

                {deleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/* Overlay */}
                        <div
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                            onClick={() => setDeleteConfirm(null)}
                        />

                        {/* Modal */}
                        <div className="
            relative w-full max-w-md mx-4
            rounded-2xl
            bg-zinc-900
            border border-zinc-700
            shadow-2xl
            animate-in fade-in zoom-in-95
        ">
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="
                        w-12 h-12 rounded-full
                        bg-red-500/15
                        flex items-center justify-center
                    ">
                                        <img
                                            src="/icon/warning.png"
                                            alt="warning"
                                            className="w-9 h-9"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-zinc-100">
                                            Delete Project
                                        </h3>
                                        <p className="text-sm text-zinc-400">
                                            This action cannot be undone.
                                        </p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="rounded-lg bg-zinc-800 p-4 mb-6 border border-zinc-700">
                                    <p className="text-zinc-300 mb-1">
                                        Are you sure you want to delete this project?
                                    </p>
                                    <p className="font-semibold text-zinc-100 truncate">
                                        “{deleteConfirm.projectName}”
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setDeleteConfirm(null)}
                                        className="
                            px-4 py-2 rounded-lg
                            bg-zinc-700/60
                            text-zinc-200
                            hover:bg-zinc-700
                            transition-colors font-medium
                        "
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={() => handleDeleteProject(deleteConfirm.projectId)}
                                        className="
                            px-4 py-2 rounded-lg
                            bg-red-600
                            text-white
                            hover:bg-red-700
                            transition-colors font-medium
                        "
                                    >
                                        Delete Project
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


            </main>
        </div>
    );
}
