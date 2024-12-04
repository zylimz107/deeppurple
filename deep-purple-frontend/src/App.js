import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import CommunicationForm from './CommunicationForm';

const App = () => {
    const [response, setResponse] = useState(null);
    const [allCommunications, setAllCommunications] = useState([]);
    const [deleteNotification, setDeleteNotification] = useState('');

    const clearNotification = useCallback(() => {
        setDeleteNotification('');
    }, []);

    const clearResponse = useCallback(() => {
        setResponse(null);
    }, []);

    useEffect(() => {
        if (deleteNotification) {
            const timer = setTimeout(clearNotification, 3000); // Clears notification after 3 seconds
            return () => clearTimeout(timer); // Cleanup timeout on unmount
        }
    }, [deleteNotification]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Deep Purple Analysis</h1>
            <CommunicationForm 
                setResponse={setResponse} 
                setAllCommunications={setAllCommunications} 
                setDeleteNotification={setDeleteNotification} 
                clearNotification={clearNotification} 
                clearResponse={clearResponse}
            />

            {response && (
                <Card>
                    <h3>Operation Response:</h3>
                    {response.error ? (
                        <div style={{ color: 'red' }}><strong>Error:</strong> {response.error}</div>
                    ) : (
                        <>
                            <div><strong>ID:</strong> {response.id || 'N/A'}</div>
                            <div><strong>Content:</strong> {response.content || 'N/A'}</div>
                            <div><strong>Primary Emotion:</strong> 
                                {response.primaryEmotion ? `${response.primaryEmotion.emotion} (${response.primaryEmotion.percentage}%)` : 'N/A'}
                            </div>
                            <div><strong>Secondary Emotions:</strong>
                                {response.secondaryEmotions && response.secondaryEmotions.length > 0 ? (
                                    <ul>
                                        {response.secondaryEmotions.map((secEmotion, index) => (
                                            <li key={index}>{secEmotion.emotion} ({secEmotion.percentage}%)</li>
                                        ))}
                                    </ul>
                                ) : 'No secondary emotions available'}
                            </div>
                            <div><strong>Classification:</strong> {response.classificationType || 'N/A'}</div>
                            <div><strong>Confidence Rating:</strong> {response.confidenceRating || 'N/A'}</div>
                            <div><strong>Summary:</strong> {response.summary || 'N/A'}</div>
                            <div><strong>Timestamp:</strong> {response.timestamp ? new Date(response.timestamp).toLocaleString() : 'N/A'}</div>
                        </>
                    )}
                </Card>
            )}

            {allCommunications.length > 0 && (
                <Card>
                    <h2>All Communications:</h2>
                    <ul>
                        {allCommunications.map((comm) => (
                            <li key={comm.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                                <div><strong>ID:</strong> {comm.id}</div>
                                <div><strong>Content:</strong> {comm.content}</div>
                                <div><strong>Primary Emotion:</strong> {comm.primaryEmotion.emotion} ({comm.primaryEmotion.percentage}%)</div>
                                <div><strong>Secondary Emotions:</strong>
                                    {comm.secondaryEmotions.length > 0 ? (
                                        <ul>
                                            {comm.secondaryEmotions.map((secEmotion, index) => (
                                                <li key={index}>{secEmotion.emotion} ({secEmotion.percentage}%)</li>
                                            ))}
                                        </ul>
                                    ) : <p>No secondary emotions available</p>}
                                </div>
                                <div><strong>Classification:</strong> {comm.classificationType}</div>
                                <div><strong>Confidence Rating:</strong> {comm.confidenceRating}</div>
                                <div><strong>Summary:</strong> {comm.summary}</div>
                                <div><strong>Timestamp:</strong> {new Date(comm.timestamp).toLocaleString()}</div>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}

            {deleteNotification && (
                <div style={{ color: 'green', marginTop: '10px' }}>
                    {deleteNotification}
                </div>
            )}
        </div>
    );
};

export default App;
