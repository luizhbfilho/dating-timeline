"use client";

import { useState, useEffect } from "react";
import { Trash2, Play, Download } from "lucide-react";
import { getAllPresentations, deletePresentation } from "@/lib/presentationService";
import type { Presentation } from "@/lib/presentationService";

interface PresentationsListProps {
  onLoadPresentation: (presentation: Presentation) => void;
}

export default function PresentationsList({
  onLoadPresentation,
}: PresentationsListProps) {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPresentations();
  }, []);

  const loadPresentations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPresentations();
      setPresentations(data);
    } catch (err: any) {
      console.error("Error loading presentations:", err);
      setError("Failed to load presentations");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;

    if (!confirm("Are you sure you want to delete this presentation?")) {
      return;
    }

    try {
      await deletePresentation(id);
      setPresentations(presentations.filter((p) => p.id !== id));
      alert("Presentation deleted successfully");
    } catch (err) {
      console.error("Error deleting presentation:", err);
      alert("Failed to delete presentation");
    }
  };

  const handleDownload = (presentation: Presentation) => {
    const data = JSON.stringify(presentation, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${presentation.title}-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (date: any) => {
    if (!date) return "Unknown";
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-rose-200">
        <p className="text-gray-600 text-center">Loading presentations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
        <p className="text-red-600 text-center">{error}</p>
        <button
          onClick={loadPresentations}
          className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (presentations.length === 0) {
    return (
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg shadow-md p-6 border border-rose-200">
        <p className="text-gray-600 text-center">
          No saved presentations yet. Create and save one to see it here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Saved Presentations</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {presentations.map((presentation) => (
          <div
            key={presentation.id}
            className="bg-white rounded-lg shadow-md border border-rose-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Preview Image */}
            <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
              {presentation.slides && presentation.slides[0]?.image ? (
                <img
                  src={presentation.slides[0].image}
                  alt={presentation.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <p className="text-sm">No image</p>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-gray-800 truncate mb-1">
                {presentation.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {presentation.slides?.length || 0} slides
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {formatDate(presentation.createdAt)}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => onLoadPresentation(presentation)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95 text-sm"
                  title="Load presentation"
                >
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline">Load</span>
                </button>

                <button
                  onClick={() => handleDownload(presentation)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all active:scale-95"
                  title="Download as JSON"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(presentation.id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all active:scale-95"
                  title="Delete presentation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
