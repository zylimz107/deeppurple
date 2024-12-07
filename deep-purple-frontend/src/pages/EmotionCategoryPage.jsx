import React, { useState, useEffect } from "react";
import ModelManagement from '@/components/ModelManagement';
import EmotionCategoryManager from "@/components/EmotionCategoryManager/EmotionCategoryManager";
import { getAllModels } from "@/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const EmotionCategoryPage = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);

  const fetchModels = async () => {
    try {
      const response = await getAllModels();
      console.log("Fetched models:", response.data);
      setModels(response.data);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <div>
      <h1>Emotion Manager</h1>
      <div>
        <h2>Create a Model</h2>
      <ModelManagement />
      </div>
      <div>
  <h2>Select a Model</h2>
  <Select
    value={selectedModel?.id || ''}
    onValueChange={(modelId) => {
      const model = models.find((model) => model.id === modelId);
      setSelectedModel(model);
    }}
  >
    <SelectTrigger className="w-[200px]">
      <SelectValue placeholder="Choose a model" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {/* Remove the value="" for placeholder */}
        <SelectItem value="placeholder" disabled>Select a model</SelectItem> 
        {models.length > 0 ? (
          models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="loading" disabled>Loading models...</SelectItem> 
        )}
      </SelectGroup>
    </SelectContent>
  </Select>
</div>



      {selectedModel && (
        <EmotionCategoryManager selectedModelId={selectedModel.id} />
      )}
    </div>
  );
};

export default EmotionCategoryPage;
