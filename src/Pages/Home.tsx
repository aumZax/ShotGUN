import { useState } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

export default function Home() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="min-h-screen m-0 p-0">
            <header className="w-full h-20 px-4 flex items-center justify-between bg-[#2a2a2a] fixed top-12 left-0 right-0 z-40">

                <div className="flex-col">
                    <h2 className="text-2xl font-normal text-gray-300">
                        Projects <span className="text-white italic">-- shared</span>
                    </h2>


                    {/* LEFT: Title & View Controls */}
                    <div className="flex items-center gap-3">
                        {/* View mode buttons */}
                        <div className="flex items-center gap-1">
                            <button className="w-15 h-10 flex items-center justify-center hover:bg-w-700 rounded">
                                <img
                                    src="/icon/one.png"
                                    alt="color icon"
                                    className="w-5 h-5 object-contain"
                                />
                            </button>

                            <button className="w-15 h-10 flex items-center justify-center hover:bg-w-700 rounded">
                                <img
                                    src="/icon/four.png"
                                    alt="color icon"
                                    className="w-5 h-5 object-contain"
                                />
                            </button>
                            <button className="w-15 h-10 flex items-center justify-center hover:bg-w-700 rounded">
                                <img
                                    src="/icon/three.png"
                                    alt="color icon"
                                    className="w-5 h-5 object-contain"
                                />
                            </button>
                        </div>

                        {/* Add Project button */}
                        <button onClick={() => setShowModal(true)} className="px-4 h-8 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded flex items-center gap-1">
                            Add Project
                            <span className="text-xs">▼</span>
                        </button>

                        {/* Modal Overlay */}
                        {showModal && (
                            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 ">
                                <Card sx={{ width: '100%', maxWidth: 896, maxHeight: '90vh', overflow: 'auto', backgroundColor: '#1f2937' }}>
                                    {/* Modal Header */}
                                    <CardContent sx={{ borderBottom: '1px solid #374151', p: 3 }}>
                                        <Typography variant="h5" component="h2" sx={{ color: 'white', fontWeight: 600 }}>
                                            Create New Project
                                        </Typography>
                                    </CardContent>

                                    {/* Modal Content */}
                                    <CardContent sx={{ p: 3 }}>
                                        {/* Project Name Input */}
                                        <input
                                            type="text"
                                            placeholder="Enter your project name..."
                                            className="w-full px-4 py-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none mb-6"
                                        />

                                        {/* Tabs */}
                                        <div className="flex gap-4 border-b border-gray-700 mb-6">
                                            <button className="px-4 py-2 text-white border-b-2 border-blue-500 font-medium">
                                                Templates
                                            </button>
                                            <button className="px-4 py-2 text-gray-400 hover:text-white">
                                                Projects
                                            </button>
                                        </div>

                                        {/* Description */}
                                        <Typography sx={{ color: '#9ca3af', mb: 3 }}>
                                            Choose a template to use as the default for your new project.
                                            Save any project as a template to establish best practices for
                                            new projects.
                                        </Typography>

                                        {/* Templates Grid */}
                                        <div className="grid grid-cols-4 gap-4 mb-6">
                                            <div className="aspect-square bg-blue-500 rounded flex items-center justify-center text-white text-center p-4 cursor-pointer hover:bg-blue-600 transition-colors">
                                                <div>
                                                    <div className="font-semibold">Animation</div>
                                                    <div className="text-sm">Template</div>
                                                </div>
                                            </div>
                                            <div className="aspect-square bg-blue-500 rounded flex items-center justify-center text-white text-center p-4 cursor-pointer hover:bg-blue-600 transition-colors">
                                                <div>
                                                    <div className="font-semibold">Automotive</div>
                                                    <div className="text-sm">Design</div>
                                                    <div className="text-sm">Template</div>
                                                </div>
                                            </div>
                                            <div className="aspect-square bg-blue-500 rounded flex items-center justify-center text-white text-center p-4 cursor-pointer hover:bg-blue-600 transition-colors">
                                                <div>
                                                    <div className="font-semibold">Episodic TV</div>
                                                    <div className="text-sm">Template</div>
                                                </div>
                                            </div>
                                            <div className="aspect-square bg-blue-500 rounded flex items-center justify-center text-white text-center p-4 cursor-pointer hover:bg-blue-600 transition-colors">
                                                <div>
                                                    <div className="font-semibold">Film VFX</div>
                                                    <div className="text-sm">Template</div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>

                                    {/* Modal Footer */}
                                    <CardContent sx={{ borderTop: '1px solid #374151', p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <button className="text-gray-400 hover:text-white">
                                            Use the advanced form...
                                        </button>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowModal(false)}
                                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                                                Create Project
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                    </div>
                </div>

                {/* RIGHT: Modified badge, Settings & Search */}
                <div className="flex items-center gap-3">

                    {/* Search & Filter */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search Projects..."
                                className="w-64 h-8 pl-3 pr-10 bg-gray-800 border border-gray-600 rounded text-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            />
                        </div>


                    </div>
                </div>

            </header>
            <main className="pt-35">
                <Card sx={{ maxWidth: 345 }}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            image="/icon/black-dog.png"
                            alt="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Lizard
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Lizards are a widespread group of squamate reptiles, with over 6,000
                                species, ranging across all continents except Antarctica
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </main>
        </div>

    );
}