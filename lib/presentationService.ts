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

export interface TimelineSlide {
  id: string;
  image: string;
  phrase: string;
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
 */
const compressImage = async (base64Image: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Image;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      // Reduce dimensions to 50% to save space
      canvas.width = img.width * 0.5;
      canvas.height = img.height * 0.5;
      
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convert to JPEG with lower quality
      const compressed = canvas.toDataURL("image/jpeg", 0.6);
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

    // Compress images to reduce file size
    const compressedSlides = await Promise.all(
      slides.map(async (slide) => ({
        ...slide,
        image: slide.image ? await compressImage(slide.image) : "",
      }))
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
