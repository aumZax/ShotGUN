import { useState } from "react";
import axios from "axios";
import ENDPOINTS from "../config";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please enter email and password");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await axios.post(ENDPOINTS.LOGIN, {
                identifier: email,
                password,
            });

            console.log("=== LOGIN DEBUG ===");
            console.log("Full response:", res.data);
            console.log("==================");

            // กรณี Backend ส่งมาแบบ { token, user }
            if (res.data.token && res.data.user) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("authUser", JSON.stringify(res.data.user));
                console.log("✓ Saved (format 1): token + user object");
            } 
            // กรณี Backend ส่งมาแบบแยก field (uid, username, email, role)
            else if (res.data.uid || res.data.username) {
                const userObject = {
                    uid: res.data.uid,
                    username: res.data.username,
                    email: res.data.email,
                    name: res.data.name || res.data.username,
                    role: res.data.role,
                };
                localStorage.setItem("token", "dummy-token"); // ถ้าไม่มี token
                localStorage.setItem("authUser", JSON.stringify(userObject));
                console.log("✓ Saved (format 2): converted to user object", userObject);
            } else {
                console.warn("⚠ Unknown response format");
            }

            // ยืนยันว่าบันทึกสำเร็จ
            console.log("=== VERIFY SAVED DATA ===");
            console.log("Token from storage:", localStorage.getItem("token"));
            console.log("AuthUser from storage:", localStorage.getItem("authUser"));
            console.log("=========================");

            // รอ 100ms ให้แน่ใจว่า localStorage บันทึกเสร็จ
            await new Promise(resolve => setTimeout(resolve, 100));

            navigate("/Home");
        } catch (err) {
            console.error("Login error:", err);
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    /* ---------- styles ---------- */

    const contentStyle: React.CSSProperties = {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
    };

    const cardStyle: React.CSSProperties = {
        background: "rgba(10, 10, 30, 0.30)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
        padding: "26px",
        borderRadius: "18px",
        width: "320px",
        textAlign: "center",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: `
            0 0 60px rgba(120, 100, 255, 0.35),
            0 25px 70px rgba(0,0,0,0.8)
        `,
    };

    const titleStyle: React.CSSProperties = {
        color: "#4f6bff",
        fontSize: "2rem",
        fontWeight: 800,
        marginBottom: "20px",
    };

    const inputStyle: React.CSSProperties = {
        padding: "10px",
        marginBottom: "12px",
        borderRadius: "6px",
        border: "none",
        backgroundColor: "rgba(0,0,0,0.65)",
        color: "white",
        fontSize: "16px",
        outline: "none",
        width: "100%",
    };

    const buttonStyle: React.CSSProperties = {
        padding: "10px",
        borderRadius: "6px",
        border: "none",
        backgroundColor: "#0278f7",
        fontWeight: 700,
        cursor: "pointer",
        width: "100%",
        color: "white",
    };

    const errorStyle: React.CSSProperties = {
        color: "#ff4d4f",
        marginBottom: "10px",
        fontSize: "0.9rem",
    };

    const logoStyle: React.CSSProperties = {
        width: "90px",
        height: "90px",
        borderRadius: "50%",
        margin: "0 auto 20px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
    };

    /* ---------- render ---------- */

    return (
        <>
            {/* ===== Space BG ===== */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: -2,
                    overflow: "hidden",
                }}
            >
                <iframe
                    src="/bg.html"
                    title="space-bg"
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        pointerEvents: "none",
                    }}
                />
            </div>

            {/* ===== Dark Overlay ===== */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: -1,
                    background:
                        "radial-gradient(circle at center, rgba(0,0,0,0.35), rgba(0,0,0,0.85))",
                }}
            />

            {/* ===== Login Content ===== */}
            <div style={contentStyle}>
                <div style={cardStyle}>
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX7twFVDnuQJdGFWns0m7bKsKNK5tldjNBbA&s"
                        alt="logo"
                        style={logoStyle}
                    />

                    <h2 style={titleStyle}>SIGN IN</h2>

                    {error && <div style={errorStyle}>{error}</div>}

                    <input
                        type="email"
                        placeholder="Username or Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />

                    <button onClick={handleLogin} disabled={loading} style={buttonStyle}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p style={{ marginTop: 20, fontSize: "0.9rem", color: "white" }}>
                        Don't have an account?{" "}
                        <span
                            style={{ color: "#667eea", cursor: "pointer" }}
                            onClick={() => navigate("/register")}
                        >
                            sign up
                        </span>
                    </p>
                </div>
            </div>
        </>
    );
}