import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import Navbar_Project from "../../components/Navbar_Project";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ENDPOINTS from "../../config";
import { Film, } from 'lucide-react';

// Mock data
const initialShotData = [
    {
        category: 'bunny_010',
        count: 20,
        shots: [ {
                id: 'bunny_020_0010',
                thumbnail: '/icon/black-dog.png',
                description: 'Other: he came trotting along in a',
                status: 'wtg'
            }]
    },
    {
        category: 'bunny_020',
        count: 20,
        shots: [
            {
                id: 'bunny_020_0010',
                thumbnail: '/icon/black-dog.png',
                description: 'Other: he came trotting along in a',
                status: 'wtg'
            }
        ]
    },
    {
        category: 'bunny_030',
        count: 20,
        shots: [
            {
                id: 'bunny_030_0010',
                thumbnail: '/api/placeholder/220/150',
                description: 'Other: he came trotting along in a',
                status: 'wtg'
            },
            {
                id: 'bunny_030_0020',
                thumbnail: '/api/placeholder/220/150',
                description: 'First, however, she again heard a li',
                status: 'ip'
            },
            {
                id: 'bunny_030_0030',
                thumbnail: '/api/placeholder/220/150',
                description: 'As it spoke it was too late to wish',
                status: 'fin'
            },
            {
                id: 'bunny_030_0040',
                thumbnail: '/api/placeholder/220/150',
                description: 'To shrink any further: she felt that',
                status: 'wtg'
            },
            {
                id: 'bunny_030_0050',
                thumbnail: '/api/placeholder/220/150',
                description: 'Afraid I\'ve offended it again! For th',
                status: 'ip'
            },
            {
                id: 'bunny_030_0060',
                thumbnail: '/api/placeholder/220/150',
                description: 'To worry it then Alice, thinking it w',
                status: 'fin'
            }
        ]
    }
];

type StatusType = keyof typeof statusConfig;


const statusConfig = {
    wtg: { label: 'Waiting to Start', color: 'bg-gray-600', icon: '-' },
    ip: { label: 'In Progress', color: 'bg-green-500', icon: 'dot' },
    fin: { label: 'Final', color: 'bg-gray-500', icon: 'dot' }
};

interface SelectedShot {
    categoryIndex: number;
    shotIndex: number;
}

interface EditingField {
    field: string;
    categoryIndex: number;
    shotIndex: number;
}


export default function ProjectShot() {
    const navigate = useNavigate();

    const [showCreateShot, setShowCreateShot] = useState(false);

    // เปิดทุก category ที่มี shots โดยอัตโนมัติ
    const [expandedCategories, setExpandedCategories] = useState<string[]>(
        initialShotData
            .filter(category => category.shots.length > 0)
            .map(category => category.category)
    );
    const [shotData, setShotData] = useState(initialShotData);
    const [selectedShot, setSelectedShot] = useState<SelectedShot | null>(null);
    const [editingField, setEditingField] = useState<EditingField | null>(null);
    const [showStatusMenu, setShowStatusMenu] = useState<SelectedShot | null>(null);

    // Form states
    const [shotName, setShotName] = useState('');
    const [description, setDescription] = useState('');
    const [taskTemplate, setTaskTemplate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

    const taskTemplates = [
        "Animation - Shot",
        "Film VFX - Comp Only Shot",
        "Film VFX - Full CG Shot w/ Character",
        "Film VFX - Full CG Shot w/o Character"
    ];

    // Get project data from localStorage
    const getProjectData = () => {
        try {
            const projectDataString = localStorage.getItem("projectData");
            if (!projectDataString) return null;
            return JSON.parse(projectDataString);
        } catch (error) {
            console.error("Error parsing projectData:", error);
            return null;
        }
    };

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleShotClick = (categoryIndex: number, shotIndex: number) => {
        if (!editingField && !showStatusMenu) {
            setSelectedShot({ categoryIndex, shotIndex });
        }
    };


    // เพิ่ม state สำหรับเก็บตำแหน่งที่ควรแสดง menu
    const [statusMenuPosition, setStatusMenuPosition] = useState<'bottom' | 'top'>('bottom');

    // แก้ไขฟังก์ชัน handleFieldClick
    const handleFieldClick = (field: string, categoryIndex: number, shotIndex: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (field === 'status') {
            // คำนวณตำแหน่งเพื่อดูว่าควรแสดง menu ด้านบนหรือล่าง
            const target = e.currentTarget as HTMLElement;
            const rect = target.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            // ถ้าพื้นที่ด้านล่างน้อยกว่า 200px และพื้นที่ด้านบนมากกว่า ให้แสดงด้านบน
            setStatusMenuPosition(spaceBelow < 200 && spaceAbove > spaceBelow ? 'top' : 'bottom');
            setShowStatusMenu({ categoryIndex, shotIndex });
        } else {
            setEditingField({ field, categoryIndex, shotIndex });
        }
    };

    const handleFieldChange = (categoryIndex: number, shotIndex: number, field: string, value: string) => {
        const newData = [...shotData];
        if (field === 'id') {
            newData[categoryIndex].shots[shotIndex].id = value;
        } else if (field === 'description') {
            newData[categoryIndex].shots[shotIndex].description = value;
        }
        setShotData(newData);
    };

    const handleFieldBlur = () => {
        setEditingField(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setEditingField(null);
        } else if (e.key === 'Escape') {
            setEditingField(null);
        }
    };

    const handleStatusChange = (categoryIndex: number, shotIndex: number, newStatus: StatusType) => {
        const newData = [...shotData];
        newData[categoryIndex].shots[shotIndex].status = newStatus;
        setShotData(newData);
        setShowStatusMenu(null);
    };

    const isSelected = (categoryIndex: number, shotIndex: number) => {
        return selectedShot?.categoryIndex === categoryIndex &&
            selectedShot?.shotIndex === shotIndex;
    };

    const handleCreateShot = async () => {
        // Validate form
        if (!shotName.trim() || !description.trim() || !taskTemplate) {
            setError("Please fill in all required fields");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const projectData = getProjectData();
            if (!projectData || !projectData.projectId) {
                setError("Project data not found");
                setLoading(false);
                return;
            }

            const payload = {
                projectId: projectData.projectId,
                shotName: shotName.trim(),
                description: description.trim(),
                taskTemplate: taskTemplate,
                projactName: projectData.projectName || "Unknown Project"
            };

            console.log("Creating shot with payload:", payload);

            const { data } = await axios.post(ENDPOINTS.CREATESHOT, payload);

            console.log("Shot created successfully:", data);

            // Reset form
            setShotName('');
            setDescription('');
            setTaskTemplate('');
            setShowCreateShot(false);

            // TODO: Refresh shot list from API
            // fetchShots();

        } catch (err) {
            console.error("Error creating shot:", err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Failed to create shot");
            } else {
                setError("Failed to create shot. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setShowCreateShot(false);
        setShotName('');
        setDescription('');
        setTaskTemplate('');
        setError('');
        setShowTemplateDropdown(false);
    };

    const handleTemplateSelect = (template: string) => {
        setTaskTemplate(template);
        setShowTemplateDropdown(false);
    };

    const filteredTemplates = taskTemplates.filter(template =>
        template.toLowerCase().includes(taskTemplate.toLowerCase())
    );

    return (
        <div className="h-screen flex flex-col">
            <div className="pt-14">
                <Navbar_Project activeTab="Shots" />
            </div>
            <div className="pt-12">
                <header className="w-full h-22 px-4 flex items-center justify-between fixed z-[50] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 backdrop-blur-sm shadow-lg">
                    <div className="flex flex-col">
                        <div className='flex'>
                            <h2 className="px-2 text-2xl font-normal bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Shots
                            </h2>
                            <Film className="w-8 h-8 text-blue-400 mr-3" />
                        </div>



                        <div className="flex items-center gap-3 mt-2">
                            <button
                                onClick={() => setShowCreateShot(true)}
                                className="px-4 h-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm font-medium rounded-lg flex items-center gap-1 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-blue-500/50 hover:scale-105"
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
                                className="w-40 md:w-56 lg:w-64 h-8 pl-3 pr-10 bg-gray-800/50 border border-gray-600/50 rounded-lg text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/80 focus:bg-gray-800/80 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-200"
                            />
                        </div>
                    </div>
                </header>
            </div>

            <div className="h-22"></div>

            <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-gray-900 ">
                <div className="space-y-2">
                    {shotData.map((category, categoryIndex) => (
                        <div key={category.category} className="bg-gray-800 rounded-xl border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                            <button
                                onClick={() => toggleCategory(category.category)}
                                className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white text-sm font-medium hover:shadow-gray-500/50"
                            >
                                {expandedCategories.includes(category.category) ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                                <span className="font-medium">{category.category}</span>
                                <span className="text-green-400 text-sm">({category.count})</span>
                            </button>

                            {expandedCategories.includes(category.category) && category.shots.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 p-4 bg-gray-850">
                                    {category.shots.map((shot, shotIndex) => (
                                        <div
                                            key={shot.id}
                                            onClick={() => handleShotClick(categoryIndex, shotIndex)}
                                            className={`group cursor-pointer rounded-xl p-3 transition-all duration-300 border-2 shadow-lg hover:shadow-2xl hover:ring-2 hover:ring-blue-400 ${isSelected(categoryIndex, shotIndex)
                                                ? 'border-blue-500 bg-gray-750'
                                                : 'border-gray-400 hover:border-gray-600 hover:bg-gray-750'
                                                }`}
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl overflow-hidden mb-3 cursor-pointer shadow-inner" onClick={() => navigate('/Project_Shot/Others_Shot')}>
                                                <img
                                                    src={shot.thumbnail}
                                                    alt={shot.id}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                {/* Hover Overlay Icon */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div
                                                    onClick={(e) => handleFieldClick('id', categoryIndex, shotIndex, e)}
                                                    className="px-2 py-1 rounded hover:bg-gray-700 cursor-text"
                                                >
                                                    {editingField?.categoryIndex === categoryIndex &&
                                                        editingField?.shotIndex === shotIndex &&
                                                        editingField?.field === 'id' ? (
                                                        <input
                                                            type="text"
                                                            value={shot.id}
                                                            onChange={(e) => handleFieldChange(categoryIndex, shotIndex, 'id', e.target.value)}
                                                            onBlur={handleFieldBlur}
                                                            onKeyDown={handleKeyDown}
                                                            autoFocus
                                                            className="w-full text-sm font-medium text-gray-200 bg-gray-600 border border-blue-500 rounded px-1 outline-none"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    ) : (
                                                        <h3 className="text-sm font-medium text-gray-200">
                                                            {shot.id}
                                                        </h3>
                                                    )}
                                                </div>

                                                {/* Description Field */}
                                                <div
                                                    onClick={(e) =>
                                                        handleFieldClick('description', categoryIndex, shotIndex, e)
                                                    }
                                                    className="px-2 py-1 rounded hover:bg-gray-700 cursor-text"
                                                >
                                                    {editingField?.categoryIndex === categoryIndex &&
                                                        editingField?.shotIndex === shotIndex &&
                                                        editingField?.field === 'description' ? (
                                                        <textarea
                                                            value={shot.description}
                                                            onChange={(e) =>
                                                                handleFieldChange(
                                                                    categoryIndex,
                                                                    shotIndex,
                                                                    'description',
                                                                    e.target.value
                                                                )
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
                                                                    leading-relaxed
                                                                "
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    ) : (
                                                        <p className="text-xs text-gray-400 truncate min-h-[16px]">
                                                            {shot.description || '\u00A0'}
                                                        </p>
                                                    )}
                                                </div>


                                                {/* Status Field */}

                                                <div className="px-2 relative">
                                                    <button
                                                        onClick={(e) => handleFieldClick('status', categoryIndex, shotIndex, e)}
                                                        className="flex items-center gap-2 w-full py-1 px-2 rounded hover:bg-gray-700"
                                                    >
                                                        {statusConfig[shot.status as StatusType].icon === '-' ? (
                                                            <span className="text-gray-400 font-bold w-2 text-center">-</span>
                                                        ) : (
                                                            <div className={`w-2 h-2 rounded-full ${statusConfig[shot.status as StatusType].color}`}></div>
                                                        )}
                                                        <span className="text-xs text-gray-300">{statusConfig[shot.status as StatusType].label}</span>
                                                    </button>


                                                    {/* Status Dropdown Menu */}
                                                    {showStatusMenu?.categoryIndex === categoryIndex &&
                                                        showStatusMenu?.shotIndex === shotIndex && (
                                                            <div className={`absolute left-0 ${statusMenuPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} bg-gray-700 rounded-lg shadow-xl z-50 min-w-[160px] border border-gray-600`}>
                                                                {(Object.entries(statusConfig) as [StatusType, { label: string; color: string; icon: string }][]).map(([key, config]) => (
                                                                    <button
                                                                        key={key}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleStatusChange(categoryIndex, shotIndex, key);
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
                        </div>
                    ))}
                </div>
            </main>

            {showStatusMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowStatusMenu(null)}
                ></div>
            )}

            {showTemplateDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowTemplateDropdown(false)}
                ></div>
            )}

            {showCreateShot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={handleModalClose}
                    />

                    <div className="relative w-full max-w-lg bg-[#3b3b3b] rounded-lg shadow-xl">
                        <div className="px-5 py-3 border-b border-gray-600 flex items-center justify-between">
                            <h2 className="text-lg text-gray-200 font-medium">
                                Create a new Shot
                            </h2>
                            <button
                                onClick={handleModalClose}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="text-sm text-gray-300 block mb-1">
                                    Shot Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={shotName}
                                    onChange={(e) => setShotName(e.target.value)}
                                    placeholder="Enter shot name..."
                                    className="w-full h-9 px-3 bg-gray-700 border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-300 block mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter description..."
                                    className="w-full h-9 px-3 bg-gray-700 border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="relative">
                                <label className="text-sm text-gray-300 block mb-1">
                                    Task Template <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={taskTemplate}
                                    onChange={(e) => {
                                        setTaskTemplate(e.target.value);
                                        setShowTemplateDropdown(true);
                                    }}
                                    onFocus={() => setShowTemplateDropdown(true)}
                                    placeholder="Type to search templates..."
                                    className="w-full h-9 px-3 bg-gray-700 border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />

                                {showTemplateDropdown && filteredTemplates.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded shadow-lg max-h-48 overflow-y-auto">
                                        {filteredTemplates.map((template, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleTemplateSelect(template)}
                                                className="px-3 py-2 text-sm text-gray-200 hover:bg-gray-600 cursor-pointer"
                                            >
                                                {template}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-300 block mb-1">
                                    Project
                                </label>
                                <input
                                    disabled
                                    value={getProjectData()?.projectName || "Demo: Animation"}
                                    className="w-full h-9 px-3 bg-gray-800 border border-gray-600 rounded text-gray-400 text-sm"
                                />
                            </div>

                            <button className="text-sm text-gray-400 hover:text-gray-200">
                                More fields ▾
                            </button>
                        </div>

                        <div className="px-5 py-3 border-t border-gray-600 flex justify-between items-center">
                            <button className="text-sm text-blue-400 hover:underline">
                                Open Bulk Import
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleModalClose}
                                    className="px-4 h-8 bg-gray-600 hover:bg-gray-500 text-sm rounded flex items-center justify-center"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleCreateShot}
                                    disabled={loading}
                                    className="px-4 h-8 bg-blue-600 hover:bg-blue-700 text-sm rounded text-white flex items-center justify-center disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading ? "Creating..." : "Create Shot"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}