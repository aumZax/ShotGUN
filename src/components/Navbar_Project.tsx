import { useState, useEffect } from 'react';

interface NavbarProjectProps {
    activeTab?: string;
}

export default function Navbar_Project({ activeTab = 'ProDetail' }: NavbarProjectProps) {
    const [projectName, setProjectName] = useState('Loading...');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

     useEffect(() => {
        const loadProjectFromStorage = () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log('🔵 Loading project from storage');
                
                const storedData = localStorage.getItem('projectData');
                
                if (!storedData) {
                    console.warn('⚠️ No project data in localStorage');
                    setProjectName('No Project Data');
                    setError('Project data not found in storage');
                    setLoading(false);
                    return;
                }

                const projectData = JSON.parse(storedData);
                console.log('📦 Loaded project data:', projectData);

                let name = null;

                // Format 1: projectName ที่ root level (ตรงๆ)
                if (projectData.projectName) {
                    name = projectData.projectName;
                    console.log('📦 Format 1 - Found project name at root:', name);
                }
                // Format 2: projectInfo.project.projectName
                else if (projectData.projectInfo?.project?.projectName) {
                    name = projectData.projectInfo.project.projectName;
                    console.log('📦 Format 2 - Found project name in projectInfo.project:', name);
                }
                // Format 3: projectInfo.projects[0].projectName
                else if (projectData.projectInfo?.projects?.[0]?.projectName) {
                    name = projectData.projectInfo.projects[0].projectName;
                    console.log('📦 Format 3 - Found project name in projects array:', name);
                }
                // Format 4: projectInfo.projectName (direct)
                else if (projectData.projectInfo?.projectName) {
                    name = projectData.projectInfo.projectName;
                    console.log('📦 Format 4 - Found project name in projectInfo:', name);
                }

                if (name) {
                    console.log('✨ Setting project name to:', name);
                    setProjectName(name);
                } else {
                    console.warn('⚠️ No project name found in data structure');
                    console.log('Available data structure:', Object.keys(projectData));
                    setProjectName('Untitled Project');
                    setError('Project name not found');
                }

            } catch (error) {
                console.error('❌ Error loading project from storage:', error);
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Failed to load project data');
                }
                setProjectName('Error Loading Project');
            } finally {
                setLoading(false);
                console.log('🏁 Load completed');
            }
        };

        loadProjectFromStorage();
    }, []); 

    const tabs = [
        { id: 'ProDetail', label: 'Project Details' },
        { id: 'Assets', label: 'Assets' },
        { id: 'Shots', label: 'Shots' },
        { id: 'Tasks', label: 'Tasks' },
        { id: 'Media', label: 'Media' },
        { id: 'other', label: 'Other', hasDropdown: true },
        { id: 'project-pages', label: 'Project Pages', hasDropdown: true },
    ];

    return (
        <header className="w-full h-12 px-6 flex items-center justify-between bar-darkV2 fixed z-40">
            {/* Left section */}
            <div className=" flex items-center gap-6">
                <div>
                    <h2 className="font-semibold text-xl text-white">
                        {loading ? 'Loading...' : projectName.toUpperCase()}
                    </h2>
                </div>

                {/* Navigation tabs */}
                <nav className="flex items-center gap-1">
                    {tabs.map((tab) => (
                        <button

                            key={tab.id}
                            onClick={() => {
                                const routes: Record<string, string> = {
                                    'ProDetail': '/Project_Detail',
                                    'Assets': '/Project_Assets',
                                    'Shots': '/Project_Shot',
                                    'Tasks': '/Project_Tasks',
                                    'Media': '/Project_Media',
                                };
                                
                                if (routes[tab.id]) {
                                    window.location.href = routes[tab.id];
                                }
                            }}
                            className={`px-4 py-2 text-sm rounded transition-colors cursor-pointer flex items-center gap-1 relative
                                ${activeTab === tab.id 
                                    ? 'text-blue-400 bg-blue-500/10' 
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                }
                            `}
                        >
                            {tab.label}
                            {tab.hasDropdown && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                            {/* Active indicator - แถบสีด้านล่าง */}
                            {activeTab === tab.id && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"></span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
                <a 
                    href="#" 
                    className="px-4 py-2 text-sm text-white hover:bg-gray-700/50 rounded transition-colors cursor-pointer flex items-center gap-1"
                >
                    Project Actions
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </a>
            </div>
        </header>
    );
}