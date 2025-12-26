import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import Navbar_Project from "../../components/Navbar_Project";
import { useNavigate } from "react-router-dom";


// Mock data
const initialShotData = [
    {
        category: 'bunny_010',
        count: 20,
        shots: []
    },
    {
        category: 'bunny_020',
        count: 20,
        shots: [
            {
                id: 'bunny_020_0010',
                thumbnail: '/api/placeholder/220/150',
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
    wtg: { label: 'Waiting to Start', color: 'bg-gray-600',icon: '-' },
    ip: { label: 'In Progress', color: 'bg-green-500',icon: 'dot' },
    fin: { label: 'Final', color: 'bg-gray-500',icon: 'dot' }
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

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleShotClick = (categoryIndex: number, shotIndex: number, e: React.MouseEvent) => {
        if (!editingField && !showStatusMenu) {
            setSelectedShot({ categoryIndex, shotIndex });
        }
    };

    const handleFieldClick = (field: string, categoryIndex: number, shotIndex: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (field === 'status') {
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

    return (
        <div className="h-screen flex flex-col">
            <div className="pt-14">

                <Navbar_Project activeTab="Shots" />
            </div>
            <div className="pt-12">
                <header className="w-full h-22 px-4 flex items-center justify-between bar-gray fixed z-[50]">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-normal text-gray-300">
                            Shot ⭐
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
                                onClick={() => setShowCreateShot(true)}
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
            </div>

            <div className="h-22"></div>

            <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
                <div className="space-y-2">
                    {shotData.map((category, categoryIndex) => (
                        <div key={category.category} className="bar-gray rounded-lg">
                            <button
                                onClick={() => toggleCategory(category.category)}
                                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-750 transition-colors"
                            >
                                {expandedCategories.includes(category.category) ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                                <span className="font-medium">{category.category}</span>
                                <span className="text-gray-400 text-sm">({category.count})</span>
                            </button>

                            {expandedCategories.includes(category.category) && category.shots.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 p-4 bg-gray-850">
                                    {category.shots.map((shot, shotIndex) => (
                                        <div
                                            key={shot.id}
                                            onClick={(e) => handleShotClick(categoryIndex, shotIndex, e)}
                                            className={`group cursor-pointer rounded-lg p-2 transition-all border-2 ${isSelected(categoryIndex, shotIndex)
                                                ? 'border-blue-500 bg-gray-750'
                                                : 'border-gray-400 hover:border-gray-600 hover:bg-gray-750'
                                                }`}
                                        >
                                            {/* Thumbnail */}
                                            <div
                                                className="relative aspect-video bg-gray-700 rounded-lg overflow-hidden mb-2 cursor-pointer"
                                                // onClick={() => navigate(`/asset/${asset.id}`)}
                                                onClick={() => navigate('/Project_Shot/Others_AllForOne')}


                                            >
                                                <img
                                                    src={shot.thumbnail}
                                                    alt={shot.id}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200"></div>
                                            </div>

                                            {/* Shot Info */}
                                            <div className="space-y-2">
                                                {/* ID Field */}
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
                                                    onClick={(e) => handleFieldClick('description', categoryIndex, shotIndex, e)}
                                                    className="px-2 py-1 rounded hover:bg-gray-700 cursor-text"
                                                >
                                                    {editingField?.categoryIndex === categoryIndex &&
                                                        editingField?.shotIndex === shotIndex &&
                                                        editingField?.field === 'description' ? (
                                                        <input
                                                            type="text"
                                                            value={shot.description}
                                                            onChange={(e) => handleFieldChange(categoryIndex, shotIndex, 'description', e.target.value)}
                                                            onBlur={handleFieldBlur}
                                                            onKeyDown={handleKeyDown}
                                                            autoFocus
                                                            className="w-full text-xs text-gray-200 bg-gray-600 border border-blue-500 rounded px-1 outline-none"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    ) : (
                                                        <p className="text-xs text-gray-400 truncate">
                                                            {shot.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Status Field */}
                                                <div className="px-2 relative">
                                                    <button
                                                        onClick={(e) => handleFieldClick('status', categoryIndex, shotIndex, e)}
                                                        className="flex items-center gap-2 w-full py-1 px-2 rounded hover:bg-gray-700"
                                                    >
                                                        <div className={`w-2 h-2 rounded-full ${statusConfig[shot.status as StatusType].color}`}></div>
                                                        <span className="text-xs text-gray-300">{statusConfig[shot.status as StatusType].label}</span>
                                                    </button>

                                                    {/* Status Dropdown Menu */}
                                                    {showStatusMenu?.categoryIndex === categoryIndex &&
                                                        showStatusMenu?.shotIndex === shotIndex && (
                                                            <div className="absolute left-0 top-full mt-1 bg-gray-700 rounded-lg shadow-xl z-50 min-w-[160px] border border-gray-600">
                                                                {(Object.entries(statusConfig) as [StatusType, { label: string; color: string }][]).map(([key, config]) => (
                                                                    <button
                                                                        key={key}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleStatusChange(categoryIndex, shotIndex, key);
                                                                        }}
                                                                        className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg text-left"
                                                                    >
                                                                        <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
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

            {/* Click outside to close status menu */}
            {showStatusMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowStatusMenu(null)}
                ></div>
            )}

            {showCreateShot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setShowCreateShot(false)}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-lg bg-[#3b3b3b] rounded-lg shadow-xl">
                        {/* Header */}
                        <div className="px-5 py-3 border-b border-gray-600 flex items-center justify-between">
                            <h2 className="text-lg text-gray-200 font-medium">
                                Create a new Shot
                            </h2>
                            <button
                                onClick={() => setShowCreateShot(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ⚙️
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="text-sm text-gray-300 block mb-1">
                                    Shot Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full h-9 px-3 bg-gray-700 border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-300 block mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    className="w-full h-9 px-3 bg-gray-700 border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-300 block mb-1">
                                    Task Template
                                </label>
                                <input
                                    type="text"
                                    className="w-full h-9 px-3 bg-gray-700 border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-300 block mb-1">
                                    Project
                                </label>
                                <input
                                    disabled
                                    value="Demo: Animation"
                                    className="w-full h-9 px-3 bg-gray-800 border border-gray-600 rounded text-gray-400 text-sm"
                                />
                            </div>

                            <button className="text-sm text-gray-400 hover:text-gray-200">
                                More fields ▾
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-3 border-t border-gray-600 flex justify-between items-center">
                            <button className="text-sm text-blue-400 hover:underline">
                                Open Bulk Import
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowCreateShot(false)}
                                    className="px-4 h-8 bg-gray-600 hover:bg-gray-500 text-sm rounded flex items-center justify-center"
                                >
                                    Cancel
                                </button>

                                <button
                                    className="px-4 h-8 bg-blue-600 hover:bg-blue-700 text-sm rounded text-white flex items-center justify-center"
                                >
                                    Create Shot
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}