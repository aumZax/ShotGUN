import { useState, useEffect } from 'react';

import Navbar_Project from "../../components/Navbar_Project";
import { useNavigate } from "react-router-dom";
import { FolderClosed, Image } from 'lucide-react';


import ENDPOINTS from "../../config";



type StatusType = keyof typeof statusConfig;

const statusConfig = {
    wtg: { label: 'Waiting to Start', color: 'bg-gray-600', icon: '-' },
    ip: { label: 'In Progress', color: 'bg-green-500', icon: 'dot' },
    fin: { label: 'Final', color: 'bg-gray-500', icon: 'dot' }
};

interface EditingField {
    field: string;
    index: number;
}

export default function Project_Sequence() {
    const navigate = useNavigate();

    const [showCreateSequence, setShowCreateSequence] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface SequenceItem {
        dbId: number;
        id: string; // sequence_name
        description: string;
        status: StatusType;
        thumbnail: string;
        createdAt?: string;
    }

    const [sequences, setSequences] = useState<SequenceItem[]>([]);


    const [selectedSequence, setSelectedSequence] = useState<number | null>(null);
    const [editingField, setEditingField] = useState<EditingField | null>(null);
    const [showStatusMenu, setShowStatusMenu] = useState<number | null>(null);
    const [statusMenuPosition, setStatusMenuPosition] = useState<'bottom' | 'top'>('bottom');

    // เก็บค่า projectId จาก localStorage 
    const projectData = JSON.parse(localStorage.getItem("projectData") || "null");
    const projectId = projectData?.projectId;
    const projectName = projectData?.projectName;

    // ✅ วางตรงนี้
    if (!projectId) {
        console.warn("projectId not found, redirecting to home");
        navigate("/Home");
        return null;
    }

    const handleSequenceClick = (index: number) => {
        if (!editingField && !showStatusMenu) {
            setSelectedSequence(index);
        }
    };

    const handleFieldClick = (field: string, index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (field === 'status') {
            const target = e.currentTarget as HTMLElement;
            const rect = target.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            setStatusMenuPosition(spaceBelow < 200 && spaceAbove > spaceBelow ? 'top' : 'bottom');
            setShowStatusMenu(index);
        } else {
            setEditingField({ field, index });
        }
    };

    const handleFieldChange = (index: number, field: string, value: string) => {
        const newSequences = [...sequences];
        if (field === 'id') {
            newSequences[index].id = value;
        } else if (field === 'description') {
            newSequences[index].description = value;
        }
        setSequences(newSequences);
    };

    const handleFieldBlur = () => {
        if (!editingField) return;

        const { index, field } = editingField;
        const seq = sequences[index];

        if (field === "id") {
            updateSequence(seq.dbId, {
                sequence_name: seq.id
            });
        }

        if (field === "description") {
            updateSequence(seq.dbId, {
                description: seq.description
            });
        }

        setEditingField(null);
    };



    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault(); // ⛔ กัน textarea ขึ้นบรรทัดใหม่
            handleFieldBlur();  // 💾 บันทึก
        }

        if (e.key === "Escape") {
            setEditingField(null); // ❌ ยกเลิก ไม่ save
        }
    };

    const handleStatusChange = (index: number, newStatus: StatusType) => {
        const newSequences = [...sequences];
        newSequences[index].status = newStatus;
        setSequences(newSequences);
        setShowStatusMenu(null);

        updateSequence(newSequences[index].dbId, {
            status: newStatus
        });
    };



    // ดึงข้อมูล sequences จาก API เมื่อ component โหลด
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (!projectId) return;

        fetch(ENDPOINTS.PROJECT_SEQUENCES, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ projectId })
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch sequences");
                return res.json();
            })
            .then(data => {
                const mapped = data.map((item: any) => ({
                    dbId: item.id,
                    id: item.sequence_name,
                    thumbnail: item.file_url || "",
                    description: item.description,
                    status: item.status || "wtg",
                    createdAt: item.created_at // 👈 เพิ่มตรงนี้
                }));

                setSequences(mapped);
            })
            .catch(err => console.error("Sequence fetch error:", err));
    }, [projectId]);



    const updateSequence = (
        dbId: number,
        payload: {
            sequence_name?: string;
            description?: string;
            status?: StatusType;
        }
    ) => {
        fetch(ENDPOINTS.UPDATE_SEQUENCE, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: dbId,
                ...payload
            })
        }).catch(err => console.error("Update error:", err));
    };


    // ค้นหา ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const [searchText, setSearchText] = useState("");
    const filteredSequences = sequences.filter(seq => {
        if (!searchText.trim()) return true;

        const keyword = searchText.toLowerCase();

        const id = seq.id?.toLowerCase() || "";
        const desc = seq.description?.toLowerCase() || "";

        return id.includes(keyword) || desc.includes(keyword);
    });



    // สร้าง Sequence ใหม่ +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const [newSequenceName, setNewSequenceName] = useState("");
    const [newSequenceDesc, setNewSequenceDesc] = useState("");
    const [createError, setCreateError] = useState("");


    const handleCreateSequence = async () => {
        if (!newSequenceName.trim()) {
            setCreateError("Sequence Name is required");
            return;
        }

        try {
            const res = await fetch(ENDPOINTS.CREATE_SEQUENCE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectId,
                    sequence_name: newSequenceName.trim(),
                    description: newSequenceDesc.trim()
                })
            });

            if (!res.ok) throw new Error("Create failed");

            const result = await res.json();

            setSequences(prev => [
                ...prev,
                {
                    dbId: result.id,
                    id: newSequenceName,
                    description: newSequenceDesc,
                    status: "wtg",
                    thumbnail: ""
                }
            ]);

            // reset
            setNewSequenceName("");
            setNewSequenceDesc("");
            setShowCreateSequence(false);
            setCreateError("");
        } catch (err) {
            console.error(err);
        }
    };

    // เปิดหน้า Sequence อื่น ๆ ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const handleOpenSequence = (sequence: any) => {
        localStorage.setItem(
            "sequenceData",
            JSON.stringify({
                sequenceId: sequence.dbId,
                sequenceName: sequence.id,
                description: sequence.description,
                status: sequence.status,
                thumbnail: sequence.thumbnail,
                createdAt: sequence.createdAt, // 👈 เพิ่ม
                projectId
            })
        );

        navigate("/Project_Sequence/Others_Sequence");
    };

    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        sequence: SequenceItem;
    } | null>(null);

    const handleContextMenu = (
        e: React.MouseEvent,
        sequence: SequenceItem
    ) => {
        e.preventDefault();
        e.stopPropagation();

        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            sequence
        });
    };

    useEffect(() => {
        const closeMenu = () => setContextMenu(null);

        if (contextMenu) {
            document.addEventListener("click", closeMenu);
            return () => document.removeEventListener("click", closeMenu);
        }
    }, [contextMenu]);

     const [deleteConfirm, setDeleteConfirm] = useState<{
        show: boolean;
        projectId: string;
        projectName: string;
    } | null>(null);

    const handleDeleteProject = async (projectId: string) => {
       console.log("hiiiiiiiiiiiiiiiiii");
       
    };


    return (
        <div className="h-screen flex flex-col bg-gray-900">
            <div className="pt-14">

                <Navbar_Project activeTab="Sequence" />
            </div>
            <div className="pt-12">
                <header className="w-full h-22 px-4 flex items-center justify-between fixed z-[50] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 backdrop-blur-sm shadow-lg">
                    <div className="flex flex-col">
                        <div className='flex'>
                            <h2 className="px-2 text-2xl font-normal bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Sequence
                            </h2>
                            <FolderClosed className="w-8 h-8 text-blue-400 mr-3" />
                        </div>



                        <div className="flex items-center gap-3 mt-2">
                            <button
                                onClick={() => setShowCreateSequence(true)}
                                className="px-4 h-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm font-medium rounded-lg flex items-center gap-1 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-blue-500/50 hover:scale-105"
                            >
                                Add Sequence
                                <span className="text-xs">▼</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search Sequence..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-40 md:w-56 lg:w-64 h-8 pl-3 pr-10 bg-gray-800/50 border border-gray-600/50 rounded-lg text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/80 focus:bg-gray-800/80 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-200"
                            />

                        </div>
                    </div>
                </header>
            </div>

            <div className="h-22"></div>


            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6">
                {sequences.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                        <div className="text-center space-y-4">
                            <FolderClosed className="w-24 h-24 text-gray-600 mx-auto" />
                            <h3 className="text-2xl font-medium text-gray-300">No Sequences Yet</h3>
                            <p className="text-gray-500 max-w-md">
                                Get started by creating your first sequence. Click the "Add Sequence" button above to begin.
                            </p>

                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                        {filteredSequences.map((sequence, index) => (
                            <div
                                key={sequence.dbId}
                                onClick={() => handleSequenceClick(index)}
                                onContextMenu={(e) => handleContextMenu(e, sequence)}
                                className={`group cursor-pointer rounded-xl p-3 transition-all duration-300 border-2 shadow-lg hover:shadow-2xl hover:ring-2 hover:ring-blue-400 ${selectedSequence === index
                                    ? 'border-blue-500 bg-gray-800'
                                    : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                                    }`}
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl overflow-hidden mb-3 shadow-inner"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenSequence(sequence);
                                    }}
                                >
                                    {sequence.thumbnail ? (
                                        <img
                                            src={sequence.thumbnail}
                                            alt={`${sequence.id}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-2
                    bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
                                            <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center">
                                                <Image className="w-6 h-6 text-gray-500" />
                                            </div>
                                            <p className="text-gray-500 text-xs font-medium">
                                                No Thumbnail
                                            </p>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Sequence Info */}
                                <div className="space-y-2">
                                    {/* ID Field */}
                                    <div
                                        onClick={(e) => handleFieldClick('id', index, e)}
                                        className="px-2 py-1 rounded hover:bg-gray-700 cursor-text"
                                    >
                                        {editingField?.index === index && editingField?.field === 'id' ? (
                                            <input
                                                type="text"
                                                value={sequence.id}
                                                onChange={(e) => handleFieldChange(index, 'id', e.target.value)}
                                                onBlur={handleFieldBlur}
                                                onKeyDown={handleKeyDown}
                                                autoFocus
                                                className="w-full text-sm font-medium text-gray-200 bg-gray-600 border border-blue-500 rounded px-1 outline-none"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        ) : (
                                            <h3 className="text-sm font-medium text-gray-200">
                                                {sequence.id}
                                            </h3>
                                        )}
                                    </div>

                                    {/* Description Field */}
                                    <div
                                        onClick={(e) => handleFieldClick('description', index, e)}
                                        className="px-2 py-1 rounded hover:bg-gray-700 cursor-text"
                                    >
                                        {editingField?.index === index && editingField?.field === 'description' ? (
                                            <textarea
                                                value={sequence.description}
                                                onChange={(e) =>
                                                    handleFieldChange(index, 'description', e.target.value)
                                                }
                                                onBlur={handleFieldBlur}
                                                onKeyDown={handleKeyDown}
                                                autoFocus
                                                rows={4}
                                                className="
                                                w-full
                                                text-xs
                                                text-gray-200
                                                bg-gray-600
                                                border border-blue-500
                                                rounded
                                                px-2 py-1
                                                outline-none
                                                resize-none
                                                overflow-y-auto
                                            "
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        ) : (
                                            <p className="text-xs text-gray-400 truncate min-h-[16px]">
                                                {sequence.description || '\u00A0'}
                                            </p>
                                        )}
                                    </div>


                                    {/* Status Field */}
                                    <div className="px-2 relative">
                                        <button
                                            onClick={(e) => handleFieldClick('status', index, e)}
                                            className="flex items-center gap-2 w-full py-1 px-2 rounded hover:bg-gray-700"
                                        >
                                            {statusConfig[sequence.status as StatusType].icon === '-' ? (
                                                <span className="text-gray-400 font-bold w-2 text-center">-</span>
                                            ) : (
                                                <div className={`w-2 h-2 rounded-full ${statusConfig[sequence.status as StatusType].color}`}></div>
                                            )}
                                            <span className="text-xs text-gray-300">{statusConfig[sequence.status as StatusType].label}</span>
                                        </button>

                                        {/* Status Dropdown */}
                                        {showStatusMenu === index && (
                                            <div className={`absolute left-0 ${statusMenuPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} bg-gray-700 rounded-lg shadow-xl z-50 min-w-[160px] border border-gray-600`}>
                                                {(Object.entries(statusConfig) as [StatusType, { label: string; color: string; icon: string }][]).map(([key, config]) => (
                                                    <button
                                                        key={key}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStatusChange(index, key);
                                                        }}
                                                        className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg text-left"
                                                    >
                                                        {config.icon === '-' ? (
                                                            <span className="text-gray-400 font-bold w-2 text-center">-</span>
                                                        ) : (
                                                            <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
                                                        )}
                                                        <span className="text-xs text-gray-200">{config.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Click outside to close status menu */}
            {showStatusMenu !== null && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowStatusMenu(null)}
                ></div>
            )}

            {/* Create Sequence Modal */}
            {showCreateSequence && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/70"
                        onClick={() => setShowCreateSequence(false)}
                    />

                    <div className="relative w-full max-w-xl bg-[#2b2b2b] rounded shadow-2xl">
                        {/* Header */}
                        <div className="px-6 py-3 bg-[#3a3a3a] flex items-center justify-between">
                            <h2 className="text-base text-gray-100 font-normal">
                                Create a new Sequence <span className="text-gray-400 text-sm">- Global Form</span>
                            </h2>
                            <button
                                onClick={() => setShowCreateSequence(false)}
                                className="text-gray-400 hover:text-white text-xl"
                            >
                                ⚙
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-6 space-y-4">
                            {/* Sequence Name */}
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm text-gray-300 text-right">
                                    Sequence Name:
                                </label>
                                <input
                                    type="text"
                                    value={newSequenceName}
                                    onChange={(e) => setNewSequenceName(e.target.value)}
                                    className="h-9 px-3 bg-[#1a1a1a] border border-gray-600 rounded text-gray-200 text-sm"
                                />

                            </div>

                            {/* Description */}
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm text-gray-300 text-right">
                                    Description:
                                </label>
                                <input
                                    type="text"
                                    value={newSequenceDesc}
                                    onChange={(e) => setNewSequenceDesc(e.target.value)}
                                    className="h-9 px-3 bg-[#1a1a1a] border border-gray-600 rounded text-gray-200 text-sm"
                                />

                            </div>

                            {/* Project */}
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm text-gray-300 text-right">
                                    Project:
                                </label>
                                <input
                                    disabled
                                    value={projectName || "Demo: Animation"}
                                    className="h-9 px-3 bg-[#1a1a1a] border border-gray-600 rounded text-gray-400 text-sm"
                                />


                            </div>

                            {/* More fields button */}
                            <div className="grid grid-cols-[140px_1fr] gap-4">
                                <div></div>
                                <button className="text-sm text-gray-400 hover:text-gray-200 text-left flex items-center gap-1">
                                    More fields <span className="text-xs">▼</span>
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-[#1f1f1f] flex justify-between items-center">
                            <button className="text-sm text-gray-300 hover:text-gray-100">
                                Open Bulk Import
                            </button>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCreateSequence(false)}
                                    className="px-5 h-9 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-sm rounded text-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleCreateSequence}
                                    className="px-5 h-9 bg-[#2196F3] hover:bg-[#1976D2] text-sm rounded text-white"
                                >
                                    Create Sequence
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            )}
{/* right click menu */}
            {contextMenu && (
                <div
                    className="fixed z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-1 min-w-[160px]"
                    style={{
                        left: contextMenu.x,
                        top: contextMenu.y,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => {


                            console.log("🗑️ Delete sequence clicked:", {
                                dbId: contextMenu.sequence.dbId,
                                name: contextMenu.sequence.id,
                            });
                            setContextMenu(null);


                            
                        }}
                        className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/20 flex items-center gap-2 text-sm"
                    >
                        🗑️ Delete Sequence
                    </button>
                    
                </div>
            )}

            {deleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                            onClick={() => setDeleteConfirm(null)}
                        />

                        <div className="relative w-full max-w-md mx-4 rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl animate-in fade-in zoom-in-95">
                            <div className="p-6">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center">
                                        <span className="text-3xl">⚠️</span>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-zinc-100">Delete Project</h3>
                                        <p className="text-sm text-zinc-400">This action cannot be undone.</p>
                                    </div>
                                </div>

                                <div className="rounded-lg bg-zinc-800 p-4 mb-6 border border-zinc-700">
                                    <p className="text-zinc-300 mb-1">
                                        Are you sure you want to delete this project?
                                    </p>
                                    <p className="font-semibold text-zinc-100 truncate">
                                        "{deleteConfirm.projectName}"
                                    </p>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setDeleteConfirm(null)}
                                        className="px-4 py-2 rounded-lg bg-zinc-700/60 text-zinc-200 hover:bg-zinc-700 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={() => handleDeleteProject(deleteConfirm.projectId)}
                                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                                    >
                                        Delete Project
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

        </div>
    );
}