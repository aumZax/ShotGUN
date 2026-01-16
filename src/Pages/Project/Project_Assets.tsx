import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Image } from 'lucide-react';
import ENDPOINTS from '../../config';
import axios from 'axios';
import Navbar_Project from "../../components/Navbar_Project";
import { useNavigate } from "react-router-dom";


type StatusType = keyof typeof statusConfig;

const statusConfig = {
    wtg: { label: 'Waiting to Start', color: 'bg-gray-600', icon: '-' },
    ip: { label: 'In Progress', color: 'bg-green-500', icon: 'dot' },
    fin: { label: 'Final', color: 'bg-gray-500', icon: 'dot' }
};

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

interface Asset {
  id: number;
  asset_name: string;
  description: string;
  status: StatusType;
  file_url: string;  // ✅ ใช้แค่ file_url
}

interface AssetCategory {
    category: string;
    count: number;
    assets: Asset[];
}

interface Category {
    category: string;
    count: number;
    assets: Asset[];
}

interface SelectedAsset {
    categoryIndex: number;
    assetIndex: number;
}

interface EditingField {
    field: string;
    categoryIndex: number;
    assetIndex: number;
}

interface Sequence {
    id: number;
    sequence_name: string;
    description?: string;
    order_index?: number;
}

interface Shot {
    id: number;
    shot_name: string;
    description?: string;
    sequence_id: number;
}

export default function Project_Assets() {
    const navigate = useNavigate();

    const [showCreateAsset, setShowCreateAsset] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [assetData, setAssetData] = useState<Category[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<SelectedAsset | null>(null);
    const [editingField, setEditingField] = useState<EditingField | null>(null);
    const [showStatusMenu, setShowStatusMenu] = useState<SelectedAsset | null>(null);
    const [statusMenuPosition, setStatusMenuPosition] = useState<'bottom' | 'top'>('bottom');
    const [isLoading, setIsLoading] = useState(true);
    const [, setIsLoadingSequences] = useState(false);
    const [sequences, setSequences] = useState<Sequence[]>([]);
    const [selectedSequence, setSelectedSequence] = useState<Sequence | null>(null);
    const [shots, setShots] = useState<Shot[]>([]);
    const [selectedShot, setSelectedShot] = useState<Shot | null>(null);
    const [isLoadingShots, setIsLoadingShots] = useState(false);
    
    // Form states for creating new asset
    const [newAssetName, setNewAssetName] = useState('');
    const [newAssetDescription, setNewAssetDescription] = useState('');
    const [newAssetTaskTemplate, setNewAssetTaskTemplate] = useState('');
    const [showSequenceDropdown, setShowSequenceDropdown] = useState(false);
    const [showShotDropdown, setShowShotDropdown] = useState(false);
    const [sequenceInput, setSequenceInput] = useState('');
    const [shotInput, setShotInput] = useState('');

    useEffect(() => {
        fetchAssets();
        fetchSequences();
    }, []);

    const fetchAssets = async () => {
    const projectId = localStorage.getItem('projectId');
    try {
        setIsLoading(true);
        
        const response = await axios.post(ENDPOINTS.ASSETLIST, {
            projectId
        });
        
        const data = response.data;

        // 🔍 Debug
        console.log('📦 API Response:', data);
        
        // ✅ ไม่ต้อง map แล้ว ใช้ data โดยตรง
        setAssetData(data);
        
        // Set expanded categories
        const categoriesToExpand = data
            .filter((category: Category) =>
                Array.isArray(category.assets) && category.assets.length > 0
            )
            .map((category: Category) => category.category);

        setExpandedCategories(categoriesToExpand);
        
        // Sync selected asset
        syncSelectedAssetThumbnail(data);
        
    } catch (error) {
        console.error('❌ Error fetching assets:', error);
        alert('Failed to fetch assets');
    } finally {
        setIsLoading(false);
    }
};
    const fetchSequences = async () => {
        setIsLoadingSequences(true);
        try {
            const projectData = getProjectData();
            if (!projectData?.projectId) {
                console.error("Project data not found");
                return;
            }

            const { data } = await axios.post(ENDPOINTS.GETSEQUENCE, {
                projectId: projectData.projectId
            });

            setSequences(data);
        } catch (err) {
            console.error("Error fetching sequences:", err);
        } finally {
            setIsLoadingSequences(false);
        }
    };

    const fetchShots = async (sequenceId: number) => {
        setIsLoadingShots(true);
        try {
            const projectData = getProjectData();
            if (!projectData?.projectId) {
                console.error("Project data not found");
                return;
            }

            const { data } = await axios.post(ENDPOINTS.GETSHOTS, {
                projectId: projectData.projectId,
                sequenceId: sequenceId
                
            });

            setShots(data);
        } catch (err) {
            console.error("Error fetching shots:", err);
            alert("Failed to fetch shots");
        } finally {
            setIsLoadingShots(false);
        }
    };

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
        setSelectedAsset(null);

    };

    const handleAssetClick = (categoryIndex: number, assetIndex: number) => {
    if (!editingField && !showStatusMenu) {
        const asset = assetData[categoryIndex].assets[assetIndex];

        const selectedAssetData = {
            id: asset.id,
            asset_name: asset.asset_name,
            description: asset.description,
            status: asset.status,
            file_url: asset.file_url || "", // ✅ เปลี่ยนจาก thumbnail เป็น file_url
            sequence: assetData[categoryIndex].category
        };

        localStorage.setItem(
            "selectedAsset",
            JSON.stringify(selectedAssetData)
        );
        
        console.log('✅ Selected asset:', selectedAssetData);
        
        setSelectedAsset({ categoryIndex, assetIndex });
    }
};

    const handleFieldClick = (field: string, categoryIndex: number, assetIndex: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (field === 'status') {
            const target = e.currentTarget as HTMLElement;
            const rect = target.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            setStatusMenuPosition(spaceBelow < 200 && spaceAbove > spaceBelow ? 'top' : 'bottom');
            setShowStatusMenu({ categoryIndex, assetIndex });
        } else {
            setEditingField({ field, categoryIndex, assetIndex });
        }
    };

    const handleFieldChange = (categoryIndex: number, assetIndex: number, field: string, value: string) => {
        const newData = [...assetData];
        if (field === 'asset_name') {
            newData[categoryIndex].assets[assetIndex].asset_name = value;
        } else if (field === 'description') {
            newData[categoryIndex].assets[assetIndex].description = value;
        }
        setAssetData(newData);
    };

    const filteredSequences = sequences.filter(seq =>
        seq.sequence_name.toLowerCase().includes(sequenceInput.toLowerCase())
    );

    const filteredShots = shots.filter(shot =>
        shot.shot_name.toLowerCase().includes(shotInput.toLowerCase())
    );

    const handleFieldBlur = async (categoryIndex: number, assetIndex: number, field: string) => {
        setEditingField(null);
        
        const asset = assetData[categoryIndex].assets[assetIndex];
        
        try {
            await axios.post(ENDPOINTS.UPDATEASSET, {
                assetId: asset.id,
                field: field,
                value: asset[field as keyof Asset]
            });
            
            console.log(`✅ Updated ${field} for asset ${asset.id}`);
        } catch (error) {
            console.error(`❌ Error updating ${field}:`, error);
            alert(`Failed to update ${field}`);
            fetchAssets();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, categoryIndex: number, assetIndex: number, field: string) => {
        if (e.key === 'Enter') {
            handleFieldBlur(categoryIndex, assetIndex, field);
        } else if (e.key === 'Escape') {
            setEditingField(null);
        }
    };

    const handleStatusChange = async (categoryIndex: number, assetIndex: number, newStatus: StatusType) => {
        const newData = [...assetData];
        const asset = newData[categoryIndex].assets[assetIndex];
        
        newData[categoryIndex].assets[assetIndex].status = newStatus;
        setAssetData(newData);
        setShowStatusMenu(null);

        try {
            await axios.post(ENDPOINTS.UPDATEASSET, {
                assetId: asset.id,
                field: 'status',
                value: newStatus
            });
            
            console.log(`✅ Updated status to ${newStatus} for asset ${asset.id}`);
        } catch (error) {
            console.error('❌ Error updating status:', error);
            alert('Failed to update status');
            fetchAssets();
        }
    };

    const isSelected = (categoryIndex: number, assetIndex: number) => {
        return selectedAsset?.categoryIndex === categoryIndex &&
            selectedAsset?.assetIndex === assetIndex;
    };

    const handleSequenceSelect = (sequence: Sequence) => {
        setSelectedSequence(sequence);
        setSequenceInput(sequence.sequence_name);
        setShowSequenceDropdown(false);
        
        setSelectedShot(null);
        setShotInput('');
        setShots([]);
        
        fetchShots(sequence.id);
    };

    const handleSequenceInputChange = (value: string) => {
        setSequenceInput(value);
        setShowSequenceDropdown(true);
        if (selectedSequence && selectedSequence.sequence_name !== value) {
            setSelectedSequence(null);
            setSelectedShot(null);
            setShotInput('');
            setShots([]);
        }
    };

    const handleShotSelect = (shot: Shot) => {
        setSelectedShot(shot);
        setShotInput(shot.shot_name);
        setShowShotDropdown(false);
    };

    const handleShotInputChange = (value: string) => {
        setShotInput(value);
        setShowShotDropdown(true);
        if (selectedShot && selectedShot.shot_name !== value) {
            setSelectedShot(null);
        }
    };

    const handleCreateAsset = async () => {
        if (!newAssetName.trim()) {
            alert('Please enter asset name');
            return;
        }

        if (!selectedSequence) {
            alert('Please select a sequence');
            return;
        }

        if (!selectedShot) {
            alert('Please select a shot');
            return;
        }

        try {
            const projectData = getProjectData();
            
            await axios.post(ENDPOINTS.CREATEASSETS, {
                projectId: projectData?.projectId,
                assetName: newAssetName,
                description: newAssetDescription,
                taskTemplate: newAssetTaskTemplate,
                sequenceId: selectedSequence.id,
                shotId: selectedShot.id,
                
            });

            console.log('✅ Asset created successfully');
            
            setNewAssetName('');
            setNewAssetDescription('');
            setNewAssetTaskTemplate('');
            setSelectedSequence(null);
            setSelectedShot(null);
            setSequenceInput('');
            setShotInput('');
            setShots([]);
            setShowCreateAsset(false);
            
            fetchAssets();
        } catch (error) {
            console.error('❌ Error creating asset:', error);
            alert('Failed to create asset');
        }
    };
    const syncSelectedAssetThumbnail = (categories: AssetCategory[]) => {
    const stored = localStorage.getItem("selectedAsset");
    if (!stored) return;

    try {
        const selected = JSON.parse(stored);

        for (const category of categories) {
            const found = category.assets.find(asset =>
                asset.id === selected.id
            );
            if (found) {
                const updatedSelected = {
                    ...selected,
                    file_url: found.file_url || "" // ✅ เปลี่ยนจาก thumbnail เป็น file_url
                };
                
                localStorage.setItem(
                    "selectedAsset",
                    JSON.stringify(updatedSelected)
                );
                
                console.log('✅ Synced file_url:', updatedSelected);
                break;
            }
        }
    } catch (err) {
        console.error("❌ Failed to sync selectedAsset file_url", err);
    }
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

            <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-gray-900">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-gray-400">Loading assets...</div>
                    </div>
                ) : assetData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <Image className="w-16 h-16 text-gray-600 mb-4" />
                        <p className="text-gray-400 text-lg">No assets found</p>
                        <p className="text-gray-500 text-sm mt-2">Click "Add Asset" to create your first asset</p>
                    </div>
                ) : (
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
                                                <div 
    className="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl overflow-hidden mb-3 cursor-pointer shadow-inner"
    onClick={(e) => {
        e.stopPropagation(); // ✅ ป้องกัน parent onClick
        
        // บันทึก selectedAsset
        const currentAsset = assetData[categoryIndex].assets[assetIndex];
        localStorage.setItem(
            "selectedAsset",
            JSON.stringify({
                id: currentAsset.id,
                asset_name: currentAsset.asset_name,
                description: currentAsset.description,
                status: currentAsset.status,
                file_url: currentAsset.file_url || "", // ✅ เปลี่ยนเป็น file_url
                sequence: assetData[categoryIndex].category
            })
        );
        
        navigate('/Project_Assets/Others_Asset');
    }}
>
                                                    {asset.file_url ? (  // ✅ เปลี่ยนจาก asset.thumbnail เป็น asset.file_url
        <img
            src={asset.file_url}  // ✅ ใช้ file_url
            alt={asset.asset_name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
                // จัดการกรณีรูปโหลดไม่ได้
                console.error('Failed to load image:', asset.file_url);
                e.currentTarget.style.display = 'none';
            }}
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
                                                        onClick={(e) => handleFieldClick('asset_name', categoryIndex, assetIndex, e)}
                                                        className="px-2 py-1 rounded hover:bg-gray-700 cursor-text"
                                                    >
                                                        {editingField?.categoryIndex === categoryIndex &&
                                                            editingField?.assetIndex === assetIndex &&
                                                            editingField?.field === 'asset_name' ? (
                                                            <input
                                                                type="text"
                                                                value={asset.asset_name}
                                                                onChange={(e) => handleFieldChange(categoryIndex, assetIndex, 'asset_name', e.target.value)}
                                                                onBlur={() => handleFieldBlur(categoryIndex, assetIndex, 'asset_name')}
                                                                onKeyDown={(e) => handleKeyDown(e, categoryIndex, assetIndex, 'asset_name')}
                                                                autoFocus
                                                                className="w-full text-sm font-medium text-gray-200 bg-gray-600 border border-blue-500 rounded px-1 outline-none"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        ) : (
                                                            <h3 className="text-sm font-medium text-gray-200">
                                                                {asset.asset_name}
                                                            </h3>
                                                        )}
                                                    </div>

                                                    <div
                                                        onClick={(e) => handleFieldClick('description', categoryIndex, assetIndex, e)}
                                                        className="px-2 py-1 rounded hover:bg-gray-700 cursor-text"
                                                    >
                                                        {editingField?.categoryIndex === categoryIndex &&
                                                            editingField?.assetIndex === assetIndex &&
                                                            editingField?.field === 'description' ? (
                                                            <textarea
                                                                value={asset.description}
                                                                onChange={(e) => handleFieldChange(categoryIndex, assetIndex, 'description', e.target.value)}
                                                                onBlur={() => handleFieldBlur(categoryIndex, assetIndex, 'description')}
                                                                onKeyDown={(e) => handleKeyDown(e, categoryIndex, assetIndex, 'description')}
                                                                autoFocus
                                                                rows={4}
                                                                className="w-full text-xs text-gray-200 bg-gray-600 border border-blue-500 rounded px-2 py-1 outline-none resize-none overflow-y-auto leading-relaxed"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        ) : (
                                                            <p className="text-xs text-gray-400 truncate min-h-[16px]">
                                                                {asset.description || '\u00A0'}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="px-2 relative">
                                                        <button
                                                            onClick={(e) => handleFieldClick('status', categoryIndex, assetIndex, e)}
                                                            className="flex items-center gap-2 w-full py-1 px-2 rounded hover:bg-gray-700"
                                                        >
                                                            {statusConfig[asset.status].icon === '-' ? (
                                                                <span className="text-gray-400 font-bold w-2 text-center">-</span>
                                                            ) : (
                                                                <div className={`w-2 h-2 rounded-full ${statusConfig[asset.status].color}`}></div>
                                                            )}
                                                            <span className="text-xs text-gray-300">{statusConfig[asset.status].label}</span>
                                                        </button>

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
                )}
            </main>

            {showStatusMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowStatusMenu(null)}
                ></div>
            )}

            {showCreateAsset && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setShowCreateAsset(false)}
                    />

                    <div className="relative w-full max-w-lg bg-[#3b3b3b] rounded-lg shadow-xl">
                        <div className="px-5 py-3 border-b border-gray-600 flex items-center justify-between">
                            <h2 className="text-lg text-gray-200 font-medium">
                                Create a new Asset
                            </h2>
                            <button
                                onClick={() => setShowCreateAsset(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div>
                                <label className="text-sm text-gray-300 block mb-1">
                                    Asset Name
                                </label>
                                <input
                                    type="text"
                                    value={newAssetName}
                                    onChange={(e) => setNewAssetName(e.target.value)}
                                    className="w-full h-9 px-3 bg-gray-700 border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-300 block mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={newAssetDescription}
                                    onChange={(e) => setNewAssetDescription(e.target.value)}
                                    className="w-full h-9 px-3 bg-gray-700 border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-300 block mb-1">
                                    Task Template
                                </label>
                                <input
                                    type="text"
                                    value={newAssetTaskTemplate}
                                    onChange={(e) => setNewAssetTaskTemplate(e.target.value)}
                                    className="w-full h-9 px-3 bg-gray-700 border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="relative">
                                <label className="text-sm text-gray-300 block mb-1">
                                    Sequence <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={sequenceInput}
                                    onChange={(e) => handleSequenceInputChange(e.target.value)}
                                    onFocus={() => setShowSequenceDropdown(true)}
                                    placeholder="Type to search sequence..."
                                    className="w-full h-9 px-3 bg-[#3a3a3a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />

                                {showSequenceDropdown && filteredSequences.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-[#3a3a3a] border border-gray-600 rounded shadow-lg max-h-48 overflow-y-auto">
                                        {filteredSequences.map((seq) => (
                                            <div
                                                key={seq.id}
                                                onClick={() => handleSequenceSelect(seq)}
                                                className="px-3 py-2 text-sm text-gray-200 hover:bg-gray-600 cursor-pointer flex justify-between items-center"
                                            >
                                                <span>{seq.sequence_name}</span>
                                                {seq.description && <span className="text-gray-400 text-xs ml-2">{seq.description}</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <label className="text-sm text-gray-300 block mb-1">
                                    Shot <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={shotInput}
                                    onChange={(e) => handleShotInputChange(e.target.value)}
                                    onFocus={() => selectedSequence && setShowShotDropdown(true)}
                                    placeholder={selectedSequence ? "Type to search shot..." : "Select sequence first"}
                                    disabled={!selectedSequence || isLoadingShots}
                                    className="w-full h-9 px-3 bg-[#3a3a3a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
                                />

                                {isLoadingShots && (
                                    <div className="text-xs text-gray-400 mt-1">Loading shots...</div>
                                )}

                                {showShotDropdown && filteredShots.length > 0 && !isLoadingShots && (
                                    <div className="absolute z-10 w-full mt-1 bg-[#3a3a3a] border border-gray-600 rounded shadow-lg max-h-48 overflow-y-auto">
                                        {filteredShots.map((shot) => (
                                            <div
                                                key={shot.id}
                                                onClick={() => handleShotSelect(shot)}
                                                className="px-3 py-2 text-sm text-gray-200 hover:bg-gray-600 cursor-pointer flex justify-between items-center"
                                            >
                                                <span>{shot.shot_name}</span>
                                                {shot.description && <span className="text-gray-400 text-xs ml-2">{shot.description}</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {showShotDropdown && filteredShots.length === 0 && !isLoadingShots && selectedSequence && (
                                    <div className="text-xs text-gray-400 mt-1">No shots found for this sequence</div>
                                )}
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
                                    onClick={handleCreateAsset}
                                    disabled={!selectedSequence || !selectedShot}
                                    className="px-4 h-8 bg-blue-600 hover:bg-blue-700 text-sm rounded text-white flex items-center justify-center disabled:bg-gray-600 disabled:cursor-not-allowed"
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