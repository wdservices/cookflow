import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { 
  addDoc, 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  Timestamp,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../lib/firebase";
import { useAuth } from "./AuthContext";

export type GroceryItem = {
  id?: string;
  name: string;
  amount: string;
  unit: string;
  category: string;
  checked: boolean;
};

export type ShoppingList = {
  id: string;
  title: string;
  items: GroceryItem[];
  createdAt: any;
  userId: string;
};

type GroceryContextValue = {
  lists: ShoppingList[];
  addList: (title: string, items: GroceryItem[]) => Promise<void>;
  toggleItem: (listId: string, itemIndex: number) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
};

const GroceryContext = createContext<GroceryContextValue | undefined>(undefined);

export const GroceryProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[GroceryContext] Effect triggered. Firebase configured:", isFirebaseConfigured, "User:", user?.uid);
    
    if (!isFirebaseConfigured || !db) {
      console.warn("[GroceryContext] Firebase not configured or db not available");
      setLists([]);
      setLoading(false);
      setError("Firebase not configured");
      return;
    }
    
    if (!user) {
      console.warn("[GroceryContext] No user logged in");
      setLists([]);
      setLoading(false);
      setError("Please log in to view grocery lists");
      return;
    }

    console.log("[GroceryContext] Starting query for user:", user.uid);
    const q = query(
      collection(db, "shopping_lists"),
      where("userId", "==", user.uid)
    );

    const fetchFromServer = async () => {
      try {
        const snapshot = await getDocs(q);
        const initialLists = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as ShoppingList[];
        
        const sorted = [...initialLists].sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0;
          const timeB = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0;
          return timeB - timeA;
        });

        console.log("[GroceryContext] Initial server fetch success:", sorted.length);
        setLists(sorted);
      } catch (err) {
        console.error("[GroceryContext] Server fetch error:", err);
      }
    };

    fetchFromServer();

    // Then set up real-time listener for updates
    console.log("[GroceryContext] Setting up real-time listener for user:", user.uid);
    
    const unsubscribe = onSnapshot(q, {
      next: (snapshot) => {
        const newLists = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as ShoppingList[];
        
        // Sort manually to avoid composite index requirement
        const sortedLists = [...newLists].sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0;
          const timeB = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0;
          return timeB - timeA;
        });

        console.log("[GroceryContext] Real-time update - lists:", sortedLists.length);
        setLists(sortedLists);
        setLoading(false);
        setError(null);
      },
      error: (error) => {
        console.error("[GroceryContext] Error fetching shopping lists:", error);
        const errorMessage = error.message || "";
        
        if (errorMessage.includes("index") || errorMessage.includes("requires an index")) {
          console.warn("[GroceryContext] Index error - showing empty list. Create index at:", errorMessage.match(/https:\/\/[^\s]+/)?.[0]);
          setLists([]);
          setLoading(false);
          return;
        }
        
        setError(error.message);
        setLists([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const addList = async (title: string, items: GroceryItem[]) => {
    console.log("[GroceryContext] addList called. db:", !!db, "user:", user?.uid);
    if (!db || !user) {
      console.warn("[GroceryContext] Firebase not ready or user not logged in");
      throw new Error("Not authenticated or Firebase not ready");
    }
    try {
      console.log("[GroceryContext] Adding new shopping list to Firestore...", { title, itemCount: items.length, userId: user.uid });
      const docRef = await addDoc(collection(db, "shopping_lists"), {
        title,
        items,
        userId: user.uid,
        createdAt: Timestamp.now(),
      });
      console.log("[GroceryContext] Successfully added shopping list with ID:", docRef.id);
    } catch (error) {
      console.error("[GroceryContext] Error adding shopping list:", error);
      throw error;
    }
  };

  const toggleItem = async (listId: string, itemIndex: number) => {
    if (!db) return;
    const list = lists.find(l => l.id === listId);
    if (!list) return;

    const newItems = [...list.items];
    newItems[itemIndex] = {
      ...newItems[itemIndex],
      checked: !newItems[itemIndex].checked
    };

    try {
      await updateDoc(doc(db, "shopping_lists", listId), {
        items: newItems
      });
    } catch (error) {
      console.error("Error toggling item:", error);
    }
  };

  const deleteList = async (listId: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "shopping_lists", listId));
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  const value = useMemo(() => ({ 
    lists, 
    addList, 
    toggleItem, 
    deleteList,
    loading,
    error
  }), [lists, loading, error]);

  return <GroceryContext.Provider value={value}>{children}</GroceryContext.Provider>;
};

export const useGrocery = () => {
  const context = useContext(GroceryContext);
  if (!context) {
    throw new Error("useGrocery must be used within GroceryProvider");
  }
  return context;
};
