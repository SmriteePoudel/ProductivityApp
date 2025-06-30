const fs = require("fs");
const path = require("path");

const DASHBOARD_PATH = path.join(
  __dirname,
  "../components/UnifiedDashboard.js"
);

const pastelSection = `developer: {
  code: (
    <div className="p-6 bg-gradient-to-br from-blue-100 to-teal-100 text-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Code Repository</h2>
      <p>Code management</p>
    </div>
  ),
  bugs: (
    <div className="p-6 bg-gradient-to-br from-pink-100 to-orange-100 text-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Bug Tracking</h2>
      <p>Bug management</p>
    </div>
  ),
  deployments: (
    <div className="p-6 bg-gradient-to-br from-green-100 to-yellow-100 text-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Deployments</h2>
      <p>Deployment management</p>
    </div>
  ),
  documentation: (
    <>
      <div className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 text-gray-900 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Documentation</h2>
        <p>Technical documentation</p>
      </div>
      <EditableDeveloperNotesBox />
    </>
  ),
},`;

const notesBoxComponent = `
function EditableDeveloperNotesBox() {
  const [notes, setNotes] = React.useState([
    { id: 1, title: "Setup Instructions", content: "Clone the repo and run npm install." },
    { id: 2, title: "API Docs", content: "See /docs for API documentation." },
  ]);
  const [editingId, setEditingId] = React.useState(null);
  const [form, setForm] = React.useState({ title: "", content: "" });
  const [adding, setAdding] = React.useState(false);

  const handleAdd = () => {
    setForm({ title: "", content: "" });
    setAdding(true);
    setEditingId(null);
  };
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setAdding(false);
  };
  const handleSave = () => {
    if (adding) {
      setNotes([...notes, { ...form, id: Date.now() }]);
      setAdding(false);
    } else {
      setNotes(notes.map((i) => (i.id === editingId ? form : i)));
      setEditingId(null);
    }
    setForm({ title: "", content: "" });
  };
  const handleDelete = (id) => {
    setNotes(notes.filter((i) => i.id !== id));
    setEditingId(null);
    setAdding(false);
  };
  return (
    <div className="p-6 bg-gradient-to-br from-yellow-100 to-green-100 text-gray-900 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Developer Notes (Editable)</h2>
      <button
        onClick={handleAdd}
        className="mb-4 bg-yellow-400 text-white px-4 py-2 rounded"
      >
        Add Note
      </button>
      <div className="space-y-4">
        {(adding || editingId) && (
          <div className="space-y-2 border-b pb-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Content</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <button
              onClick={handleSave}
              className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setEditingId(null);
              }}
              className="mt-2 ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
        {notes.map((item) => (
          <div key={item.id} className="space-y-2 border-b pb-4">
            <div>
              <span className="font-medium">Title:</span> {item.title}
            </div>
            <div>
              <span className="font-medium">Content:</span> {item.content}
            </div>
            <button
              onClick={() => handleEdit(item)}
              className="bg-yellow-400 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-400 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
`;

function updateFile() {
  let content = fs.readFileSync(DASHBOARD_PATH, "utf8");

  // Replace the developer dashboard section
  const devSectionRegex = /developer:\s*{[\s\S]*?},\n\s*designer:/;
  if (devSectionRegex.test(content)) {
    content = content.replace(
      devSectionRegex,
      pastelSection + "\n      designer:"
    );
    console.log(
      "✔ Updated developer dashboard section with pastel backgrounds."
    );
  } else {
    console.log("✖ Could not find developer dashboard section.");
  }

  // Append EditableDeveloperNotesBox if not present
  if (!content.includes("function EditableDeveloperNotesBox()")) {
    content += notesBoxComponent;
    console.log(
      "✔ Appended EditableDeveloperNotesBox component at the end of the file."
    );
  } else {
    console.log("✔ EditableDeveloperNotesBox already present.");
  }

  fs.writeFileSync(DASHBOARD_PATH, content, "utf8");
  console.log("✅ Update complete.");
}

updateFile();
