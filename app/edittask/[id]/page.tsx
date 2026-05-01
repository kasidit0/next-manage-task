"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      const { data, error } = await supabase
        .from("tasks_tb")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        Swal.fire({
          title: "ข้อผิดพลาด",
          text: "ไม่พบข้อมูลงานในระบบ",
          icon: "error",
          background: "#0e0e0e",
          color: "#e8e8e8",
          confirmButtonColor: "#e02020",
        }).then(() => router.push("/alltask"));
        return;
      }

      setTitle(data.title);
      setDetail(data.detail);
      setIsCompleted(data.is_completed);
      setImagePreview(data.image_url || "");
      setLoading(false);
    };

    if (id) fetchTask();
  }, [id, router]);

  const handleSelectPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpdateClick = async () => {
    if (!title.trim() || !detail.trim()) {
      Swal.fire({
        title: "คำเตือน",
        text: "กรุณากรอกข้อมูลให้ครบถ้วน",
        icon: "warning",
        background: "#0e0e0e",
        color: "#e8e8e8",
        confirmButtonColor: "#e02020",
      });
      return;
    }

    let finalImageUrl = imagePreview;

    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { error: storageError } = await supabase
        .storage
        .from("task-images")
        .upload(fileName, imageFile);

      if (storageError) {
        Swal.fire({
          title: "Error อัปโหลดรูป",
          text: storageError.message,
          icon: "error",
          background: "#0e0e0e",
          color: "#e8e8e8",
          confirmButtonColor: "#e02020",
        });
        return;
      }

      const { data: urlData } = supabase.storage
        .from("task-images")
        .getPublicUrl(fileName);
      finalImageUrl = urlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("tasks_tb")
      .update({
        title,
        detail,
        image_url: finalImageUrl,
        is_completed: isCompleted,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      Swal.fire({
        title: "ผิดพลาด",
        text: updateError.message,
        icon: "error",
        background: "#0e0e0e",
        color: "#e8e8e8",
        confirmButtonColor: "#e02020",
      });
    } else {
      Swal.fire({
        title: "สำเร็จ",
        text: "แก้ไขงานเรียบร้อยแล้ว",
        icon: "success",
        background: "#0e0e0e",
        color: "#e8e8e8",
        confirmButtonColor: "#e02020",
      }).then(() => router.push("/alltask"));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setImageFile(null);
  };

  if (loading) {
    return (
      <div style={{ ...styles.root, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={styles.accentLine} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "3px", color: "#333" }}>
          LOADING...
        </span>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`}</style>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <div style={styles.accentLine} />

      <div style={styles.panel}>
        <div style={styles.leftBar}>
          <div style={styles.leftBarAccent} />
        </div>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.eyebrow}>
            ∙ <span style={{ color: "#e02020" }}>SYSTEM</span> · TASK MANAGER ∙
          </div>
          <h1 style={styles.mainTitle}>
            Edit <em style={{ fontStyle: "normal", color: "#e02020" }}>Task</em>
          </h1>
        </div>

        <div style={styles.dividerRed} />

        {/* Form card */}
        <div style={styles.card}>

          {/* Task name */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>TASK NAME</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              placeholder="ระบุชื่องาน..."
              onFocus={(e) => (e.currentTarget.style.borderColor = "#e02020")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
            />
          </div>

          {/* Detail */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>DETAIL</label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              style={{ ...styles.input, resize: "vertical", minHeight: "96px" }}
              placeholder="ระบุรายละเอียด..."
              onFocus={(e) => (e.currentTarget.style.borderColor = "#e02020")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
            />
          </div>

          {/* Status */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>STATUS</label>
            <select
              value={isCompleted ? "1" : "0"}
              onChange={(e) => setIsCompleted(e.target.value === "1")}
              style={styles.input}
            >
              <option value="0">ยังไม่เสร็จ</option>
              <option value="1">เสร็จ</option>
            </select>
          </div>

          {/* Image */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>IMAGE</label>
            <input
              type="file"
              id="taskpicture"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleSelectPicture}
            />
            <label htmlFor="taskpicture" style={styles.btnUpload}>
              เปลี่ยนรูปภาพ
            </label>

            {imagePreview && (
              <div style={{ marginTop: "12px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "80px", height: "80px", borderRadius: "4px", objectFit: "cover", border: "1px solid #2a2a2a" }}
                />
                <button
                  onClick={handleRemoveImage}
                  style={styles.btnRemove}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#e02020";
                    (e.currentTarget as HTMLButtonElement).style.color = "#e02020";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a";
                    (e.currentTarget as HTMLButtonElement).style.color = "#555";
                  }}
                >
                  ลบรูปออก
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "#1e1e1e", margin: "8px 0 20px" }} />

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button onClick={handleUpdateClick} style={styles.btnSave}>
              บันทึกการแก้ไข
            </button>
            <Link href="/alltask" style={styles.btnCancel}>
              ยกเลิก
            </Link>
          </div>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        body { background: #0e0e0e !important; }
        select option { background: #1a1a1a; color: #e8e8e8; }
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
    maxWidth: "600px",
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
    marginBottom: "28px",
  },
  card: {
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: "8px",
    padding: "28px 24px",
  },
  fieldGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontFamily: "'DM Mono', monospace",
    fontSize: "9px",
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    color: "#444",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    background: "#0e0e0e",
    border: "1px solid #2a2a2a",
    borderRadius: "4px",
    padding: "10px 12px",
    color: "#e8e8e8",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    outline: "none",
    transition: "border-color 0.15s",
    display: "block",
  },
  btnUpload: {
    display: "inline-block",
    background: "transparent",
    border: "1px solid #2a2a2a",
    borderRadius: "4px",
    padding: "8px 16px",
    color: "#888",
    fontFamily: "'DM Mono', monospace",
    fontSize: "10px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  btnRemove: {
    background: "transparent",
    border: "1px solid #2a2a2a",
    borderRadius: "4px",
    padding: "6px 12px",
    color: "#555",
    fontFamily: "'DM Mono', monospace",
    fontSize: "9px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "border-color 0.12s, color 0.12s",
  },
  btnSave: {
    background: "#e02020",
    color: "#fff",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    border: "none",
    borderRadius: "4px",
    padding: "11px 24px",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  btnCancel: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "10px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "#444",
    textDecoration: "none",
    transition: "color 0.12s",
  },
};