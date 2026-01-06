import { useState } from 'react';
import Navbar_Project from "../../../components/Navbar_Project";
import { useParams } from 'react-router-dom';

// Status configuration
const statusConfig = {
    wtg: { label: 'Waiting to Start', color: 'bg-gray-600', icon: '-' },
    ip: { label: 'In Progress', color: 'bg-green-500', icon: 'dot' },
    fin: { label: 'Final', color: 'bg-gray-500', icon: 'dot' }
};

type StatusType = keyof typeof statusConfig;

// Activity type
interface Activity {
    id: number;
    user: string;
    action: string;
    timestamp: Date;
}

// Mock data from database
const mockShotData = {
    id: 1,
    shotCode: "bunny_020_0010",
    sequence: "bunny_020",
    status: "wtg" as StatusType,
    tags: [],
    thumbnail: "/icon/black-dog.png",
    description: "Main character enters the forest scene",
    dueDate: "2024-01-15"
};

// Initial activities
const initialActivities: Activity[] = [
    {
        id: 1,
        user: "John Doe",
        action: 'updated status to "In Progress"',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
        id: 2,
        user: "Jane Smith",
        action: "added a new version",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
        id: 3,
        user: "Mike Johnson",
        action: "commented on this shot",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
];

// Helper function to format time ago
const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
};

export default function Others_Shot() {
    const [activeTab, setActiveTab] = useState('Activity');
    const [shotData, setShotData] = useState(mockShotData);
    const [showStatusMenu, setShowStatusMenu] = useState(false);

    // Activity and Comment states
    const [activities, setActivities] = useState<Activity[]>(initialActivities);
    const [commentText, setCommentText] = useState('');
    const [currentUser] = useState('Current User');

    const handleStatusClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowStatusMenu(!showStatusMenu);
    };

  const handleStatusChange = (newStatus: StatusType) => {
        setShotData(prev => ({ ...prev, status: newStatus }));
        setShowStatusMenu(false);

        // Add activity when status changes
        const newActivity: Activity = {
            id: Date.now(),
            user: currentUser,
            action: `updated status "${statusConfig[newStatus].label}"`,
            timestamp: new Date()
        };
        setActivities([newActivity, ...activities]);
    };

    // Close dropdown when clicking outside
    const handleClickOutside = () => {
        if (showStatusMenu) setShowStatusMenu(false);
    };

    // Comment handlers
    const handleSubmitComment = async () => {
        if (!commentText.trim()) return;

        const newComment: Activity = {
            id: Date.now(),
            user: currentUser,
            action: `commented: "${commentText}"`,
            timestamp: new Date()
        };

        setActivities([newComment, ...activities]);
        setCommentText('');

        // API call จะเพิ่มตรงนี้
        // await fetch('/api/comments', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         shotId: shotData.id,
        //         userId: currentUser,
        //         text: commentText
        //     })
        // });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmitComment();
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-900" onClick={handleClickOutside}>
            <div className="pt-14">
                <Navbar_Project activeTab="other" />
            </div>

            <div className="pt-12 flex-1">


                <div className="p-6">
                    <div className="w-full bg-gray-800 p-6 rounded-lg shadow-lg">

                        <div className='p-2'>
                            <span className='p-2 text-xl'>{shotData.sequence} </span>
                            <span className='p-2 text-xl'>{'>'}</span>
                            <span className='p-2 text-xl'>{shotData.shotCode}</span>
                        </div>

                        <div className="flex gap-6 w-full items-start justify-between mb-6">
                            <img
                                src={shotData.thumbnail}
                                alt="Shot thumbnail"
                                className="w-80 h-44 object-cover rounded-lg shadow-md border-2 border-gray-700"
                            />

                            <div className="flex-1 space-y-4">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-8">
                                        <div className="min-w-[200px]">
                                            <span className="text-gray-400  font-medium block mb-1">Shot Code</span>
                                            <p className="text-gray-100 font-semibold text-lg">{shotData.shotCode}</p>
                                        </div>

                                        <div className="min-w-[200px]">
                                            <span className="text-gray-400  font-medium block mb-1">Sequence</span>
                                            <p className="text-gray-100 font-medium flex items-center gap-2">
                                                📁 {shotData.sequence}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="min-w-[200px] relative">
                                            <span className="text-gray-400  font-medium block mb-1">Status</span>
                                            <button
                                                onClick={handleStatusClick}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-full font-medium transition-colors"
                                            >
                                                {statusConfig[shotData.status].icon === '-' ? (
                                                    <span className="text-gray-400 font-bold">-</span>
                                                ) : (
                                                    <div className={`w-2 h-2 rounded-full ${statusConfig[shotData.status].color}`}></div>
                                                )}
                                                <span>{statusConfig[shotData.status].label}</span>
                                                <span className="text-xs ml-1">▼</span>
                                            </button>

                                            {showStatusMenu && (
                                                <div className="absolute left-0 top-full mt-1 bg-gray-700 rounded-lg shadow-xl z-50 min-w-[180px] border border-gray-600">
                                                    {(Object.entries(statusConfig) as [StatusType, { label: string; color: string; icon: string }][]).map(([key, config]) => (
                                                        <button
                                                            key={key}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleStatusChange(key);
                                                            }}
                                                            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg text-left transition-colors"
                                                        >
                                                            {config.icon === '-' ? (
                                                                <span className="text-gray-400 font-bold w-2 text-center">-</span>
                                                            ) : (
                                                                <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
                                                            )}
                                                            <span className="text-sm text-gray-200">{config.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block mb-1 font-medium">Due Date</span>
                                            <p className="text-gray-100">{shotData.dueDate}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-8">
                                        <div className="min-w-[200px]">
                                            <span className="text-gray-400  font-medium block mb-1">Tags</span>
                                            {shotData.tags.length > 0 ? (
                                                <div className="flex gap-2 flex-wrap">
                                                    {shotData.tags.map((tag, index) => (
                                                        <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-sm italic">No tags</p>
                                            )}
                                        </div>

                                        <div>
                                            <span className="text-gray-400 block mb-1 font-medium">Description</span>
                                            <p className="text-gray-100">{shotData.description}</p>
                                        </div>

                                    </div>
                                </div>
                            </div>


                        </div>


                        <nav className="flex items-center gap-6 border-t border-gray-700 pt-4">
                            {['Activity', 'Shot Info', 'Tasks', 'Notes', 'Versions', 'Assets', 'Publishes', 'Files', 'History'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-2 transition-all ${activeTab === tab
                                        ? 'text-white border-b-2 border-blue-500 font-medium'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-6 p-6 bg-gray-800 rounded-lg shadow-lg">
                        <h3 className="text-xl text-gray-200 mb-4 font-semibold flex items-center gap-2">
                            <span className="w-1 h-6 bg-blue-500 rounded"></span>
                            {activeTab}
                        </h3>

                        {activeTab === 'Activity' && (
                            <div className="space-y-4">
                                {/* Comment Input Section */}
                                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                            {currentUser.charAt(0)}
                                        </div>

                                        <div className="flex-1">
                                            <textarea
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Add a comment... (Press Enter to submit)"
                                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                                                rows={3}
                                            />

                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-xs text-gray-500">
                                                    Press Enter to submit, Shift+Enter for new line
                                                </p>
                                                <button
                                                    onClick={handleSubmitComment}
                                                    disabled={!commentText.trim()}
                                                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors font-medium"
                                                >
                                                    Comment
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Activities List */}
                                <div className="space-y-3">
                                    {activities.map((activity) => {
                                        const isCurrentUser = activity.user === currentUser;
                                        const borderColor = isCurrentUser ? 'border-orange-500' : 'border-gray-600';
                                        const userColor = isCurrentUser ? 'text-orange-400' : 'text-gray-400';

                                        return (
                                            <div
                                                key={activity.id}
                                                className={`p-4 bg-gray-700/50 rounded-lg border-l-4 ${borderColor} transition-all hover:bg-gray-700/70`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                                                        {activity.user.charAt(0)}
                                                    </div>

                                                    <div className="flex-1">
                                                        <p className="text-gray-300 text-sm">
                                                            <span className={`font-semibold ${userColor}`}>
                                                                {activity.user}
                                                            </span>{' '}
                                                            {activity.action}
                                                        </p>
                                                        <p className="text-gray-500 text-xs mt-1">
                                                            {formatTimeAgo(activity.timestamp)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {activeTab !== 'Activity' && (
                            <div className="text-center py-12">
                                <p className="text-gray-400">Content for {activeTab} will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}