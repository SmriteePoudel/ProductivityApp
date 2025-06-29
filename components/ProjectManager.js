"use client";

import { useState, useEffect, useRef } from "react";

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("overview"); // overview, documents, tasks
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
    icon: "📁",
    status: "active",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputCreateRef = useRef(null);

  const colorOptions = [
    "#3b82f6",
    "#ec4899",
    "#a855f7",
    "#10b981",
    "#f59e42",
    "#fbbf24",
    "#ef4444",
    "#6366f1",
    "#14b8a6",
    "#8b5cf6",
  ];

  const iconOptions = [
    "📁",
    "📝",
    "💼",
    "🎯",
    "⭐",
    "💡",
    "🎨",
    "🏠",
    "🚗",
    "🍕",
    "☕",
    "💻",
    "📱",
    "🎵",
    "🎬",
    "🏃‍♀️",
    "🧘‍♀️",
    "📖",
    "✏️",
    "🎓",
  ];

  const statusOptions = [
    { value: "active", label: "Active", color: "text-green-600" },
    { value: "completed", label: "Completed", color: "text-blue-600" },
    { value: "on-hold", label: "On Hold", color: "text-yellow-600" },
    { value: "cancelled", label: "Cancelled", color: "text-red-600" },
  ];

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/projects", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      } else {
        console.error("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection for create form
  const handleCreateFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  // Create or update project
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      let response;
      if (selectedFiles.length > 0 && !editingProject) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("color", form.color);
        formData.append("icon", form.icon);
        formData.append("status", form.status);
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });
        response = await fetch("/api/projects", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
      } else {
        // JSON for normal update or no files
        const url = editingProject
          ? `/api/projects/${editingProject._id}`
          : "/api/projects";
        const method = editingProject ? "PUT" : "POST";
        response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
          credentials: "include",
        });
      }

      if (response.ok) {
        await fetchProjects();
        resetForm();
        setShowCreateForm(false);
        setEditingProject(null);
        setSelectedFiles([]);
      } else {
        console.error("Failed to save project");
      }
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  // Delete project
  const handleDelete = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchProjects();
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Edit project
  const handleEdit = (project) => {
    setEditingProject(project);
    setForm({
      name: project.name,
      description: project.description || "",
      color: project.color,
      icon: project.icon,
      status: project.status,
    });
    setShowCreateForm(true);
  };

  // View project details
  const handleView = async (projectId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setViewingProject(data.project);
        setActiveTab("overview");
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0 || !viewingProject) return;

    setUploadingFiles(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("projectId", viewingProject._id);
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/projects/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setViewingProject(data.project);
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 1000);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to upload files");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files");
    } finally {
      setUploadingFiles(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Delete file
  const handleDeleteFile = async (fileName) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const response = await fetch(
        `/api/projects/files/${viewingProject._id}/${fileName}`,
        { method: "DELETE", credentials: "include" }
      );

      if (response.ok) {
        const data = await response.json();
        setViewingProject(data.project);
      } else {
        alert("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file");
    }
  };

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("excel") || fileType.includes("spreadsheet"))
      return "📊";
    if (fileType.includes("word") || fileType.includes("document")) return "📝";
    if (fileType.includes("image")) return "🖼️";
    if (fileType.includes("zip") || fileType.includes("rar")) return "📦";
    return "📎";
  };

  // Get file category
  const getFileCategory = (fileType) => {
    if (fileType.includes("pdf")) return "PDF Documents";
    if (fileType.includes("excel") || fileType.includes("spreadsheet"))
      return "Excel Files";
    if (fileType.includes("word") || fileType.includes("document"))
      return "Word Documents";
    if (fileType.includes("image")) return "Images";
    if (fileType.includes("zip") || fileType.includes("rar")) return "Archives";
    return "Other Files";
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Group files by category
  const groupFilesByCategory = (files) => {
    const grouped = {};
    files.forEach((file) => {
      const category = getFileCategory(file.type);
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(file);
    });
    return grouped;
  };

  // Reset form
  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      color: "#3b82f6",
      icon: "📁",
      status: "active",
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find((s) => s.value === status);
    return statusOption ? statusOption.color : "text-gray-600";
  };

  // Get status label
  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find((s) => s.value === status);
    return statusOption ? statusOption.label : status;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 border border-accent">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-accent flex items-center gap-2">
          📁 Project Management
        </h2>
        <button
          onClick={() => {
            resetForm();
            setShowCreateForm(true);
            setEditingProject(null);
          }}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-all font-semibold"
        >
          + Create New Project
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="mb-8 p-6 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-accent">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingProject ? "Edit Project" : "Create New Project"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-accent rounded-lg focus:ring-2 ring-accent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-accent rounded-lg focus:ring-2 ring-accent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-accent rounded-lg focus:ring-2 ring-accent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe your project (optional)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        form.color === color
                          ? "border-accent scale-110"
                          : "border-gray-200 dark:border-gray-700 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setForm((prev) => ({ ...prev, color }))}
                      aria-label={`Color ${color}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  Icon
                  <div className="flex gap-2 flex-wrap max-w-xs items-center">
                    <button
                      type="button"
                      className="mr-2 p-3 rounded-full bg-accent/10 hover:bg-accent/20 text-accent border-2 border-accent focus:outline-none text-2xl"
                      onClick={() => fileInputCreateRef.current?.click()}
                      title="Attach Documents"
                      style={{ minWidth: 48, minHeight: 48 }}
                    >
                      📄
                    </button>
                    <input
                      ref={fileInputCreateRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                      onChange={handleCreateFileChange}
                      className="hidden"
                    />
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`w-8 h-8 rounded-lg border-2 text-lg transition-all ${
                          form.icon === icon
                            ? "border-accent bg-accent/10"
                            : "border-gray-200 dark:border-gray-700 hover:border-accent"
                        }`}
                        onClick={() => setForm((prev) => ({ ...prev, icon }))}
                        aria-label={`Icon ${icon}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </label>
                {selectedFiles.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <strong>Selected files:</strong>
                    <ul className="list-disc ml-5">
                      {selectedFiles.map((file, idx) => (
                        <li key={idx}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-all font-semibold"
              >
                {editingProject ? "Update Project" : "Create Project"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingProject(null);
                  resetForm();
                  setSelectedFiles([]);
                }}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:opacity-90 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl border border-accent overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Loading projects...
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center">
            <span className="text-4xl mb-4 block">📁</span>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No projects yet. Create your first project to get started!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/20">
                {projects.map((project) => (
                  <tr
                    key={project._id}
                    className="hover:bg-accent/5 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className="text-2xl mr-3"
                          style={{ color: project.color }}
                        >
                          {project.icon}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {project.name}
                          </div>
                          {project.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {project.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          project.status
                        )} bg-accent/10`}
                      >
                        {getStatusLabel(project.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📄</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {project.files ? project.files.length : 0} docs
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(project.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(project.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleView(project._id)}
                          className="text-accent hover:text-accent/80 transition-colors"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleEdit(project)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit Project"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete Project"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {viewingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <span
                  className="text-3xl"
                  style={{ color: viewingProject.color }}
                >
                  {viewingProject.icon}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {viewingProject.name}
                  </h3>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      viewingProject.status
                    )} bg-accent/10`}
                  >
                    {getStatusLabel(viewingProject.status)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewingProject(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "overview"
                    ? "border-accent text-accent"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                📋 Overview
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "documents"
                    ? "border-accent text-accent"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                📄 Documents (
                {viewingProject.files ? viewingProject.files.length : 0})
              </button>
              <button
                onClick={() => setActiveTab("tasks")}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "tasks"
                    ? "border-accent text-accent"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                ✅ Tasks
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div>
                {viewingProject.description && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </h4>
                    <p className="text-gray-900 dark:text-white">
                      {viewingProject.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Created:
                    </span>
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(viewingProject.createdAt)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Updated:
                    </span>
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(viewingProject.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div>
                {/* Document Upload Section */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    📄 Upload Documents
                  </h4>
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.xlsx,.xls,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingFiles}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-semibold disabled:opacity-50"
                    >
                      {uploadingFiles ? "Uploading..." : "📁 Choose Documents"}
                    </button>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      PDF, Excel, Word, Images (max 10MB each)
                    </span>
                  </div>
                  {uploadProgress > 0 && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Documents Section */}
                {viewingProject.files && viewingProject.files.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      📚 Document Library ({viewingProject.files.length} files)
                    </h4>
                    {Object.entries(
                      groupFilesByCategory(viewingProject.files)
                    ).map(([category, files]) => (
                      <div key={category} className="mb-6">
                        <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                          {category}
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <span className="text-xl flex-shrink-0">
                                  {getFileIcon(file.type)}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <a
                                    href={file.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-accent hover:underline truncate block"
                                    title={file.name}
                                  >
                                    {file.name}
                                  </a>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatFileSize(file.size)} •{" "}
                                    {formatDate(file.uploadedAt)}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteFile(file.fileName)}
                                className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0 ml-2"
                                title="Delete document"
                              >
                                🗑️
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-4xl mb-4 block">📄</span>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      No documents uploaded yet.
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Upload PDF, Excel, Word documents, or images to get
                      started.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "tasks" && (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">✅</span>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Task management coming soon!
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  You'll be able to create and manage tasks for this project.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
