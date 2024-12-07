import React, { useState, useEffect } from "react";
import { getAllModels, createModel, deleteModel } from "@/api";

const ModelManagement = () => {
  const [models, setModels] = useState([]);
  const [newModelName, setNewModelName] = useState("");

  // Fetch models from the backend
  const fetchModels = async () => {
    try {
      const response = await getAllModels();
      setModels(response.data);
    } catch (error) {
      console.error("Error fetching models:", error);
      alert("Failed to fetch models.");
    }
  };

  // Handle model creation
  const handleAddModel = async () => {
    if (!newModelName.trim()) {
      alert("Model name cannot be empty!");
      return;
    }
    try {
      await createModel(newModelName);
      setNewModelName("");
      fetchModels(); // Refresh the list of models
    } catch (error) {
      console.error("Error creating model:", error);
      alert(error.response?.data?.message || "Failed to create model");
    }
  };

  // Handle model deletion
  const handleDeleteModel = async (id) => {
    if (!window.confirm("Are you sure you want to delete this model?")) return;
    try {
      await deleteModel(id);
      fetchModels(); // Refresh the list of models
    } catch (error) {
      console.error("Error deleting model:", error);
      alert("Failed to delete model");
    }
  };

  // Fetch models on component mount
  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <div>
      <h1>Manage Models</h1>
      <div>
        <input
          type="text"
          placeholder="Enter model name"
          value={newModelName}
          onChange={(e) => setNewModelName(e.target.value)}
        />
        <button onClick={handleAddModel}>Add Model</button>
      </div>

      <h2>Model List</h2>
      {models.length > 0 ? (
        <ul>
          {models.map((model) => (
            <li key={model.id}>
              <strong>{model.name}</strong>
              <button onClick={() => handleDeleteModel(model.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No models available.</p>
      )}
    </div>
  );
};

export default ModelManagement;
