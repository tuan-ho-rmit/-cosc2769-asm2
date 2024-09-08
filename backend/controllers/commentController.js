// controllers/commentController.js
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import {createNoti} from "../services/notiService.js";
import user from "../models/User.js";

export const addComment = async (req, res) => {
    try {
        // Check if the user is logged in
        if (!req.session.user) {
            return res.status(401).json({ message: 'User is not logged in' });
        }

        const { postId } = req.params; // Extract postId from URL parameters
        const { content } = req.body; // Extract content from request body

        // Check if the content is provided
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        // Create a new comment object
        const newComment = new Comment({
            postId,
            content,
            author: req.session.user.id, // Set the author as the logged-in user
            date: new Date(), // Set the current date
        });

        await newComment.save(); // Save the comment to the database

        // Find the post and populate the author's details
        const existedPost = await Post.findById(postId).populate('author');
        console.log('logging existedPost: ', existedPost)

        // Create a notification for the post author
        await createNoti(
            'New comment on your post', // Notification message
            [existedPost.author._id], // Send notification to the post author
            'unread', // Mark the notification as unread
            `/post/${existedPost.id}` // Link to the post
        );

        // Send the newly created comment as a response
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error adding comment:', error); // Log the error
        res.status(500).json({ message: 'Error adding comment', error: error.message }); // Send error response
    }
};

export const getCommentsByPostId = async (req, res) => {
    try {
        const { postId } = req.params; // Extract postId from URL parameters
        
        // Find all comments related to the post and populate the author's details
        const comments = await Comment.find({ postId }).populate('author', 'firstName lastName avatar');
        
        // Send the comments as a response
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error); // Log the error
        res.status(500).json({ message: 'Error fetching comments', error: error.message }); // Send error response
    }
};

export const updateComment = async (req, res) => {
    const { commentId } = req.params; // Extract commentId from URL parameters
    const { content } = req.body; // Extract content from request body

    console.log(`Updating comment with ID: ${commentId}`); // Log the commentId
    console.log(`New content: ${content}`); // Log the new content

    try {
        // Find the comment by its ID
        const comment = await Comment.findById(commentId);
        if (!comment) {
            console.error(`Comment with ID ${commentId} not found`); // Log if comment is not found
            return res.status(404).json({ message: "Comment not found" }); // Send error response
        }

        // Store the previous content in the comment's history
        const previousContent = comment.content;
        comment.history.push({
            modifiedBy: req.session.user.id, // Set the user who modified the comment
            modifiedAt: new Date(), // Set the current date for the modification
            previousContent: previousContent, // Store the previous content
        });

        console.log(`Previous content added to history: ${previousContent}`); // Log the previous content

        // Update the comment content and date
        comment.content = content;
        comment.date = new Date(); // Set the current date as the updated date

        // Save the updated comment
        const updatedComment = await comment.save();
        console.log(`Comment updated successfully: ${updatedComment}`); // Log the updated comment

        // Send the updated comment as a response
        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Error updating comment:', error); // Log the error
        res.status(500).json({ message: "Error updating comment", error }); // Send error response
    }
};


export const deleteComment = async (req, res) => {
    const { postId, commentId } = req.params; // Extract postId and commentId from URL parameters

    try {
        // Find and delete the comment by its ID
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' }); // Send error response if not found
        }

        res.status(200).json({ message: 'Comment deleted successfully' }); // Send success response
    } catch (error) {
        console.error('Error deleting comment:', error); // Log the error
        res.status(500).json({ message: 'Error deleting comment', error: error.message }); // Send error response
    }
};

export const updateCommentInPostDetail = async (req, res) => {
    const { commentId } = req.params; // Extract commentId from URL parameters
    const { content } = req.body; // Extract content from request body

    try {
        // Find and update the comment by its ID
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId, 
            { content }, // Set the new content
            { new: true } // Return the updated comment
        );

        if (!updatedComment) {
            return res.status(404).json({ message: "Comment not found" }); // Send error response if not found
        }

        res.status(200).json(updatedComment); // Send the updated comment as a response
    } catch (error) {
        console.error('Error updating comment:', error); // Log the error
        res.status(500).json({ message: "Error updating comment", error }); // Send error response
    }
};

export const deleteCommentInPostDetail = async (req, res) => {
    const { postId, commentId } = req.params; // Extract postId and commentId from URL parameters

    try {
        console.log(`Deleting comment for postId: ${postId} and commentId: ${commentId}`); // Log the IDs

        // Find and delete the comment by its ID
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' }); // Send error response if not found
        }

        res.status(200).json({ message: 'Comment deleted successfully' }); // Send success response
    } catch (error) {
        console.error('Error deleting comment:', error); // Log the error
        res.status(500).json({ message: 'Error deleting comment', error: error.message }); // Send error response
    }
};

export const getCommentHistory = async (commentId) => {
    try {
        // Find the comment by its ID and select its history
        const comment = await Comment.findById(commentId)
            .select('history')
            .populate('history.modifiedBy', 'firstName lastName avatar'); // Populate the user who modified the comment

        if (!comment) {
            return { status: 404, data: { message: "Comment not found" } }; // Return 404 if comment not found
        }

        return { status: 200, data: comment.history }; // Return the comment history
    } catch (error) {
        console.error('Error fetching comment history:', error); // Log the error
        return { status: 500, data: { message: "Error fetching comment history", error } }; // Return error response
    }
};

// Fetch the comment history and return via API route
export const getCommentHistoryRoute = async (req, res) => {
    const { commentId } = req.params; // Extract commentId from URL parameters
  
    try {
      // Call the function to get the comment history
      const result = await getCommentHistory(commentId);
  
      // Send response based on the result
      res.status(result.status).json(result.data);
    } catch (error) {
      console.error('Error in fetching comment history route:', error); // Log the error
      res.status(500).json({ message: "Internal server error", error }); // Send error response
    }
};
