// App.js
import React, { useState } from 'react';
import CommunicationForm from './CommunicationForm';

const App = () => {
    const [response, setResponse] = useState(null);
    const [allCommunications, setAllCommunications] = useState([]);
    const [deleteNotification, setDeleteNotification] = useState(''); // State for delete notification

    const clearNotification = () => {
        setDeleteNotification(''); // Clear notification message
    };

    const clearResponse = () => {
        setResponse(null); // Clear response
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Deep Purple Analysis</h1>
            <CommunicationForm 
                setResponse={setResponse} 
                setAllCommunications={setAllCommunications} 
                setDeleteNotification={setDeleteNotification} 
                clearNotification={clearNotification} 
                clearResponse={clearResponse} // Pass clearResponse function
            />

            {/* Display analysis results if available */}
    {response && (
        <div>
            <h3>Operation Response:</h3>
            {response.error ? (
                <div style={{ color: 'red' }}><strong>Error:</strong> {response.error}</div>
            ) : (
                <>
                    <div><strong>ID:</strong> {response.id || 'N/A'}</div>
                    <div><strong>Content:</strong> {response.content || 'N/A'}</div>
                    <div>
                        <strong>Primary Emotion:</strong>
                        {response.primaryEmotion ? (
                            `${response.primaryEmotion.emotion} (${response.primaryEmotion.percentage}%)`
                        ) : (
                            'N/A'
                        )}
                    </div>
                    <div>
                        <strong>Secondary Emotions:</strong>
                    {response.secondaryEmotions && response.secondaryEmotions.length > 0 ? (
                        <ul>
                            {response.secondaryEmotions.map((secEmotion, index) => (
                                <li key={index}>
                                    {secEmotion.emotion} ({secEmotion.percentage}%)
                                </li>
                            ))}
                        </ul>
                    ) : (
                        'No secondary emotions available'
                    )}
                </div>
                <div><strong>Classification:</strong> {response.classificationType}</div>
                <div><strong>Summary:</strong> {response.summary || 'N/A'}</div>
                <div><strong>Timestamp:</strong> {response.timestamp ? new Date(response.timestamp).toLocaleString() : 'N/A'}</div>
                </>
                )}
        </div>
        )}


            {/* Display all communications if available */}
            {allCommunications.length > 0 && (
    <div>
        <h2>All Communications:</h2>
        <ul>
            {allCommunications.map((comm) => (
                <li key={comm.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <div><strong>ID:</strong> {comm.id}</div>
                    <div><strong>Content:</strong> {comm.content}</div>
                    <div><strong>Primary Emotion:</strong> {comm.primaryEmotion.emotion} ({comm.primaryEmotion.percentage}%)</div>
                    <div>
                        <strong>Secondary Emotions:</strong>
                        {comm.secondaryEmotions.length > 0 ? (
                            <ul>
                                {comm.secondaryEmotions.map((secEmotion, index) => (
                                    <li key={index}>{secEmotion.emotion} ({secEmotion.percentage}%)</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No secondary emotions available</p>
                        )}
                    </div>
                    <div><strong>Classification:</strong> {comm.classificationType}</div>
                    <div><strong>Summary:</strong> {comm.summary}</div>
                    <div><strong>Timestamp:</strong> {new Date(comm.timestamp).toLocaleString()}</div>
                </li>
            ))}
        </ul>
    </div>
)}


            {/* Display delete notification if available */}
            {deleteNotification && (
                <div style={{ color: 'green', marginTop: '10px' }}>
                    {deleteNotification}
                </div>
            )}
        </div>
    );
};

export default App;
