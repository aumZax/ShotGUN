import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import Navbar_Project from "../../components/Navbar_Project";
import { useNavigate } from "react-router-dom";

import { Image, } from 'lucide-react';
// Mock data
const initialAssetData = [
    {
        category: 'Character',
        count: 1,
        assets: [
            {
                id: 'Ander',
                thumbnail: '/api/placeholder/220/150',
                description: 'Other: he came trotting along in a',
                status: 'wtg'
            }
        ]
    },
    {
        category: 'bunny_030',
        count: 20,
        assets: [
            {
                id: 'bunny_030_0010',
                thumbnail: '/icon/black-dog.png',
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

interface SelectedAsset {
    categoryIndex: number;
    assetIndex: number;
}

interface EditingField {
    field: string;
    categoryIndex: number;
    assetIndex: number;
}
export default function Project_Assets() {
    const navigate = useNavigate();
    const [showCreateAsset, setShowCreateAsset] = useState(false);

    // เปิดทุก category ที่มี assets โดยอัตโนมัติ
    const [expandedCategories, setExpandedCategories] = useState<string[]>(
        initialAssetData
            .filter(category => category.assets.length > 0)
            .map(category => category.category)
    );
    const [assetData, setAssetData] = useState(initialAssetData);
    const [SelectedAsset, setSelectedAsset] = useState<SelectedAsset | null>(null);
    const [editingField, setEditingField] = useState<EditingField | null>(null);
    const [showStatusMenu, setShowStatusMenu] = useState<SelectedAsset | null>(null);

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleAssetClick = (categoryIndex: number, assetIndex: number) => {
        if (!editingField && !showStatusMenu) {
            setSelectedAsset({ categoryIndex, assetIndex });
        }
    };


    // เพิ่ม state สำหรับเก็บตำแหน่งที่ควรแสดง menu
    const [statusMenuPosition, setStatusMenuPosition] = useState<'bottom' | 'top'>('bottom');

    // แก้ไขฟังก์ชัน handleFieldClick
    const handleFieldClick = (field: string, categoryIndex: number, assetIndex: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (field === 'status') {
            // คำนวณตำแหน่งเพื่อดูว่าควรแสดง menu ด้านบนหรือล่าง
            const target = e.currentTarget as HTMLElement;
            const rect = target.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            // ถ้าพื้นที่ด้านล่างน้อยกว่า 200px และพื้นที่ด้านบนมากกว่า ให้แสดงด้านบน
            setStatusMenuPosition(spaceBelow < 200 && spaceAbove > spaceBelow ? 'top' : 'bottom');
            setShowStatusMenu({ categoryIndex, assetIndex });
        } else {
            setEditingField({ field, categoryIndex, assetIndex });
        }
    };

    const handleFieldChange = (categoryIndex: number, assetIndex: number, field: string, value: string) => {
        const newData = [...assetData];
        if (field === 'id') {
            newData[categoryIndex].assets[assetIndex].id = value;
        } else if (field === 'description') {
            newData[categoryIndex].assets[assetIndex].description = value;
        }
        setAssetData(newData);
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

    const handleStatusChange = (categoryIndex: number, assetIndex: number, newStatus: StatusType) => {
        const newData = [...assetData];
        newData[categoryIndex].assets[assetIndex].status = newStatus;
        setAssetData(newData);
        setShowStatusMenu(null);
    };

    const isSelected = (categoryIndex: number, assetIndex: number) => {
        return SelectedAsset?.categoryIndex === categoryIndex &&
            SelectedAsset?.assetIndex === assetIndex;
    };

    return (
        <div className="h-screen flex flex-col">
            <div className="pt-14">

                <Navbar_Project activeTab="Assets" />
            </div>
            <div className="pt-12">
                <header className="w-full h-22 px-4 flex items-center justify-between fixed z-[50] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 backdrop-blur-sm shadow-lg">
                    <div className="flex flex-col">
                        <div className='flex'>
                            <h2 className="px-2 text-2xl font-normal bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Assets
                            </h2>
                            <Image className="w-8 h-8 text-blue-400 mr-3" />
                        </div>



                        <div className="flex items-center gap-3 mt-2">
                            <button
                                onClick={() => setShowCreateAsset(true)}
                                className="px-4 h-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm font-medium rounded-lg flex items-center gap-1 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-blue-500/50 hover:scale-105"
                            >
                                Add Asset
                                <span className="text-xs">▼</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search Asset..."
                                className="w-40 md:w-56 lg:w-64 h-8 pl-3 pr-10 bg-gray-800/50 border border-gray-600/50 rounded-lg text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/80 focus:bg-gray-800/80 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-200"
                            />
                        </div>
                    </div>
                </header>
            </div>

            <div className="h-22"></div>

            <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-gray-900 ">
                <div className="space-y-2">
                    {assetData.map((category, categoryIndex) => (
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

                            {expandedCategories.includes(category.category) && category.assets.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 p-4 bg-gray-850">
                                    {category.assets.map((asset, assetIndex) => (
                                        <div
                                            key={asset.id}
                                            onClick={() => handleAssetClick(categoryIndex, assetIndex)}
                                            className={`group cursor-pointer rounded-xl p-3 transition-all duration-300 border-2 shadow-lg hover:shadow-2xl hover:ring-2 hover:ring-blue-400 ${isSelected(categoryIndex, assetIndex)
                                                ? 'border-blue-500 bg-gray-750'
                                                : 'border-gray-400 hover:border-gray-600 hover:bg-gray-750'
                                                }`}
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl overflow-hidden mb-3 cursor-pointer shadow-inner" onClick={() => navigate('/Project_Assets/Others_Asset')}>
                                                <img
                                                    src={asset.thumbnail}
                                                    alt={asset.id}
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

                                            {/* Asset Info */}
                                            <div className="space-y-2">
                                                {/* ID Field */}
                                                <div
                                                    onClick={(e) => handleFieldClick('id', categoryIndex, assetIndex, e)}
                                                    className="px-2 py-1 rounded hover:bg-gray-700 cursor-text"
                                                >
                                                    {editingField?.categoryIndex === categoryIndex &&
                                                        editingField?.assetIndex === assetIndex &&
                                                        editingField?.field === 'id' ? (
                                                        <input
                                                            type="text"
                                                            value={asset.id}
                                                            onChange={(e) => handleFieldChange(categoryIndex, assetIndex, 'id', e.target.value)}
                                                            onBlur={handleFieldBlur}
                                                            onKeyDown={handleKeyDown}
                                                            autoFocus
                                                            className="w-full text-sm font-medium text-gray-200 bg-gray-600 border border-blue-500 rounded px-1 outline-none"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    ) : (
                                                        <h3 className="text-sm font-medium text-gray-200">
                                                            {asset.id}
                                                        </h3>
                                                    )}
                                                </div>

                                                {/* Description Field */}
                                                <div
                                                    onClick={(e) =>
                                                        handleFieldClick('description', categoryIndex, assetIndex, e)
                                                    }
                                                    className="px-2 py-1 rounded hover:bg-gray-700 cursor-text"
                                                >
                                                    {editingField?.categoryIndex === categoryIndex &&
                                                        editingField?.assetIndex === assetIndex &&
                                                        editingField?.field === 'description' ? (
                                                        <textarea
                                                            value={asset.description}
                                                            onChange={(e) =>
                                                                handleFieldChange(
                                                                    categoryIndex,
                                                                    assetIndex,
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
                                                            {asset.description || '\u00A0'}
                                                        </p>
                                                    )}
                                                </div>


                                                {/* Status Field */}
                                                <div className="px-2 relative">
                                                    <button
                                                        onClick={(e) => handleFieldClick('status', categoryIndex, assetIndex, e)}
                                                        className="flex items-center gap-2 w-full py-1 px-2 rounded hover:bg-gray-700"
                                                    >
                                                        {statusConfig[asset.status as StatusType].icon === '-' ? (
                                                            <span className="text-gray-400 font-bold w-2 text-center">-</span>
                                                        ) : (
                                                            <div className={`w-2 h-2 rounded-full ${statusConfig[asset.status as StatusType].color}`}></div>
                                                        )}
                                                        <span className="text-xs text-gray-300">{statusConfig[asset.status as StatusType].label}</span>
                                                    </button>

                                                    {/* Status Dropdown Menu */}
                                                    {showStatusMenu?.categoryIndex === categoryIndex &&
                                                        showStatusMenu?.assetIndex === assetIndex && (
                                                            <div className={`absolute left-0 ${statusMenuPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} bg-gray-700 rounded-lg shadow-xl z-50 min-w-[160px] border border-gray-600`}>
                                                                {(Object.entries(statusConfig) as [StatusType, { label: string; color: string; icon: string }][]).map(([key, config]) => (
                                                                    <button
                                                                        key={key}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleStatusChange(categoryIndex, assetIndex, key);
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

            {/* Click outside to close status menu */}
            {showStatusMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowStatusMenu(null)}
                ></div>
            )}

            {showCreateAsset && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setShowCreateAsset(false)}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-lg bg-[#3b3b3b] rounded-lg shadow-xl">
                        {/* Header */}
                        <div className="px-5 py-3 border-b border-gray-600 flex items-center justify-between">
                            <h2 className="text-lg text-gray-200 font-medium">
                                Create a new Asset
                            </h2>
                            <button
                                onClick={() => setShowCreateAsset(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ⚙️
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="text-sm text-gray-300 block mb-1">
                                    Asset Name
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
                                    onClick={() => setShowCreateAsset(false)}
                                    className="px-4 h-8 bg-gray-600 hover:bg-gray-500 text-sm rounded flex items-center justify-center"
                                >
                                    Cancel
                                </button>

                                <button
                                    className="px-4 h-8 bg-blue-600 hover:bg-blue-700 text-sm rounded text-white flex items-center justify-center"
                                >
                                    Create Asset
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}