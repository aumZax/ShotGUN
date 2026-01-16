import { useState, useEffect } from "react";
import { User } from 'lucide-react';
import Navbar_Project from "../../components/Navbar_Project";
import ENDPOINTS from "../../config";
import axios from "axios";

/* ================= Types ================= */
interface Person {
  id: number;
  name: string;
  email: string;
  status: "Active" | "Inactive";
  permissionGroup: "Admin" | "Worker" | "Manager" | "Artist";
  projects: string;
  groups: string;
}

interface UserData {
  email: string;
  firstName?: string;
  lastName?: string;
}

/* ================= Main Component ================= */
export default function Others_People() {
  /* ================= State ================= */
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCell, setEditingCell] = useState<{ id: number; field: keyof Person } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showCreatePerson, setShowCreatePerson] = useState(false);
  const [showMoreFields, setShowMoreFields] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [allUsers, setAllUsers] = useState<UserData[]>([]);



  // Seats data
  const [totalSeats, setTotalSeats] = useState(50);
  const [usedSeats, setUsedSeats] = useState(0);

  /* ================= Column Width ================= */
  const [columnWidths] = useState<number[]>([
    48, 220, 220, 260, 160, 200, 220,
  ]);

  /* ================= Get current date and time ================= */
  const now = new Date();
  const isToday = true;
  const timeString = now.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  /* ================= Load Project Name from localStorage ================= */
  useEffect(() => {
    const loadProjectFromStorage = () => {
      try {
        console.log('🔵 Loading project from storage');
        const projectId = localStorage.getItem("projectId");

        console.log('📦 Current project ID from storage:', projectId);

        const storedData = localStorage.getItem('projectData');

        if (!storedData) {
          console.warn('⚠️ No project data in localStorage');
          setProjectName('My Animation');
          return;
        }

        const projectData = JSON.parse(storedData);
        console.log('📦 Loaded project data:', projectData);

        let name = null;

        // Try different possible data structures
        if (projectData.projectName) {
          name = projectData.projectName;
        }
        else if (projectData.projectInfo?.project?.projectName) {
          name = projectData.projectInfo.project.projectName;
        }
        else if (projectData.projectInfo?.projects?.[0]?.projectName) {
          name = projectData.projectInfo.projects[0].projectName;
        }
        else if (projectData.projectInfo?.projectName) {
          name = projectData.projectInfo.projectName;
        }

        if (name) {
          console.log('✅ Setting project name to:', name);
          setProjectName(name);
        } else {
          console.warn('⚠️ No project name found');
          setProjectName('My Animation');
        }

      } catch (error) {
        console.error('❌ Error loading project from storage:', error);
        setProjectName('My Animation');
      }
    };

    loadProjectFromStorage();
  }, []);

  /* ================= Fetch People from API ================= */
  useEffect(() => {
    fetchPeople();
    fetchSeatsInfo();
    getAllUser();
  }, []);

  const getAllUser = async () => {
    try {
      const response = await fetch(ENDPOINTS.USERS);
      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      console.log("Users data:", data);
      setAllUsers(data);
    } catch (err) {
      console.error("❌ Fetch users error:", err);
      setAllUsers([]);
    }
  };

  const fetchPeople = async () => {
    try {
      setLoading(true);
      const response = await axios.post(ENDPOINTS.GETPEOPLE, {
        projectId: localStorage.getItem("projectId") || null,
      });

      const data: Person[] = response.data;
      setPeople(data);
      setUsedSeats(data.length);
    } catch (err) {
      console.error("❌ Fetch people error:", err);
      setPeople([]);
      setUsedSeats(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeatsInfo = async () => {
    try {
      const response = await fetch(ENDPOINTS.SEATS);
      if (!response.ok) throw new Error('Failed to fetch seats info');

      const data = await response.json();
      setTotalSeats(data.total || 50);
      setUsedSeats(data.used || 0);
    } catch (err) {
      console.error("❌ Fetch seats error:", err);
      setTotalSeats(50);
    }
  };

  /* ================= Resize Column ================= */
  const startResize = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = columnWidths[index];

    const onMouseMove = (ev: MouseEvent) => {
      const newWidths = [...columnWidths];
      newWidths[index] = Math.max(80, startWidth + ev.clientX - startX);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  /* ================= Edit Cell ================= */
  const handleCellClick = (id: number, field: keyof Person, currentValue: string) => {
    setEditingCell({ id, field });
    setEditValue(currentValue);
  };

  const handleCellBlur = async () => {
    if (!editingCell) return;

    try {
      const updatedPeople = people.map(p =>
        p.id === editingCell.id
          ? { ...p, [editingCell.field]: editValue }
          : p
      );
      setPeople(updatedPeople);

      const response = await fetch(`${ENDPOINTS.PEOPLE}/${editingCell.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [editingCell.field]: editValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update person');
      }

    } catch (err) {
      console.error("❌ Update failed:", err);
      fetchPeople();
    } finally {
      setEditingCell(null);
      setEditValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellBlur();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue("");
    }
  };

  /* ================= Seats Calculation ================= */
  const availableSeats = totalSeats - usedSeats;

  /* ================= Render ================= */
  return (
    <div className="h-screen flex flex-col text-gray-200 bg-gray-900">
      <div className="pt-14">
        <Navbar_Project activeTab="other" />
      </div>

      <header className="w-full px-6 py-4 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <User className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl text-gray-200 font-normal">
            People
          </h2>
          <span className="text-sm text-gray-400">
            {availableSeats}/{totalSeats} subscription seats available
          </span>
          <span className="text-gray-600">|</span>
          <span className="text-sm text-gray-400">
            {usedSeats} currently in use on your Flow Production Tracking site
          </span>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowCreatePerson(true)}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded flex items-center gap-1.5 transition-colors"
          >
            Add Person
            <span className="text-xs">▼</span>
          </button>

          <div className="relative">
            <input
              type="text"
              placeholder="Search People..."
              className="w-64 h-9 pl-3 pr-10 bg-gray-800 border border-gray-700 rounded text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-hidden">
          <div className="h-full overflow-x-auto overflow-y-auto">
            {loading ? (
              <div className="text-center text-gray-400 py-10">
                Loading people...
              </div>
            ) : people.length === 0 ? (
              <div className="text-center text-gray-400 py-10">
                No people found. Click "Add Person" to get started.
              </div>
            ) : (
              <table
                className="border-collapse table-fixed w-full"
                style={{
                  width: columnWidths.reduce((a, b) => a + b, 0),
                }}
              >
                <thead className="select-none">
                  <tr>
                    {["", "Name", "Status", "Email", "Permission", "Projects", "Groups"].map((title, index) => (
                      <th
                        key={index}
                        className="relative px-2 py-2 text-left text-xs font-semibold uppercase sticky top-0 z-30 bg-gray-800 border border-gray-700"
                        style={{ width: columnWidths[index] }}
                      >
                        {title}
                        <div
                          onMouseDown={(e) => startResize(e, index)}
                          className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
                        />
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="bg-gray-900">
                  {people.map((p) => (
                    <tr key={p.id} className="border-t border-gray-700 hover:bg-gray-800">
                      <td
                        className="px-2 py-2 border-r border-gray-700"
                        style={{ width: columnWidths[0] }}
                      >
                        <input type="checkbox" />
                      </td>

                      <td
                        className="px-3 py-1 border-r border-gray-700 cursor-pointer"
                        style={{ width: columnWidths[1] }}
                        onClick={() => handleCellClick(p.id, 'name', p.name)}
                      >
                        {editingCell?.id === p.id && editingCell?.field === 'name' ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleCellBlur}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="w-full bg-gray-700 border border-blue-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm">
                              {p.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-sm">{p.name}</div>
                          </div>
                        )}
                      </td>

                      <td
                        className="px-3 py-2 text-sm border-r border-gray-700 cursor-pointer"
                        style={{ width: columnWidths[2] }}
                        onClick={() => handleCellClick(p.id, 'status', p.status)}
                      >
                        {editingCell?.id === p.id && editingCell?.field === 'status' ? (
                          <select
                            value={editValue}
                            onChange={async (e) => {
                              const newValue = e.target.value;
                              setEditValue(newValue);

                              // อัปเดต UI ทันที
                              setPeople(people.map(person =>
                                person.id === p.id
                                  ? { ...person, status: newValue as "Active" | "Inactive" }
                                  : person
                              ));

                              try {
                                // ✅ แก้ไข: ใช้ ENDPOINTS.STATUSPEOPLE แทน
                                const response = await fetch(ENDPOINTS.STATUSPEOPLE, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    id: p.id,
                                    status: newValue
                                  }),
                                });

                                if (!response.ok) {
                                  throw new Error('Failed to update status');
                                }

                                console.log(`✅ Status updated successfully for person ID ${p.id}`);
                              } catch (err) {
                                console.error("❌ Update failed:", err);
                                // ถ้าอัปเดตไม่สำเร็จ ให้โหลดข้อมูลใหม่จาก server
                                fetchPeople();
                              }

                              setEditingCell(null);
                            }}
                            onBlur={handleCellBlur}
                            autoFocus
                            className="w-full bg-gray-700 border border-blue-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        ) : (
                          p.status
                        )}
                      </td>

                      <td
                        className="px-3 py-2 text-sm border-r border-gray-700 cursor-pointer"
                        style={{ width: columnWidths[3] }}
                        onClick={() => handleCellClick(p.id, 'email', p.email)}
                      >
                        {editingCell?.id === p.id && editingCell?.field === 'email' ? (
                          <input
                            type="email"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleCellBlur}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="w-full bg-gray-700 border border-blue-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
                          />
                        ) : (
                          <span className="underline hover:text-blue-300">{p.email}</span>
                        )}
                      </td>

                      <td
                        className="px-3 py-2 text-sm border-r border-gray-700 cursor-pointer"
                        style={{ width: columnWidths[4] }}
                        onClick={() => handleCellClick(p.id, 'permissionGroup', p.permissionGroup)}
                      >
                        {editingCell?.id === p.id && editingCell?.field === 'permissionGroup' ? (
                          <select
                            value={editValue}
                            onChange={async (e) => {
                              const newValue = e.target.value;
                              setEditValue(newValue);

                              setPeople(people.map(person =>
                                person.id === p.id
                                  ? { ...person, permissionGroup: newValue as Person['permissionGroup'] }
                                  : person
                              ));

                              try {
                                await fetch(`${ENDPOINTS.PEOPLE}/${p.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ permissionGroup: newValue }),
                                });
                              } catch (err) {
                                console.error("❌ Update failed:", err);
                                fetchPeople();
                              }

                              setEditingCell(null);
                            }}
                            onBlur={handleCellBlur}
                            autoFocus
                            className="w-full bg-gray-700 border border-blue-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
                          >
                            <option value="Admin">Admin</option>
                            <option value="Worker">Worker</option>
                            <option value="Manager">Manager</option>
                            <option value="Artist">Artist</option>
                          </select>
                        ) : (
                          p.permissionGroup
                        )}
                      </td>

                      <td
                        className="px-3 py-2 text-sm border-r border-gray-700 cursor-pointer"
                        style={{ width: columnWidths[5] }}
                        onClick={() => handleCellClick(p.id, 'projects', p.projects)}
                      >
                        {editingCell?.id === p.id && editingCell?.field === 'projects' ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleCellBlur}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="w-full bg-gray-700 border border-blue-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
                          />
                        ) : (
                          p.projects
                        )}
                      </td>

                      <td
                        className="px-3 py-2 text-sm border-r border-gray-700 cursor-pointer"
                        style={{ width: columnWidths[6] }}
                        onClick={() => handleCellClick(p.id, 'groups', p.groups)}
                      >
                        {editingCell?.id === p.id && editingCell?.field === 'groups' ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleCellBlur}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="w-full bg-gray-700 border border-blue-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
                          />
                        ) : (
                          p.groups
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {showCreatePerson && (
        <CreatePersonModal
          onClose={() => setShowCreatePerson(false)}
          onCreated={fetchPeople}
          availableSeats={availableSeats}
          totalSeats={totalSeats}
          isToday={isToday}
          timeString={timeString}
          showMoreFields={showMoreFields}
          setShowMoreFields={setShowMoreFields}
          defaultProjectName={projectName}
          allUsers={allUsers}
        />
      )}
    </div>
  );
}

function CreatePersonModal({
  onClose,
  onCreated,
  availableSeats,
  totalSeats,
  isToday,
  timeString,
  showMoreFields,
  setShowMoreFields,
  defaultProjectName,
  allUsers,
}: {
  onClose: () => void;
  onCreated: () => void;
  availableSeats: number;
  totalSeats: number;
  isToday: boolean;
  timeString: string;
  showMoreFields: boolean;
  setShowMoreFields: (show: boolean) => void;
  defaultProjectName: string;
  allUsers: UserData[];
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    status: "Active",
    permissionGroup: "Artist",
    projects: defaultProjectName,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSearch, setEmailSearch] = useState("");
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);

  const now = new Date();

  const filteredUsers = allUsers.filter(user =>
    user.email && user.email.toLowerCase().includes(emailSearch.toLowerCase())
  );

  const handleEmailSelect = (user: UserData) => {
    setForm({
      ...form,
      email: user.email,

    });
    setEmailSearch(user.email);
    setShowEmailDropdown(false);
  };

  const submit = async () => {
    if (!form.firstName || !form.lastName) {
      alert("Please enter first and last name");
      return;
    }

    if (!form.email) {
      alert("Please enter email");
      return;
    }

    try {
      setIsSubmitting(true);


      const newPerson = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        status: form.status,
        permissionGroup: form.permissionGroup,
        projects: form.projects || defaultProjectName,
        groups: "",
        projectId: localStorage.getItem("projectId") || null,
      };

      const response = await fetch(ENDPOINTS.PEOPLE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPerson),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create person');
      }

      console.log("✅ Person created successfully");
      onCreated();
      onClose();
    } catch (err) {
      console.error("❌ Create person failed:", err);
      alert(err instanceof Error ? err.message : "Failed to create person. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#3b3b3b] rounded shadow-xl">
        <div className="px-5 py-3 border-b border-gray-600 flex items-center justify-between">
          <h2 className="text-lg text-gray-200 font-normal">
            Create a new Person <span className="text-gray-400 text-base font-normal">- Global Form</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-[140px_1fr] items-center gap-3">
            <label className="text-sm text-gray-300 text-right">
              First Name:
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full h-9 px-3 bg-[#4a4a4a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Enter first name"
            />
          </div>

          <div className="grid grid-cols-[140px_1fr] items-center gap-3">
            <label className="text-sm text-gray-300 text-right">
              Last Name:
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full h-9 px-3 bg-[#4a4a4a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Enter last name"
            />
          </div>

          <div className="grid grid-cols-[140px_1fr] items-center gap-3">
            <label className="text-sm text-gray-300 text-right">
              Email:
            </label>
            <div className="relative">
              <input
                type="email"
                value={emailSearch}
                onChange={(e) => {
                  setEmailSearch(e.target.value);
                  setForm({ ...form, email: e.target.value });
                  setShowEmailDropdown(true);
                }}
                onFocus={() => setShowEmailDropdown(true)}
                onBlur={() => {
                  setTimeout(() => setShowEmailDropdown(false), 200);
                }}
                className="w-full h-9 px-3 bg-[#4a4a4a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Search or enter email"
              />

              {showEmailDropdown && emailSearch && filteredUsers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-[#4a4a4a] border border-gray-600 rounded shadow-lg max-h-48 overflow-y-auto">
                  {filteredUsers.slice(0, 10).map((user, index) => (
                    <div
                      key={index}
                      onClick={() => handleEmailSelect(user)}
                      className="px-3 py-2 hover:bg-[#555555] cursor-pointer text-sm text-gray-200"
                    >
                      <div className="font-medium">{user.email}</div>
                      {(user.firstName || user.lastName) && (
                        <div className="text-xs text-gray-400">
                          {user.firstName} {user.lastName}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] items-start gap-3">
            <label className="text-sm text-gray-300 text-right pt-2">
              Status:
            </label>
            <div>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full h-9 px-3 bg-[#4a4a4a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">
                จำนวนที่นั่งคงเหลือ
                <span className="text-white"> {availableSeats}/{totalSeats} ที่ </span>
                (ข้อมูลล่าสุด: {isToday ? 'วันนี้' : now.toLocaleDateString('th-TH')} เวลา {timeString})
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] items-center gap-3">
            <label className="text-sm text-gray-300 text-right">
              Permission Group<br />
              <span className="text-xs">(Artist, Admin, or Manager):</span>
            </label>
            <select
              value={form.permissionGroup}
              onChange={(e) => setForm({ ...form, permissionGroup: e.target.value })}
              className="w-full h-9 px-3 bg-[#4a4a4a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
            >
              <option>Artist</option>
              <option>Admin</option>
              <option>Manager</option>
            </select>
          </div>

          <div className="grid grid-cols-[140px_1fr] items-center gap-3">
            <label className="text-sm text-gray-300 text-right">
              Projects:
            </label>
            <input
              type="text"
              value={form.projects}
              onChange={(e) => setForm({ ...form, projects: e.target.value })}
              className="w-full h-9 px-3 bg-[#4a4a4a] border border-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Project name"
            />
          </div>

          <div className="grid grid-cols-[140px_1fr] items-center gap-3">
            <div></div>
            <button
              onClick={() => setShowMoreFields(!showMoreFields)}
              className="text-sm text-gray-300 hover:text-gray-100 text-left flex items-center gap-1"
            >
              More fields {showMoreFields ? '▴' : '▾'}
            </button>
          </div>

          <div className="grid grid-cols-[140px_1fr] items-start gap-3 pt-2">
            <div></div>
            <p className="text-sm text-gray-300">
              ระบบจะเพิ่มผู้ใช้ใหม่โดยอัตโนมัติ
            </p>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-600 flex justify-between items-center">
          <button className="text-sm text-blue-400 hover:underline">
            Open Bulk Import
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 h-9 bg-[#4a4a4a] hover:bg-[#555555] text-gray-200 text-sm rounded flex items-center justify-center disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={submit}
              disabled={isSubmitting}
              className="px-4 h-9 bg-[#4a4a4a] hover:bg-[#555555] text-gray-200 text-sm rounded flex items-center justify-center disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add another person"}
            </button>

            <button
              onClick={submit}
              disabled={isSubmitting}
              className="px-4 h-9 bg-[#00a8e1] hover:bg-[#0096c7] text-white text-sm rounded flex items-center justify-center disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add person"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}