"use client";

import Image from "next/image";
import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    if (password === "1234") {
      router.push("/alltask");
    } else {
      Swal.fire({
        title: "ACCESS DENIED",
        text: "รหัสผ่านไม่ถูกต้อง กรุณลองใหม่อีกครั้ง",
        icon: "error",
        background: "#0e0e0e",
        color: "#e8e8e8",
        confirmButtonColor: "#e02020",
        // แก้ไข: ใช้ customClass แทนการใส่ fontFamily ตรงๆ เพื่อไม่ให้โค้ดแดง
        customClass: {
          popup: 'cyber-swal-font'
        }
      });
    }
  };

  return (
    <div style={styles.root}>
      {/* เส้น Accent ด้านบนสุด */}
      <div style={styles.accentLine} />

      <div style={styles.panel}>
        {/* แถบเส้นด้านซ้าย */}
        <div style={styles.leftBar}>
          <div style={styles.leftBarAccent} />
        </div>

        {/* ส่วนหัว (Header) */}
        <div style={styles.header}>
          <div style={styles.eyebrow}>
            ∙ <span style={{ color: "#e02020" }}>SECURITY</span> · AUTHENTICATION ∙
          </div>
          <h1 style={styles.mainTitle}>
            Login <em style={{ fontStyle: "normal", color: "#e02020" }}>System</em>
          </h1>
        </div>

        <div style={styles.dividerRed} />

        {/* การ์ดเข้าสู่ระบบ */}
        <div style={styles.card}>
          <div style={styles.imageContainer}>
            <Image
              src="/imgtask.png"
              alt="Task illustration"
              width={100}
              height={100}
              priority
              style={{ filter: "grayscale(1) brightness(0.8)" }}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>ACCESS KEY</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="ENTER PASSWORD"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#e02020")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword((s) => !s)}
                style={styles.checkbox}
              />
              SHOW KEY
            </label>
          </div>

          <div style={{ height: "1px", background: "#1e1e1e", margin: "8px 0 20px" }} />

          <button onClick={handleClick} style={styles.btnLogin}>
            AUTHORIZE ACCESS
          </button>
        </div>
        
        <div style={styles.footerText}>
          AUTHORIZED PERSONNEL ONLY
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        
        body { 
          background: #0e0e0e !important; 
          margin: 0; 
        }

        /* กำหนดฟอนต์ให้ SweetAlert2 ผ่าน class */
        .cyber-swal-font {
          font-family: 'DM Mono', monospace !important;
        }

        /* ปรับแต่งปุ่มของ SweetAlert ให้เหลี่ยมเข้ากับธีม */
        .cyber-swal-font .swal2-confirm {
          border-radius: 4px !important;
          font-family: 'DM Sans', sans-serif !important;
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    background: "#0e0e0e",
    minHeight: "100vh",
    fontFamily: "'DM Sans', sans-serif",
    color: "#e8e8e8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    padding: "20px",
  },
  accentLine: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: "2px",
    background: "linear-gradient(90deg, transparent 0%, #e02020 30%, #ff4444 50%, #e02020 70%, transparent 100%)",
  },
  panel: {
    width: "100%",
    maxWidth: "400px",
    position: "relative",
  },
  leftBar: {
    position: "absolute",
    left: "-24px",
    top: 0, bottom: 0,
    width: "2px",
    background: "#1a1a1a",
  },
  leftBarAccent: {
    position: "absolute",
    top: "20%", left: 0,
    width: "2px",
    height: "40px",
    background: "#e02020",
  },
  header: {
    marginBottom: "24px",
    textAlign: "left",
  },
  eyebrow: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "9px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "#555",
    marginBottom: "8px",
  },
  mainTitle: {
    fontSize: "28px",
    fontWeight: 600,
    color: "#fff",
    letterSpacing: "-0.5px",
    margin: 0,
  },
  dividerRed: {
    height: "1px",
    background: "linear-gradient(90deg, #e02020 0%, transparent 60%)",
    marginBottom: "28px",
  },
  card: {
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: "8px",
    padding: "32px 28px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },
  fieldGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontFamily: "'DM Mono', monospace",
    fontSize: "9px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#444",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    background: "#0e0e0e",
    border: "1px solid #2a2a2a",
    borderRadius: "4px",
    padding: "12px",
    color: "#e8e8e8",
    fontFamily: "'DM Mono', monospace",
    fontSize: "14px",
    outline: "none",
    textAlign: "center",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    fontFamily: "'DM Mono', monospace",
    fontSize: "9px",
    color: "#555",
    letterSpacing: "1px",
    cursor: "pointer",
  },
  checkbox: {
    marginRight: "8px",
    accentColor: "#e02020",
  },
  btnLogin: {
    width: "100%",
    background: "#e02020",
    color: "#fff",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    border: "none",
    borderRadius: "4px",
    padding: "14px",
    cursor: "pointer",
    transition: "all 0.2s",
    letterSpacing: "1px",
  },
  footerText: {
    marginTop: "20px",
    textAlign: "center",
    fontFamily: "'DM Mono', monospace",
    fontSize: "8px",
    color: "#333",
    letterSpacing: "2px",
  }
};