import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// PostHistory component is responsible for fetching and displaying the modification history of a post.
export default function PostHistory() {
  const { id: postId } = useParams(); // Retrieves the 'id' parameter from the URL, which is the postId.

  const [postHistories, setPostHistories] = useState([]); // State to store the array of post history entries.

  // useEffect hook is used to fetch the post history when the component mounts or when postId changes.
  useEffect(() => {
    const fetchPostHistory = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}/history`, {
          method: 'GET',
          credentials: 'include' // Include credentials like cookies in the request
        });

        if (!response.ok) {
          throw new Error('Error fetching post history'); // Throws an error if the request is not successful
        }

        const data = await response.json(); // Parses the response as JSON
        console.log('Fetched post history:', data); // Logs the fetched history data for debugging purposes
        setPostHistories(data); // Updates the postHistories state with the fetched data
      } catch (error) {
        console.error('Error fetching post history:', error); // Logs an error if the fetch request fails
      }
    };

    fetchPostHistory(); // Calls the function to fetch post history
  }, [postId]); // The effect will re-run if postId changes.

  return (
    <div className="postHistoryContainer">
      <h2>Post History</h2>
      {postHistories.length > 0 ? ( // Checks if there are any history entries to display
        postHistories.map((history, index) => ( // Maps over the postHistories array to render each history entry
          <div key={index} className="historyItem">
            <p>Modified By: {history.modifiedBy.firstName} {history.modifiedBy.lastName}</p> {/* Displays the name of the user who modified the post */}
            <p>Date: {new Date(history.modifiedAt).toLocaleString()}</p> {/* Formats and displays the modification date */}
            <div className="postContent">
              <p>{history.previousContent}</p> {/* Displays the previous content of the post */}
              {history.previousImages.map((image, idx) => ( // Maps over previous images and renders them
                <img key={idx} src={image} alt={`History image ${idx}`} className="postImage" /> // Displays each previous image
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No modification history available.</p> // Renders this message if there are no history entries
      )}
    </div>
  );
}
