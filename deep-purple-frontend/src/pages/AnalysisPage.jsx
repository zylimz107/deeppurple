import React, { useState, useEffect, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import CommunicationForm from "@/components/CommunicationForm/CommunicationForm";

const AnalysisPage = () => {
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
            const timer = setTimeout(clearNotification, 3000);
            return () => clearTimeout(timer);
        }
    }, [deleteNotification]);

    return (
            <div className="p-5">
                <h1 className="text-3xl font-bold mb-4">Deep Purple Analysis</h1>
                <CommunicationForm
                    setResponse={setResponse}
                    setAllCommunications={setAllCommunications}
                    setDeleteNotification={setDeleteNotification}
                    clearNotification={clearNotification}
                    clearResponse={clearResponse}
                />

                {response && (
                    <Card className="mb-5">
                        <h3 className="text-2xl font-semibold">Operation Response:</h3>
                        {response.error ? (
                            <div className="text-red-500"><strong>Error:</strong> {response.error}</div>
                        ) : (
                            <>
                                <div><strong>ID:</strong> {response.id || 'N/A'}</div>
                                <div><strong>Content:</strong> {response.content || 'N/A'}</div>
                                <div><strong>Primary Emotion:</strong>
                                    {response.primaryEmotion ? `${response.primaryEmotion.emotion} (${response.primaryEmotion.percentage}%)` : 'N/A'}
                                </div>
                                <div><strong>Secondary Emotions:</strong>
                                    {Array.isArray(response.secondaryEmotions) && response.secondaryEmotions.length > 0 ? (
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
                    <Card className="mb-5">
                        <h2 className="text-2xl font-semibold">All Communications:</h2>
                        <ul>
                            {allCommunications.map((comm) => (
                                <li key={comm.id} className="mb-5 p-3 border border-gray-300 rounded">
                                    <div><strong>ID:</strong> {comm.id}</div>
                                    <div><strong>Content:</strong> {comm.content}</div>
                                    <div><strong>Primary Emotion:</strong> {comm.primaryEmotion.emotion} ({comm.primaryEmotion.percentage}%)</div>
                                    <div><strong>Secondary Emotions:</strong>
                                        {Array.isArray(comm.secondaryEmotions) && comm.secondaryEmotions.length > 0 ? (
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
                    <div className="text-green-500 mt-2">{deleteNotification}</div>
                )}
            </div>
    );
};

export default AnalysisPage;
