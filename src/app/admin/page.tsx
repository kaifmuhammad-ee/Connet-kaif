"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, RefreshCw, X, Calendar, MapPin, Mail, Phone, Tag, Trash2 } from "lucide-react";

interface Enquiry {
  id: string;
  category: string;
  name: string;
  email: string;
  phone: string;
  place: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [enquiryIdToDelete, setEnquiryIdToDelete] = useState<string | null>(null);

  const router = useRouter();

  const fetchEnquiries = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/enquiries");
      const data = await response.json();
      if (response.ok && data.success) {
        setEnquiries(data.enquiries);
      } else {
        setError(data.error || "Failed to load enquiries.");
        if (response.status === 401) {
          router.push("/admin/login");
        }
      }
    } catch {
      setError("Network error. Failed to retrieve enquiries.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Filter and Sort enquiries
  useEffect(() => {
    let result = [...enquiries];

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((e) => e.category === selectedCategory);
    }

    // Filter by status
    if (selectedStatus !== "All") {
      result = result.filter((e) => e.status === selectedStatus);
    }

    // Sort
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }

    setFilteredEnquiries(result);
  }, [enquiries, selectedCategory, selectedStatus, sortBy]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Update local state
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
        // If current modal is showing this enquiry, update its state too
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      } else {
        alert(data.error || "Failed to update status.");
      }
    } catch {
      alert("Network error. Could not update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setEnquiryIdToDelete(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!enquiryIdToDelete) return;
    setDeletingId(enquiryIdToDelete);
    setShowConfirmModal(false);
    
    try {
      const response = await fetch(`/api/admin/enquiries/${enquiryIdToDelete}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Update local state
        setEnquiries((prev) => prev.filter((e) => e.id !== enquiryIdToDelete));
        // Close detail drawer if the deleted enquiry is currently open
        if (selectedEnquiry && selectedEnquiry.id === enquiryIdToDelete) {
          setSelectedEnquiry(null);
        }
      } else {
        alert(data.error || "Failed to delete enquiry.");
      }
    } catch {
      alert("Network error. Could not delete enquiry.");
    } finally {
      setDeletingId(null);
      setEnquiryIdToDelete(null);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch {
      alert("Failed to logout.");
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-black text-[#F5F0E6] border border-black";
      case "Replied":
        return "bg-[#F5F0E6] text-black border border-black/30";
      case "Closed":
        return "bg-black/10 text-black/60 border border-transparent";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-black font-sans selection:bg-black selection:text-[#F5F0E6] p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-black pb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] opacity-60">Admin Portal</span>
            <h1 className="font-heading font-light text-4xl tracking-wide mt-1 uppercase">Enquiries Hub</h1>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={fetchEnquiries}
              disabled={isLoading}
              className="border border-black p-3 hover:bg-black hover:text-[#F5F0E6] transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={handleLogout}
              className="bg-black text-[#F5F0E6] border border-black px-5 py-3 text-xs uppercase tracking-[0.2em] font-semibold flex items-center gap-2 hover:bg-[#F5F0E6] hover:text-black transition-colors w-full sm:w-auto justify-center"
            >
              Logout <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-black/5 p-6 border border-black/10">
          
          {/* Categories Tab selector */}
          <div className="space-y-2 w-full lg:w-auto">
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/50 block">Filter By Category</span>
            <div className="flex flex-wrap gap-2">
              {["All", "ZeeSip", "Zee Chai", "Eallisto", "Le Weekend", "Kinford School", "General"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider transition-all rounded-none ${
                    selectedCategory === cat
                      ? "bg-black text-[#F5F0E6]"
                      : "border border-black/20 hover:border-black"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 w-full lg:w-auto items-end">
            {/* Status Filter */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-black/50 block">Status</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent border border-black/20 focus:border-black px-3 py-2 text-xs uppercase tracking-wider outline-none rounded-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Replied">Replied</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Date Sorting */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-black/50 block">Sort By Date</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border border-black/20 focus:border-black px-3 py-2 text-xs uppercase tracking-wider outline-none rounded-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {error && (
          <div className="p-4 border border-red-500 text-red-500 text-sm bg-red-500/5">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="py-24 text-center text-sm uppercase tracking-widest opacity-60">
            Loading enquiries...
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="py-24 text-center border border-black/10 border-dashed bg-black/5">
            <span className="text-sm uppercase tracking-widest opacity-60">No enquiries found</span>
          </div>
        ) : (
          <div className="overflow-x-auto border border-black">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-black text-[#F5F0E6] text-xs uppercase tracking-[0.2em] border-b border-black">
                  <th className="py-4 px-6 font-semibold">Category</th>
                  <th className="py-4 px-6 font-semibold">Sender</th>
                  <th className="py-4 px-6 font-semibold">Location</th>
                  <th className="py-4 px-6 font-semibold">Message Preview</th>
                  <th className="py-4 px-6 font-semibold">Date</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {filteredEnquiries.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    onClick={() => setSelectedEnquiry(enquiry)}
                    className="hover:bg-black/[0.02] cursor-pointer transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <span className="font-heading text-xs font-bold border border-black/20 px-2.5 py-1 bg-black/5 uppercase">
                        {enquiry.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-semibold">{enquiry.name}</div>
                      <div className="text-xs text-black/50">{enquiry.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-black/80">{enquiry.place}</span>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <p className="text-sm truncate text-black/70 group-hover:text-black transition-colors">
                        {enquiry.message}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs text-black/60 font-light">
                        {formatDate(enquiry.created_at)}
                      </span>
                    </td>
                    <td 
                      className="py-4 px-6"
                      onClick={(e) => e.stopPropagation()} // Prevent modal trigger on dropdown click
                    >
                      <select
                        value={enquiry.status}
                        onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                        disabled={updatingId === enquiry.id}
                        className={`text-xs uppercase tracking-wider font-semibold px-3 py-1.5 outline-none cursor-pointer rounded-none ${getStatusColor(enquiry.status)}`}
                      >
                        <option value="New">New</option>
                        <option value="Replied">Replied</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td 
                      className="py-4 px-6 text-right"
                      onClick={(e) => e.stopPropagation()} // Prevent modal trigger on click
                    >
                      <button
                        onClick={() => handleDeleteClick(enquiry.id)}
                        disabled={deletingId === enquiry.id}
                        className="text-black/40 hover:text-red-600 transition-colors p-1.5"
                        title="Delete Enquiry"
                      >
                        <Trash2 size={16} className={deletingId === enquiry.id ? "opacity-35" : ""} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Dynamic Detail Modal / Side Drawer */}
        <AnimatePresence>
          {selectedEnquiry && (
            <div className="fixed inset-0 z-50 flex items-center justify-end">
              
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedEnquiry(null)}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              />

              {/* Drawer Container */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.4 }}
                className="absolute right-0 top-0 bottom-0 w-full sm:w-[600px] bg-[#F5F0E6] border-l border-black p-8 md:p-12 flex flex-col justify-between overflow-y-auto"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex justify-between items-center border-b border-black/10 pb-6 mb-8">
                    <span className="text-xs uppercase tracking-[0.2em] font-semibold bg-black text-[#F5F0E6] px-3 py-1">
                      {selectedEnquiry.category} Enquiry
                    </span>
                    <button
                      onClick={() => setSelectedEnquiry(null)}
                      className="border border-black p-2 hover:bg-black hover:text-[#F5F0E6] transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-8">
                    
                    {/* Header Details */}
                    <div>
                      <h2 className="font-heading font-light text-3xl tracking-wide mb-2">
                        {selectedEnquiry.name}
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-black/60 font-light">
                        <Calendar size={12} />
                        <span>Submitted {formatDate(selectedEnquiry.created_at)}</span>
                      </div>
                    </div>

                    {/* Meta Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-black/10 p-6 bg-black/5">
                      <div className="flex items-center gap-3">
                        <Mail size={16} className="text-black/50 shrink-0" />
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-black/40 block">Email</span>
                          <a href={`mailto:${selectedEnquiry.email}`} className="text-sm font-semibold hover:underline">
                            {selectedEnquiry.email}
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-black/50 shrink-0" />
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-black/40 block">Phone</span>
                          <a href={`tel:${selectedEnquiry.phone}`} className="text-sm font-semibold hover:underline">
                            {selectedEnquiry.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-black/50 shrink-0" />
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-black/40 block">Location</span>
                          <span className="text-sm font-semibold">
                            {selectedEnquiry.place}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Tag size={16} className="text-black/50 shrink-0" />
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-black/40 block">Status</span>
                          <select
                            value={selectedEnquiry.status}
                            onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
                            className={`text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded-none border border-black/20 ${getStatusColor(selectedEnquiry.status)}`}
                          >
                            <option value="New">New</option>
                            <option value="Replied">Replied</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Message Box */}
                    <div className="space-y-3">
                      <span className="text-xs uppercase tracking-[0.2em] font-semibold block text-black/60">
                        Enquiry Message
                      </span>
                      <div className="border border-black p-6 md:p-8 bg-[#F5F0E6] text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans">
                        {selectedEnquiry.message}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer Action */}
                <div className="border-t border-black/10 pt-6 mt-8 flex flex-col sm:flex-row gap-4">
                  <a
                    href={`mailto:${selectedEnquiry.email}?subject=Re: Enquiry regarding ${selectedEnquiry.category}`}
                    className="flex-1 bg-black text-[#F5F0E6] text-center uppercase tracking-wider text-xs py-4 hover:bg-[#F5F0E6] hover:text-black border border-black transition-colors font-semibold flex items-center justify-center"
                  >
                    Reply via Email
                  </a>
                  <button
                    onClick={() => handleDeleteClick(selectedEnquiry.id)}
                    className="flex-1 border border-red-600 text-red-600 text-center uppercase tracking-wider text-xs py-4 hover:bg-red-600 hover:text-white transition-colors font-semibold"
                  >
                    Delete Enquiry
                  </button>
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="flex-1 border border-black text-center uppercase tracking-wider text-xs py-4 hover:bg-black hover:text-[#F5F0E6] transition-colors"
                  >
                    Close Panel
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Custom Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowConfirmModal(false)}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-[#F5F0E6] border border-black p-8 max-w-md w-full space-y-6 shadow-xl"
              >
                <div>
                  <h3 className="font-heading font-light text-2xl tracking-wide uppercase">Confirm Deletion</h3>
                  <p className="text-sm text-black/70 mt-2 leading-relaxed">
                    Are you sure you want to permanently delete this enquiry? This action cannot be undone.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 bg-black text-[#F5F0E6] border border-black py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#F5F0E6] hover:text-black transition-colors"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 border border-black py-3 text-xs uppercase tracking-widest font-semibold hover:bg-black hover:text-[#F5F0E6] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
