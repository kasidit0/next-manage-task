"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // ตรวจสอบว่า path ตรงกับที่คุณวางไฟล์ไว้
import Swal from "sweetalert2";

export default function TestPage() {
  const [dbData, setDbData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. ฟังก์ชันทดสอบการอ่านข้อมูล (Read)
  const checkConnection = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("tasks_tb").select("*").limit(5);

      if (error) throw error;

      setDbData(data || []);
      console.log("เชื่อมต่อสำเร็จ:", data);
    } catch (error: any) {
      console.error("Error:", error.message);
      Swal.fire({
        icon: "error",
        title: "การเชื่อมต่อล้มเหลว",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // 2. ฟังก์ชันทดสอบการเพิ่มข้อมูล (Create)
  const handleTestAdd = async () => {
    const { error } = await supabase
      .from("tasks_tb")
      .insert([{ title: "งานทดสอบจากระบบ", status: "pending" }]);

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire("Success", "เพิ่มข้อมูลทดสอบสำเร็จ!", "success");
      checkConnection(); // รีเฟรชข้อมูล
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-5">Supabase Connection Test</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <button 
          onClick={handleTestAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-5 hover:bg-blue-600 transition-colors cursor-pointer"
        >
          + ทดสอบเพิ่มข้อมูล (Create Test)
        </button>

        <h2 className="text-lg font-semibold mb-3">ข้อมูลในตาราง tasks_tb:</h2>
        
        {loading ? (
          <p>กำลังโหลด...</p>
        ) : dbData.length > 0 ? (
          <ul className="space-y-2">
            {dbData.map((item) => (
              <li key={item.id} className="border-b pb-2">
                <span className="font-mono text-sm text-gray-500">[{item.id}]</span> {item.title} 
                <span className={`ml-2 px-2 py-1 text-xs rounded ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">ไม่พบข้อมูลในตาราง หรือยังไม่ได้สร้างข้อมูล</p>
        )}
      </div>

      <div className="mt-5 text-sm text-gray-400">
        <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
      </div>
    </div>
  );
}