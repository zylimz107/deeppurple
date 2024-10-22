import React, { useState } from 'react';
import axios from 'axios';

const CommunicationForm = ({ setResponse, setAllCommunications, setDeleteNotification, clearNotification, clearResponse }) => {
    const [content, setContent] = useState('');
    const [operation, setOperation] = useState('save');
    const [id, setId] = useState('');
    const [fetchedData, setFetchedData] = useState(null); // State for fetched data

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearNotification(); // Clear notification on submit
        clearResponse(); // Clear response on submit
        setFetchedData(null); // Clear fetched data on submit
        setAllCommunications([]); // Clear all communications on submit
        
        try {
            let res;

            if (operation === 'save') {
                res = await axios.post('http://localhost:8080/api/communications', { content });
            } else if (operation === 'update') {
                res = await axios.put(`http://localhost:8080/api/communications/${id}`, { content });
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
                    <p><strong>Content:</strong> {fetchedData.content}</p>
                    <p><strong>Primary Emotion:</strong> {fetchedData.primaryEmotion}</p>
                    <p><strong>Secondary Emotions:</strong> {fetchedData.secondaryEmotions}</p>
                    <p><strong>Summary:</strong> {fetchedData.summary}</p>
                </div>
            )}
        </div>
    );
};

export default CommunicationForm;
