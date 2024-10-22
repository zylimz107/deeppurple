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
                    <h2>Response:</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                    {response.primaryEmotion && (
                        <div>
                            <h3>Analysis Result:</h3>
                            <p><strong>Primary Emotion:</strong> {response.primaryEmotion}</p>
                            <p><strong>Secondary Emotions:</strong> {response.secondaryEmotions}</p>
                            <p><strong>Summary:</strong> {response.summary}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Display all communications if available */}
            {allCommunications.length > 0 && (
                <div>
                    <h2>All Communications:</h2>
                    <ul>
                        {allCommunications.map((comm) => (
                            <li key={comm.id}>
                                <strong>ID:</strong> {comm.id}, <strong>Content:</strong> {comm.content}
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
