"use client";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { getDb } from "./firebase";

export interface QuizAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Quiz {
  question: string;
  answers: QuizAnswer[];
  correctMessage?: string;
}

export interface TimelineSlide {
  id: string;
  image: string;
  phrase: string;
  quiz?: Quiz;
}

export interface Presentation {
  id?: string;
  title: string;
  slides: TimelineSlide[];
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  userId?: string;
}

const PRESENTATIONS_COLLECTION = "presentations";

/**
 * Compress image to reduce file size
 * Optimized for web: reduces dimensions and quality for faster loading
 */
const compressImage = async (base64Image: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Image;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      // Calculate optimal dimensions (max 1920px width for web)
      let width = img.width;
      let height = img.height;
      const maxWidth = 1920;
      const maxHeight = 1080;
      
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (width > maxWidth) {
          width = maxWidth;
          height = Math.round(width / aspectRatio);
        }
        if (height > maxHeight) {
          height = maxHeight;
          width = Math.round(height * aspectRatio);
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convert to JPEG with optimized quality (0.5 for smaller size, 0.7 for better quality)
      const compressed = canvas.toDataURL("image/jpeg", 0.65);
      resolve(compressed);
    };
    img.onerror = () => {
      // If compression fails, return original
      resolve(base64Image);
    };
  });
};

/**
 * Save a new presentation to Firebase
 */
export const savePresentation = async (
  title: string,
  slides: TimelineSlide[]
): Promise<string> => {
  try {
    const database = getDb();
    if (!database) {
      throw new Error("Firebase is not initialized. Please check your .env.local file.");
    }

    // Compress images and serialize quiz data to reduce file size
    const compressedSlides = await Promise.all(
      slides.map(async (slide) => {
        const serializedSlide: any = {
          id: slide.id,
          phrase: slide.phrase || "",
          image: slide.image ? await compressImage(slide.image) : "",
        };

        // Serialize quiz data if present
        if (slide.quiz) {
          serializedSlide.quiz = {
            question: slide.quiz.question || "",
            correctMessage: slide.quiz.correctMessage || "✓ Correct!",
            answers: (slide.quiz.answers || []).map((answer: QuizAnswer) => ({
              id: answer.id || "",
              text: answer.text || "",
              isCorrect: answer.isCorrect === true,
            })),
          };
        }

        return serializedSlide;
      })
    );

    const now = new Date();
    const presentation: Presentation = {
      title,
      slides: compressedSlides,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(
      collection(database, PRESENTATIONS_COLLECTION),
      presentation
    );
    console.log("Presentation saved successfully:", docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error("Error saving presentation:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    throw new Error(error.message || "Failed to save presentation");
  }
};

/**
 * Get all presentations
 */
export const getAllPresentations = async (): Promise<Presentation[]> => {
  try {
    const database = getDb();
    const querySnapshot = await getDocs(
      collection(database, PRESENTATIONS_COLLECTION)
    );
    const presentations: Presentation[] = [];

    querySnapshot.forEach((doc) => {
      presentations.push({
        id: doc.id,
        ...doc.data(),
      } as Presentation);
    });

    return presentations;
  } catch (error) {
    console.error("Error getting presentations:", error);
    throw error;
  }
};

/**
 * Get a specific presentation by ID
 */
export const getPresentationById = async (
  id: string
): Promise<Presentation | null> => {
  try {
    const database = getDb();
    const docSnap = await getDocs(collection(database, PRESENTATIONS_COLLECTION));

    for (const document of docSnap.docs) {
      if (document.id === id) {
        return {
          id: document.id,
          ...document.data(),
        } as Presentation;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting presentation:", error);
    throw error;
  }
};

/**
 * Update a presentation
 */
export const updatePresentation = async (
  id: string,
  title: string,
  slides: TimelineSlide[]
): Promise<void> => {
  try {
    const database = getDb();
    const docRef = doc(database, PRESENTATIONS_COLLECTION, id);
    await updateDoc(docRef, {
      title,
      slides,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating presentation:", error);
    throw error;
  }
};

/**
 * Delete a presentation
 */
export const deletePresentation = async (id: string): Promise<void> => {
  try {
    const database = getDb();
    const docRef = doc(database, PRESENTATIONS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting presentation:", error);
    throw error;
  }
};
