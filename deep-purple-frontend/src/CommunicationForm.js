import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"

const CommunicationForm = ({ setResponse, setAllCommunications, setDeleteNotification, clearNotification, clearResponse }) => {
    const [content, setContent] = useState('');
    const [operation, setOperation] = useState('');
    const [id, setId] = useState('');
    const [modelName, setModelName] = useState('');
    const [classificationType, setClassificationType] = useState('');
    const [fetchedData, setFetchedData] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearNotification();
        clearResponse();
        setFetchedData(null);
        setAllCommunications([]);

        try {
            let res;
            const dataToSend = { content, modelName, classificationType };

            if (operation === 'save') {
                res = await axios.post('http://localhost:8080/api/communications', dataToSend);
            } else if (operation === 'update') {
                res = await axios.put(`http://localhost:8080/api/communications/${id}`, dataToSend);
            } else if (operation === 'delete') {
                await axios.delete(`http://localhost:8080/api/communications/${id}`);
                setDeleteNotification(`Communication with ID ${id} has been deleted.`);
                setContent('');
                setId('');
                return;
            } else if (operation === 'get') {
                res = await axios.get(`http://localhost:8080/api/communications/${id}`);
                if (res.data) setFetchedData(res.data);
                return;
            }

            setResponse(res.data);
            if (operation === 'save' || operation === 'update') {
                setContent('');
                setId('');
            }
        } catch (error) {
            setResponse({ error: error.message });
        }
    };

    const handleGetAll = async () => {
        clearNotification();
        clearResponse();
        try {
            const res = await axios.get('http://localhost:8080/api/communications');
            setAllCommunications(res.data);
        } catch (error) {
            setResponse({ error: error.message });
        }
    };

    return (
        <Card className="p-4">
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {operation !== 'get' && operation !== 'delete' && (
                        <div>
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Enter communication content"
                                required={operation === 'save' || operation === 'update'}
                                maxLength={1000}
                            />
                        </div>
                    )}
                    
                    <div>
                        <Label htmlFor="operation">Operation</Label>
                        <Select
                            id="operation"
                            value={operation}
                            onValueChange={setOperation}
                        >
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="select operation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="save">Save</SelectItem>
                                <SelectItem value="update">Update</SelectItem>
                                <SelectItem value="delete">Delete</SelectItem>
                                <SelectItem value="get">Get by ID</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                        </Select>

                    </div>
                    <div>
                        <Label htmlFor="modelName">Model Name</Label>
                        <Select
                            id="modelName"
                            value={modelName}
                            onValueChange={setModelName}
                        >
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="select model" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="gpt-4o-mini">GPT-4o-Mini</SelectItem>
                                <SelectItem value="gpt-4">GPT-4</SelectItem>
                                <SelectItem value="gpt-3">GPT-3</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="classificationType">Classification Type</Label>
                        <Select
                            id="classificationType"
                            value={classificationType}
                            onValueChange={setClassificationType}
                        >
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="select classification" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="positive">Positive</SelectItem>
                                <SelectItem value="negative">Negative</SelectItem>
                                <SelectItem value="neutral">Neutral</SelectItem>
                            </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    {operation !== 'save' && (
                        <div>
                            <Label htmlFor="id">ID</Label>
                            <Input
                                id="id"
                                type="number"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                placeholder="Enter communication ID"
                                required={operation !== 'delete'}
                                className = "w-[300px]"
                            />
                        </div>
                    )}
                                    <Separator className="w-[300px] my-4" />
                    <Button type="submit" className="w-[300px]">
                        Submit
                    </Button>
                </form>

                <Button onClick={handleGetAll} className="w-[300px] mt-4">
                    Get All Communications
                </Button>
                <Separator className="my-4" />

                {fetchedData && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold">Fetched Communication</h3>
                        <p><strong>ID:</strong> {fetchedData.id || 'N/A'}</p>
                        <p><strong>Content:</strong> {fetchedData.content || 'N/A'}</p>
                        <p><strong>Primary Emotion:</strong> {fetchedData.primaryEmotion?.emotion} ({fetchedData.primaryEmotion?.percentage}%)</p>
                        <p><strong>Secondary Emotions:</strong></p>
                        {fetchedData.secondaryEmotions?.length > 0 ? (
                            <ul>
                                {fetchedData.secondaryEmotions.map((secEmotion, index) => (
                                    <li key={index}>
                                        {secEmotion.emotion} ({secEmotion.percentage}%)
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No secondary emotions available</p>
                        )}
                        <p><strong>Classification:</strong> {fetchedData.classificationType}</p>
                        <p><strong>Confidence Rating:</strong> {fetchedData.confidenceRating}</p>
                        <p><strong>Summary:</strong> {fetchedData.summary || 'N/A'}</p>
                        <p><strong>Timestamp:</strong> {fetchedData.timestamp ? new Date(fetchedData.timestamp).toLocaleString() : 'N/A'}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CommunicationForm;
