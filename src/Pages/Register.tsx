import { useState } from "react";
import axios from "axios";
import ENDPOINTS from "../config";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleRegister = async (): Promise<void> => {
        if (!email || !username || !password || !confirmPassword || !role) {
            setError("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await axios.post(ENDPOINTS.REGISTER, {
                email,
                username,
                password,
                role,
            });

            alert("Register success! Please login.");
            window.location.href = "/";
        } catch {
            setError("Registration failed");
        } finally {
            setLoading(false);
        }
    };

    // ---------- styles ----------
   

    const contentStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Arial, sans-serif",
};




    const cardStyle: React.CSSProperties = {
        backgroundColor: "rgba(15, 14, 14, 0.8)",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        width: "300px",
        height: "max-content",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",

    };

    const titleStyle: React.CSSProperties = {
        color: "rgba(36, 47, 167, 1)",
        fontSize: "xx-large",
        fontWeight: "800",
        paddingBottom: "20px",
    };

    const inputStyle: React.CSSProperties = {
        
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "5px",
        border: "none",
        fontSize: "16px",
        outline: "none",
        backgroundColor: "rgba(0, 0, 0, 0.63)",
        boxShadow: "inset 0 0 15px rgba(255,255,255.0.2)",
        color: "white",
        fontFamily: "Segoe UI , Tahoma, Geneva, Verdana, sans-serif",
    };

    const buttonStyle: React.CSSProperties = {
        padding: "10px",
        fontSize: "1rem",
        borderRadius: "5px",
        border: "none",
        backgroundColor: "rgba(2, 120, 247, 1)",
        color: "black",
        fontWeight: "700",
        cursor: "pointer",
    };

    const buttonDisabledStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: "#aaa",
        cursor: "not-allowed",
    };

    const errorStyle: React.CSSProperties = {
        color: "red",
        marginBottom: "15px",
        textAlign: "center",
        fontSize: "0.9rem",
    };
    const logoStyle: React.CSSProperties = {
        width: "90px",
        height: "90px",
        objectFit: "cover",
        borderRadius: "50%",
        margin: "0 auto 20px",
        display: "block",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    };

    // ---------- render ----------
    return (
  <>
    {/* ===== Space Background ===== */}
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
          "radial-gradient(circle at center, rgba(0,0,0,0.25), rgba(0,0,0,0.85))",
      }}
    />

    {/* ===== Register Content ===== */}
    <div style={contentStyle}>
      <div style={cardStyle}>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX7twFVDnuQJdGFWns0m7bKsKNK5tldjNBbA&s"
          alt="logo"
          style={logoStyle}
        />

        <h2 style={titleStyle}>SIGN UP</h2>

        {error && <div style={errorStyle}>{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select Role</option>
          <option value="Producer">Producer</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Artist">Artist</option>
        </select>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          style={loading ? buttonDisabledStyle : buttonStyle}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "0.9rem",
            color: "white",
          }}
        >
          Already have an account?{" "}
          <span
            style={{ color: "#667eea", cursor: "pointer" }}
            onClick={() => (navigate("/"))}
          >
            signin
          </span>
        </p>
      </div>
    </div>
  </>
);

    
}
