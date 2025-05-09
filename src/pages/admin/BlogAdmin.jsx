import React, { useState, useEffect } from "react";
import { api } from "../../lib/api";
import BlogForm from "../../components/BlogForm";

export default function BlogAdmin() {
  const initialBlog = {
    title: "",
    content: "",
    author: "",
    category: "",
    image: "",
    date: {
      day: new Date().getDate().toString(),
      month: new Date().toLocaleString("default", { month: "short" }),
      year: new Date().getFullYear().toString(),
    },
  };

  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState(initialBlog);
  const [editingBlog, setEditingBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/blogs")
      .then((response) => setBlogs(response.data))
      .catch((error) => console.error("Error fetching blogs:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Only include allowed fields for update
    const blogData = {
      title: newBlog.title,
      content: newBlog.content,
      author: newBlog.author,
    };

    const apiCall = editingBlog?._id
      ? api.put(`/blogs/${editingBlog._id}`, blogData)
      : api.post("/blogs", newBlog);

    apiCall
      .then(() => {
        setNewBlog(initialBlog);
        setEditingBlog(null);
        return api.get("/blogs");
      })
      .then((response) => setBlogs(response.data))
      .catch((error) => {
        console.error("Error saving blog:", error);
        alert(
          "Error saving blog: " + error.response?.data?.error || error.message
        );
      });
  };

  const handleInputChange = (field, value) => {
    setNewBlog((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setNewBlog({ ...blog });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      api
        .delete(`/blogs/${id}`)
        .then(() => {
          alert("Blog deleted successfully!");
          return api.get("/blogs");
        })
        .then((response) => setBlogs(response.data))
        .catch((error) => alert("Error deleting blog: " + error.message));
    }
  };

  const handleCancel = () => {
    setEditingBlog(null);
    setNewBlog(initialBlog);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        {editingBlog ? "Edit Blog" : "Create New Blog"}
      </h1>
      <BlogForm
        newBlog={newBlog}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
      />
      {editingBlog && (
        <div className="text-center mt-4">
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel Editing
          </button>
        </div>
      )}

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Manage Blogs</h2>
        <div className="grid gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">{blog.title}</h3>
              <p className="text-gray-600">{blog.content}</p>
              <div className="text-sm text-gray-500">
                By {blog.author} | {blog.category}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(blog)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
