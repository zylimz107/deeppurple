import React, { useState } from 'react';
import axios from 'axios';

const CommunicationForm = ({ setResponse, setAllCommunications, setDeleteNotification, clearNotification, clearResponse }) => {
    const [content, setContent] = useState('');
    const [operation, setOperation] = useState('save');
    const [id, setId] = useState('');
    const [modelName, setModelName] = useState('gpt-4o-mini'); // Default model name
    const [classificationType, setClassificationType] = useState('positive'); // Default classification type
    const [fetchedData, setFetchedData] = useState(null); // State for fetched data

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearNotification(); // Clear notification on submit
        clearResponse(); // Clear response on submit
        setFetchedData(null); // Clear fetched data on submit
        setAllCommunications([]); // Clear all communications on submit
        
        try {
            let res;

            const dataToSend = {
                content,
                modelName,
                classificationType
            };

            if (operation === 'save') {
                res = await axios.post('http://localhost:8080/api/communications', dataToSend);
            } else if (operation === 'update') {
                res = await axios.put(`http://localhost:8080/api/communications/${id}`, dataToSend);
            } else if (operation === 'delete') {
                await axios.delete(`http://localhost:8080/api/communications/${id}`);
                // Notify the deletion
                setDeleteNotification(`Communication with ID ${id} has been deleted.`);
                // Reset fields after deletion
                setContent('');
                setId('');
                return; // Don't set response for delete
            } else if (operation === 'get') {
                res = await axios.get(`http://localhost:8080/api/communications/${id}`);
                // Update fetchedData if communication is found
                if (res.data) {
                    setFetchedData(res.data); // Store fetched data
                }
                return; // Don't set response for POST/PUT/DELETE
            }

            setResponse(res.data);
            // If saved or updated, reset the input fields
            if (operation === 'save' || operation === 'update') {
                setContent('');
                setId(''); // Clear ID field after save/update
            }
        } catch (error) {
            setResponse({ error: error.message });
        }
    };

    const handleGetAll = async () => {
        clearNotification(); // Clear notification on get all
        clearResponse(); // Clear response on get all
        try {
            const res = await axios.get('http://localhost:8080/api/communications');
            setAllCommunications(res.data); // Update the list of all communications
        } catch (error) {
            setResponse({ error: error.message });
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {operation !== 'get' && operation !== 'delete' && (
                    <div>
                        <label>
                            Content:
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required={operation === 'save' || operation === 'update'}
                                maxLength={1000}
                            />
                        </label>
                    </div>
                )}
                <div>
                    <label>
                        Operation:
                        <select value={operation} onChange={(e) => setOperation(e.target.value)}>
                            <option value="save">Save</option>
                            <option value="update">Update</option>
                            <option value="delete">Delete</option>
                            <option value="get">Get by ID</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Model Name:
                        <select value={modelName} onChange={(e) => setModelName(e.target.value)}>
                            <option value="gpt-4o-mini">GPT-4o-Mini</option>
                            <option value="gpt-4">GPT-4</option>
                            <option value="gpt-3">GPT-3</option>
                            {/* Add more models as needed */}
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Classification Type:
                        <select value={classificationType} onChange={(e) => setClassificationType(e.target.value)}>
                            <option value="positive">Positive</option>
                            <option value="negative">Negative</option>
                            <option value="neutral">Neutral</option>
                        </select>
                    </label>
                </div>
                {operation !== 'save' && (
                    <div>
                        <label>
                            ID:
                            <input
                                type="number"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                required={operation !== 'delete'}
                            />
                        </label>
                    </div>
                )}
                <button type="submit">Submit</button>
            </form>
            <button onClick={handleGetAll}>Get All Communications</button>

            {/* Display fetched data if available */}

            {fetchedData && (
                <div>
                    <h3>Fetched Communication:</h3>
                    <div><strong>ID:</strong> {fetchedData.id || 'N/A'}</div>
                    <div><strong>Content:</strong> {fetchedData.content || 'N/A'}</div>
                    <div>
                       <strong>Primary Emotion:</strong>
                        {fetchedData.primaryEmotion ? (
                            `${fetchedData.primaryEmotion.emotion} (${fetchedData.primaryEmotion.percentage}%)`
                        ) : (
                            'N/A'
                        )}
                    </div>
                <div>
            <strong>Secondary Emotions:</strong>
            {fetchedData.secondaryEmotions && fetchedData.secondaryEmotions.length > 0 ? (
                <ul>
                    {fetchedData.secondaryEmotions.map((secEmotion, index) => (
                        <li key={index}>
                            {secEmotion.emotion} ({secEmotion.percentage}%)
                        </li>
                    ))}
                </ul>
            ) : (
                'No secondary emotions available'
            )}
        </div>
        <div><strong>Summary:</strong> {fetchedData.summary || 'N/A'}</div>
        <div><strong>Timestamp:</strong> {fetchedData.timestamp ? new Date(fetchedData.timestamp).toLocaleString() : 'N/A'}</div>
            </div>
            )}

        </div>
    );
};

export default CommunicationForm;
