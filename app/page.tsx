"use client";

import { useState } from "react";
import { Heart, Plus, Trash2, Download, Share2, Play } from "lucide-react";
import TimelineEditor from "@/components/TimelineEditor";
import TimelinePresentation from "@/components/TimelinePresentation";
import PresentationsList from "@/components/PresentationsList";
import { savePresentation } from "@/lib/presentationService";
import type { Presentation } from "@/lib/presentationService";

interface QuizAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Quiz {
  question: string;
  answers: QuizAnswer[];
  correctMessage?: string;
}

interface TimelineSlide {
  id: string;
  image: string;
  phrase: string;
  quiz?: Quiz;
}

export default function Home() {
  const [slides, setSlides] = useState<TimelineSlide[]>([]);
  const [isPresenting, setIsPresenting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSavedPresentations, setShowSavedPresentations] = useState(false);

  const addSlide = () => {
    const newSlide: TimelineSlide = {
      id: Date.now().toString(),
      image: "",
      phrase: "",
    };
    setSlides([...slides, newSlide]);
  };

  const updateSlide = (id: string, updates: Partial<TimelineSlide>) => {
    setSlides(
      slides.map((slide) =>
        slide.id === id ? { ...slide, ...updates } : slide
      )
    );
  };

  const deleteSlide = (id: string) => {
    setSlides(slides.filter((slide) => slide.id !== id));
    if (currentSlide >= slides.length - 1 && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleDownload = async () => {
    if (slides.length === 0) {
      alert("Add at least one slide before downloading");
      return;
    }

    try {
      const html2canvas = (await import("html2canvas")).default;
      const element = document.getElementById("timeline-presentation");
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: "#fef3f2",
        scale: 2,
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `anniversary-timeline-slide-${currentSlide + 1}.png`;
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  const handleShare = async () => {
    if (slides.length === 0) {
      alert("Add at least one slide before sharing");
      return;
    }

    const text = `Check out our anniversary timeline! ${slides[currentSlide]?.phrase || ""}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Our Anniversary Timeline",
          text: text,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      alert("Share not supported on this device");
    }
  };

  const handleSavePresentation = async () => {
    if (slides.length === 0) {
      alert("Add at least one slide before saving");
      return;
    }

    try {
      const title = prompt("Enter a name for your presentation:", "My Anniversary Timeline");
      if (!title) return;

      await savePresentation(title, slides);
      alert("Presentation saved successfully to Firebase!");
    } catch (error: any) {
      console.error("Error saving presentation:", error);
      const errorMessage = error?.message || "Unknown error occurred";
      alert(`Error saving presentation: ${errorMessage}`);
    }
  };

  const handleLoadPresentation = (presentation: Presentation) => {
    setSlides(presentation.slides);
    setCurrentSlide(0);
    setShowSavedPresentations(false);
    alert(`Loaded presentation: ${presentation.title}`);
  };

  if (isPresenting && slides.length > 0) {
    return (
      <TimelinePresentation
        slides={slides}
        currentSlide={currentSlide}
        onSlideChange={setCurrentSlide}
        onExit={() => setIsPresenting(false)}
      />
    );
  }

  return (
    <main className="min-h-screen pb-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-rose-900/30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <h1 className="text-xl font-bold text-white">Timeline</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSavedPresentations(!showSavedPresentations)}
              className="px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all active:scale-95"
            >
              {showSavedPresentations ? "Hide" : "View"} Saved
            </button>
            <button
              onClick={() => {
                if (slides.length > 0) {
                  setCurrentSlide(0);
                  setIsPresenting(true);
                } else {
                  alert("Add at least one slide first");
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all active:scale-95"
            >
              <Play className="w-4 h-4 inline mr-1" />
              Present
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Slides Counter */}
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-rose-900/30">
          <p className="text-sm font-semibold text-gray-200">
            Slides: <span className="text-rose-400">{slides.length}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-8 sm:grid-cols-5">
          <button
            onClick={addSlide}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Slide</span>
            <span className="sm:hidden">Add</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={slides.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Download</span>
            <span className="sm:hidden">Save</span>
          </button>

          <button
            onClick={handleSavePresentation}
            disabled={slides.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Save All</span>
            <span className="sm:hidden">Save</span>
          </button>

          <button
            onClick={handleShare}
            disabled={slides.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Share2 className="w-5 h-5" />
            <span className="hidden sm:inline">Share</span>
            <span className="sm:hidden">Share</span>
          </button>

          <button
            onClick={() => setSlides([])}
            disabled={slides.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-5 h-5" />
            <span className="hidden sm:inline">Clear All</span>
            <span className="sm:hidden">Clear</span>
          </button>
        </div>

        {/* Saved Presentations List */}
        {showSavedPresentations && (
          <div className="mb-8">
            <PresentationsList onLoadPresentation={handleLoadPresentation} />
          </div>
        )}

        {/* Timeline Editor */}
        <TimelineEditor
          slides={slides}
          onUpdateSlide={updateSlide}
          onDeleteSlide={deleteSlide}
        />
      </div>
    </main>
  );
}
