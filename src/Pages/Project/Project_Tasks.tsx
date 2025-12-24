import Navbar_Project from "../../components/Navbar_Project";

export default function Project_Tasks() {
    return (
        <div className="pt-14 min-h-screen m-0 p-0 bar-gray">
            <Navbar_Project activeTab="Tasks" />
            
            <div className="pt-14 min-h-screen">
                <h1>Tasks</h1>
            </div>
        </div>
    );
}