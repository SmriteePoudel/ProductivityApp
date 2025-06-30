const fs = require("fs");
const path = require("path");

const DASHBOARD_PATH = path.join(
  __dirname,
  "../components/UnifiedDashboard.js"
);

const newDocsSection = `documentation: (\n  <>\n    <div className=\"p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg shadow-md mb-6\">\n      <h2 className=\"text-2xl font-bold mb-4 text-purple-700\">Documentation</h2>\n      <p>Technical documentation</p>\n    </div>\n    <EditableDevDocsBox />\n  </>\n),`;

const devDocsBoxComponent = `\n// EditableDevDocsBox: Editable CRUD box for developer documentation info\nfunction EditableDevDocsBox() {\n  const [docs, setDocs] = React.useState([\n    { id: 1, title: \"API Reference\", content: \"See /docs/api for all endpoints.\" },\n    { id: 2, title: \"Setup Guide\", content: \"Clone the repo and run npm install.\" },\n  ]);\n  const [editingId, setEditingId] = React.useState(null);\n  const [form, setForm] = React.useState({ title: \"\", content: \"\" });\n  const [adding, setAdding] = React.useState(false);\n\n  const handleAdd = () => {\n    setForm({ title: \"\", content: \"\" });\n    setAdding(true);\n    setEditingId(null);\n  };\n  const handleEdit = (item) => {\n    setForm(item);\n    setEditingId(item.id);\n    setAdding(false);\n  };\n  const handleSave = () => {\n    if (adding) {\n      setDocs([...docs, { ...form, id: Date.now() }]);\n      setAdding(false);\n    } else {\n      setDocs(docs.map((i) => (i.id === editingId ? form : i)));\n      setEditingId(null);\n    }\n    setForm({ title: \"\", content: \"\" });\n  };\n  const handleDelete = (id) => {\n    setDocs(docs.filter((i) => i.id !== id));\n    setEditingId(null);\n    setAdding(false);\n  };\n  return (\n    <div className=\"p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-md mb-6\">\n      <h2 className=\"text-xl font-bold mb-4 text-yellow-700\">Documentation Info (Editable)</h2>\n      <button\n        onClick={handleAdd}\n        className=\"mb-4 bg-yellow-500 text-white px-4 py-2 rounded\"\n      >\n        Add Info\n      </button>\n      <div className=\"space-y-4\">\n        {(adding || editingId) && (\n          <div className=\"space-y-2 border-b pb-4\">\n            <div>\n              <label className=\"block text-sm font-medium\">Title</label>\n              <input\n                type=\"text\"\n                value={form.title}\n                onChange={(e) => setForm({ ...form, title: e.target.value })}\n                className=\"w-full border rounded px-2 py-1\"\n              />\n            </div>\n            <div>\n              <label className=\"block text-sm font-medium\">Content</label>\n              <textarea\n                value={form.content}\n                onChange={(e) => setForm({ ...form, content: e.target.value })}\n                className=\"w-full border rounded px-2 py-1\"\n              />\n            </div>\n            <button\n              onClick={handleSave}\n              className=\"mt-2 bg-yellow-500 text-white px-4 py-2 rounded\"\n            >\n              Save\n            </button>\n            <button\n              onClick={() => {\n                setAdding(false);\n                setEditingId(null);\n              }}\n              className=\"mt-2 ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded\"\n            >\n              Cancel\n            </button>\n          </div>\n        )}\n        {docs.map((item) => (\n          <div key={item.id} className=\"space-y-2 border-b pb-4\">\n            <div>\n              <span className=\"font-medium\">Title:</span> {item.title}\n            </div>\n            <div>\n              <span className=\"font-medium\">Content:</span> {item.content}\n            </div>\n            <button\n              onClick={() => handleEdit(item)}\n              className=\"bg-yellow-400 text-white px-4 py-2 rounded mr-2\"\n            >\n              Edit\n            </button>\n            <button\n              onClick={() => handleDelete(item.id)}\n              className=\"bg-red-400 text-white px-4 py-2 rounded\"\n            >\n              Delete\n            </button>\n          </div>\n        ))}\n      </div>\n    </div>\n  );\n}\n`;

function updateFile() {
  let content = fs.readFileSync(DASHBOARD_PATH, "utf8");

  // Replace the developer documentation section
  const docsSectionRegex = /documentation:\s*\([\s\S]*?\),/;
  if (docsSectionRegex.test(content)) {
    content = content.replace(docsSectionRegex, newDocsSection);
    console.log(
      "✔ Updated developer documentation section with pastel title and EditableDevDocsBox."
    );
  } else {
    console.log("✖ Could not find developer documentation section.");
  }

  // Append EditableDevDocsBox if not present
  if (!content.includes("function EditableDevDocsBox()")) {
    content += devDocsBoxComponent;
    console.log(
      "✔ Appended EditableDevDocsBox component at the end of the file."
    );
  } else {
    console.log("✔ EditableDevDocsBox already present.");
  }

  fs.writeFileSync(DASHBOARD_PATH, content, "utf8");
  console.log("✅ Update complete.");
}

updateFile();
