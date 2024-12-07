import React, { useState, useEffect } from "react";
import { createCategory, getCategoriesByModel } from "@/api";

const EmotionCategoryManager = ({ selectedModelId }) => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await getCategoriesByModel(selectedModelId);
      console.log("Fetched categories:", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty!");
      return;
    }

    try {
      await createCategory(selectedModelId, newCategoryName);
      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [selectedModelId]);

  return (
    <div>
      <h2>Manage Emotion Categories</h2>
      <input
        type="text"
        placeholder="Enter category name"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
      />
      <button onClick={handleAddCategory}>Add Category</button>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.emotion}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmotionCategoryManager;
