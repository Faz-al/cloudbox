import { useEffect, useState } from "react";
import { API_BASE } from "../utils/api";

export default function Trash() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchTrash();
  }, []);

  const fetchTrash = async () => {
    const res = await fetch(`${API_BASE}/files/trash`, {
      credentials: "include",
    });
    const data = await res.json();
    setItems(data);
  };

  const restore = async (id) => {
    await fetch(`${API_BASE}/files/trash/${id}/restore`, {
      method: "POST",
      credentials: "include",
    });

    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const deleteForever = async (id) => {
    await fetch(`${API_BASE}/files/trash/${id}/permanent`, {
      method: "DELETE",
      credentials: "include",
    });

    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Trash</h1>

      {items.length === 0 && <p>No items in trash</p>}

      {items.map((item) => (
        <div
          key={item._id}
          className="flex justify-between items-center border p-3 mb-2"
        >
          <span>{item.name}</span>

          <div className="flex gap-2">
            <button onClick={() => restore(item._id)}>Restore</button>
            <button onClick={() => deleteForever(item._id)}>
              Delete forever
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
