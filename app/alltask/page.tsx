"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabase";

type Task = {
  id: string;
  title: string;
  detail: string;
  image_url: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks_tb")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error.message);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDeleteClick = async (id: string) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: "รายการนี้จะถูกลบออกจากฐานข้อมูลอย่างถาวร",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e02020",
      confirmButtonText: "ใช่, ลบเลย",
      cancelButtonText: "ยกเลิก",
      background: "#0e0e0e",
      color: "#e8e8e8",
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase.from("tasks_tb").delete().eq("id", id);

    if (error) {
      Swal.fire({
        title: "ผิดพลาด",
        text: error.message,
        icon: "error",
        background: "#0e0e0e",
        color: "#e8e8e8",
        confirmButtonColor: "#e02020",
      });
    } else {
      Swal.fire({
        title: "สำเร็จ",
        text: "ลบงานเรียบร้อยแล้ว",
        icon: "success",
        background: "#0e0e0e",
        color: "#e8e8e8",
        confirmButtonColor: "#e02020",
      });
      fetchTasks();
    }
  };

  const totalDone = tasks.filter((t) => t.is_completed).length;
  const totalPending = tasks.filter((t) => !t.is_completed).length;

  return (
    <div style={styles.root}>
      {/* Top accent line */}
      <div style={styles.accentLine} />

      <div style={styles.panel}>
        {/* Left bar */}
        <div style={styles.leftBar}>
          <div style={styles.leftBarAccent} />
        </div>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.eyebrow}>
            ∙ <span style={{ color: "#e02020" }}>SYSTEM</span> · TASK MANAGER ∙
          </div>
          <h1 style={styles.mainTitle}>
            All <em style={{ fontStyle: "normal", color: "#e02020" }}>Tasks</em>
          </h1>
        </div>

        <div style={styles.dividerRed} />

        {/* Top bar */}
        <div style={styles.topbar}>
          <div style={styles.metaRow}>
            <div style={styles.metaItem}>
              TOTAL <b style={{ color: "#aaa", fontWeight: 500 }}>{tasks.length.toString().padStart(2, "0")}</b>
            </div>
            <div style={styles.metaItem}>
              DONE <b style={{ color: "#aaa", fontWeight: 500 }}>{totalDone.toString().padStart(2, "0")}</b>
            </div>
            <div style={styles.metaItem}>
              PENDING <b style={{ color: "#e02020", fontWeight: 500 }}>{totalPending.toString().padStart(2, "0")}</b>
            </div>
          </div>
          <Link href="/addtask" style={styles.btnAdd}>
            + เพิ่มงานใหม่
          </Link>
        </div>

        {/* Table */}
        <div style={{ width: "100%", overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["IMG", "TASK", "DETAIL", "DATE", "STATUS", "ACTION"].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      ...styles.th,
                      textAlign: [0, 3, 4, 5].includes(i) ? "center" : "left",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ ...styles.td, textAlign: "center", padding: "48px", color: "#333", fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "2px" }}>
                    LOADING...
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ ...styles.td, textAlign: "center", padding: "48px", color: "#333", fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "2px" }}>
                    NO TASKS FOUND
                  </td>
                </tr>
              ) : (
                tasks.map((item) => (
                  <tr key={item.id} style={styles.tr}>
                    {/* Image */}
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          style={styles.taskImg}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div style={styles.noImg}>N/A</div>
                      )}
                    </td>

                    {/* Task name */}
                    <td style={styles.td}>
                      <div style={styles.taskName}>{item.title}</div>
                      <div style={styles.taskSub}>{item.detail}</div>
                    </td>

                    {/* Detail */}
                    <td style={{ ...styles.td, fontSize: "12px", color: "#3a3a3a", maxWidth: "180px" }}>
                      {item.detail}
                    </td>

                    {/* Date */}
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <div style={styles.dateTxt}>
                        {new Date(item.created_at).toLocaleDateString("th-TH", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })}
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      {item.is_completed ? (
                        <span style={styles.pillDone}>Done</span>
                      ) : (
                        <span style={styles.pillPending}>Pending</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <div style={styles.actionGroup}>
                        <Link href={`/edittask/${item.id}`} style={styles.btnEdit}>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(item.id)}
                          style={styles.btnDel}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#e02020";
                            (e.currentTarget as HTMLButtonElement).style.color = "#e02020";
                            (e.currentTarget as HTMLButtonElement).style.background = "#1a0a0a";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e1e1e";
                            (e.currentTarget as HTMLButtonElement).style.color = "#3a3a3a";
                            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                          }}
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={styles.footerBar}>
          <div style={styles.footerTxt}>
            <span style={{ color: "#e02020" }}>●</span> SUPABASE CONNECTED
          </div>
          <div style={styles.footerTxt}>MANAGE TASK APP</div>
        </div>
      </div>

      {/* DM fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        body { background: #0e0e0e !important; }
        tr:hover td { background: #131313; }
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
    padding: "40px 28px 56px",
    position: "relative",
  },
  accentLine: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: "2px",
    background: "linear-gradient(90deg, transparent 0%, #e02020 30%, #ff4444 50%, #e02020 70%, transparent 100%)",
  },
  panel: {
    maxWidth: "900px",
    margin: "0 auto",
    position: "relative",
  },
  leftBar: {
    position: "absolute",
    left: "-20px",
    top: 0, bottom: 0,
    width: "2px",
    background: "#1a1a1a",
  },
  leftBarAccent: {
    position: "absolute",
    top: 0, left: 0,
    width: "2px",
    height: "60px",
    background: "#e02020",
  },
  header: {
    marginBottom: "32px",
  },
  eyebrow: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "10px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "#555",
    marginBottom: "10px",
  },
  mainTitle: {
    fontSize: "30px",
    fontWeight: 600,
    color: "#fff",
    letterSpacing: "-0.5px",
    lineHeight: 1.1,
  },
  dividerRed: {
    height: "1px",
    background: "linear-gradient(90deg, #e02020 0%, transparent 40%)",
    marginBottom: "24px",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  },
  metaRow: {
    display: "flex",
    gap: "24px",
    alignItems: "center",
  },
  metaItem: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "11px",
    letterSpacing: "1px",
    color: "#444",
  },
  btnAdd: {
    background: "#e02020",
    color: "#fff",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    border: "none",
    borderRadius: "4px",
    padding: "10px 20px",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  },
  th: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "9px",
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    color: "#444",
    fontWeight: 400,
    padding: "10px 16px",
    borderBottom: "1px solid #1e1e1e",
  },
  tr: {
    borderBottom: "1px solid #161616",
    transition: "background 0.12s",
  },
  td: {
    padding: "16px 16px",
    verticalAlign: "middle",
    color: "#bbb",
  },
  taskImg: {
    width: "44px",
    height: "44px",
    borderRadius: "4px",
    objectFit: "cover",
    border: "1px solid #222",
    display: "block",
    margin: "0 auto",
  },
  noImg: {
    width: "44px",
    height: "44px",
    borderRadius: "4px",
    border: "1px solid #1e1e1e",
    background: "#111",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    fontFamily: "'DM Mono', monospace",
    fontSize: "8px",
    letterSpacing: "1px",
    color: "#333",
  },
  taskName: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#eee",
    marginBottom: "3px",
  },
  taskSub: {
    fontSize: "11px",
    color: "#444",
    maxWidth: "200px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  dateTxt: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "11px",
    color: "#3a3a3a",
    letterSpacing: "0.5px",
  },
  pillDone: {
    display: "inline-block",
    borderRadius: "2px",
    padding: "3px 10px",
    fontSize: "10px",
    fontWeight: 500,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    fontFamily: "'DM Mono', monospace",
    background: "#111",
    border: "1px solid #2a2a2a",
    color: "#666",
  },
  pillPending: {
    display: "inline-block",
    borderRadius: "2px",
    padding: "3px 10px",
    fontSize: "10px",
    fontWeight: 500,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    fontFamily: "'DM Mono', monospace",
    background: "#1a0a0a",
    border: "1px solid #3a1010",
    color: "#e02020",
  },
  actionGroup: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
  },
  btnEdit: {
    width: "60px",
    padding: "6px 0",
    fontSize: "11px",
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "1px",
    cursor: "pointer",
    borderRadius: "3px",
    textTransform: "uppercase",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    background: "transparent",
    border: "1px solid #2a2a2a",
    color: "#888",
    transition: "border-color 0.12s, color 0.12s",
  },
  btnDel: {
    width: "60px",
    padding: "6px 0",
    fontSize: "11px",
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "1px",
    cursor: "pointer",
    borderRadius: "3px",
    textTransform: "uppercase",
    textAlign: "center",
    background: "transparent",
    border: "1px solid #1e1e1e",
    color: "#3a3a3a",
    transition: "border-color 0.12s, color 0.12s, background 0.12s",
  },
  footerBar: {
    marginTop: "28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #161616",
    paddingTop: "16px",
  },
  footerTxt: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "9px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#2a2a2a",
  },
};