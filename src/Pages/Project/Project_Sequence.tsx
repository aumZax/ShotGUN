import { useState } from 'react';
import Navbar_Project from "../../components/Navbar_Project";
import { useNavigate } from "react-router-dom";
import { FolderClosed } from 'lucide-react';
// Mock data - flat array without categories
const initialSequences = [
    { id: 'bunny_010', thumbnail: '/api/placeholder/220/150', description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna. Nunc viverra imperdiet enim. Fusce est.', status: 'wtg' },
    { id: 'bunny_020', thumbnail: '/api/placeholder/220/150', description: '', status: 'wtg' },
    { id: 'bunny_030', thumbnail: '/api/placeholder/220/150', description: '', status: 'wtg' },
    { id: 'bunny_040', thumbnail: '/api/placeholder/220/150', description: '', status: 'wtg' },
    { id: 'bunny_050', thumbnail: '/api/placeholder/220/150', description: '', status: 'wtg' },
    { id: 'bunny_060', thumbnail: '/api/placeholder/220/150', description: '', status: 'wtg' },
    { id: 'bunny_070', thumbnail: '/api/placeholder/220/150', description: '', status: 'fin' },
    { id: 'bunny_080', thumbnail: '/api/placeholder/220/150', description: '', status: 'fin' },
    { id: 'bunny_090', thumbnail: '/api/placeholder/220/150', description: '', status: 'fin' },
    { id: 'bunny_100', thumbnail: '/api/placeholder/220/150', description: '', status: 'fin' },
    { id: 'bunny_110', thumbnail: '/api/placeholder/220/150', description: '', status: 'fin' },
    { id: 'bunny_120', thumbnail: '/api/placeholder/220/150', description: '', status: 'fin' }
];

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
    const [sequences, setSequences] = useState(initialSequences);
    const [selectedSequence, setSelectedSequence] = useState<number | null>(null);
    const [editingField, setEditingField] = useState<EditingField | null>(null);
    const [showStatusMenu, setShowStatusMenu] = useState<number | null>(null);
    const [statusMenuPosition, setStatusMenuPosition] = useState<'bottom' | 'top'>('bottom');

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
        setEditingField(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
            setEditingField(null);
        }
    };

    const handleStatusChange = (index: number, newStatus: StatusType) => {
        const newSequences = [...sequences];
        newSequences[index].status = newStatus;
        setSequences(newSequences);
        setShowStatusMenu(null);
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
                                className="w-40 md:w-56 lg:w-64 h-8 pl-3 pr-10 bg-gray-800/50 border border-gray-600/50 rounded-lg text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/80 focus:bg-gray-800/80 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-200"
                            />
                        </div>
                    </div>
                </header>
            </div>

            <div className="h-22"></div>


            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    {sequences.map((sequence, index) => (
                        <div
                            key={sequence.id}
                            onClick={() => handleSequenceClick(index)}
                            className={`group cursor-pointer rounded-xl p-3 transition-all duration-300 border-2 shadow-lg hover:shadow-2xl hover:ring-2 hover:ring-blue-400 ${selectedSequence === index
                                    ? 'border-blue-500 bg-gray-800'
                                    : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                                }`}
                        >
                            {/* Thumbnail */}
                            <div className="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl overflow-hidden mb-3 shadow-inner" onClick={() => navigate('/Project_Sequence/Others_Sequence')}>
                                <img
                                    src={sequence.thumbnail}
                                    alt={sequence.id}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
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
                                    className="h-9 px-3 bg-[#1a1a1a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Description */}
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm text-gray-300 text-right">
                                    Description:
                                </label>
                                <input
                                    type="text"
                                    className="h-9 px-3 bg-[#1a1a1a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Project */}
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm text-gray-300 text-right">
                                    Project:
                                </label>
                                <input
                                    disabled
                                    value="Demo: Animation"
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

                                <button className="px-5 h-9 bg-[#2196F3] hover:bg-[#1976D2] text-sm rounded text-white transition-colors">
                                    Create Sequence
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}