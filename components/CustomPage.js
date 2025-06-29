import { useState, useEffect, useRef } from "react";

export default function CustomPage({ pageId }) {
  const [boxes, setBoxes] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    const saved = localStorage.getItem(`customPage_${pageId}`);
    if (saved) setBoxes(JSON.parse(saved));
  }, [pageId]);

  useEffect(() => {
    localStorage.setItem(`customPage_${pageId}`, JSON.stringify(boxes));
  }, [boxes, pageId]);

  const addBox = (type) => {
    setBoxes([
      ...boxes,
      { id: Date.now(), type, content: "", file: null, fileName: "" },
    ]);
  };

  const updateBox = (id, data) => {
    setBoxes(boxes.map((box) => (box.id === id ? { ...box, ...data } : box)));
  };

  const removeBox = (id) => {
    setBoxes(boxes.filter((box) => box.id !== id));
  };

  const handleFileChange = (e, id) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateBox(id, { file: ev.target.result, fileName: file.name });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => addBox("text")}
          className="bg-pastel-pink text-accent px-3 py-1 rounded font-bold text-xs hover:bg-pastel-blue transition"
        >
          + Text Box
        </button>
        <button
          onClick={() => addBox("image")}
          className="bg-pastel-blue text-accent px-3 py-1 rounded font-bold text-xs hover:bg-pastel-pink transition"
        >
          + Image
        </button>
        <button
          onClick={() => addBox("document")}
          className="bg-pastel-yellow text-accent px-3 py-1 rounded font-bold text-xs hover:bg-pastel-pink transition"
        >
          + Document
        </button>
      </div>
      {boxes.map((box) => (
        <div
          key={box.id}
          className="bg-white/80 border border-pastel-pink rounded-xl p-4 shadow flex flex-col gap-2 relative"
        >
          <button
            onClick={() => removeBox(box.id)}
            className="absolute top-2 right-2 text-xs text-red-400 hover:text-red-600"
            title="Remove"
          >
            ✕
          </button>
          {box.type === "text" && (
            <textarea
              className="w-full bg-pastel-yellow/30 border border-pastel-blue rounded p-2 text-gray-800 focus:ring-2 focus:ring-pastel-pink"
              rows={3}
              value={box.content}
              onChange={(e) => updateBox(box.id, { content: e.target.value })}
              placeholder="Write your notes or ideas..."
            />
          )}
          {box.type === "image" && (
            <div>
              {box.file ? (
                <img
                  src={box.file}
                  alt="Uploaded"
                  className="max-h-48 rounded shadow mb-2"
                />
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(e, box.id)}
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="bg-pastel-blue text-accent px-2 py-1 rounded text-xs hover:bg-pastel-pink"
                  >
                    Upload Image
                  </button>
                </>
              )}
              {box.file && (
                <button
                  onClick={() =>
                    updateBox(box.id, { file: null, fileName: "" })
                  }
                  className="text-xs text-red-400 hover:text-red-600 ml-2"
                >
                  Remove Image
                </button>
              )}
            </div>
          )}
          {box.type === "document" && (
            <div>
              {box.file ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{box.fileName}</span>
                  <a
                    href={box.file}
                    download={box.fileName}
                    className="text-xs text-blue-500 underline"
                  >
                    Download
                  </a>
                  <button
                    onClick={() =>
                      updateBox(box.id, { file: null, fileName: "" })
                    }
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(e, box.id)}
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="bg-pastel-yellow text-accent px-2 py-1 rounded text-xs hover:bg-pastel-pink"
                  >
                    Upload Document
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
