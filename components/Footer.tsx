"use client";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      {/* เส้นแบ่งด้านบนแบบ Gradient บางๆ */}
      <div style={styles.divider} />
      
      <div style={styles.content}>
        <p style={styles.text}>
          <span style={styles.prefix}>TERMINAL ID:</span> 
          <span style={styles.id}> S6619N1004</span>
        </p>
        <p style={styles.subtext}>
          © 2026 SYSTEM CORE · AUTHORIZED ACCESS ONLY
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
      `}</style>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    background: "#0e0e0e", // สีดำเดียวกับหน้าหลัก
    padding: "24px 20px",
    marginTop: "40px",
    position: "relative",
    borderTop: "1px solid #1a1a1a",
  },
  divider: {
    position: "absolute",
    top: -1,
    left: "50%",
    transform: "translateX(-50%)",
    width: "150px",
    height: "1px",
    background: "linear-gradient(90deg, transparent, #e02020, transparent)", // เส้นสีแดงจางๆ
  },
  content: {
    maxWidth: "600px",
    margin: "0 auto",
    textAlign: "center",
  },
  text: {
    fontFamily: "'DM Mono', monospace", // ฟอนต์สไตล์ Terminal
    fontSize: "11px",
    letterSpacing: "1.5px",
    color: "#888",
    margin: 0,
    textTransform: "uppercase",
  },
  prefix: {
    color: "#444",
    marginRight: "8px",
  },
  id: {
    color: "#e02020", // รหัสนักศึกษาใช้สีแดง Accent
    fontWeight: 500,
  },
  subtext: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "8px",
    letterSpacing: "2px",
    color: "#333",
    marginTop: "8px",
    textTransform: "uppercase",
  }
};