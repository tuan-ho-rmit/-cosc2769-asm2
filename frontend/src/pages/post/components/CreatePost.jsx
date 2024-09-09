import React, { useRef, useState } from "react";

export default function CreatePost({
    text,  // The content of the post
    onAdd,  // Function to handle adding a post
    onPostChange,  // Function to handle changes to the post's content
    onImageUpload,  // Function to handle image uploads
    user,  // The current logged-in user's information
    isPrivate,  // Boolean to indicate if the post is private or public
    setIsPrivate,  // Function to toggle privacy of the post
    showPrivacyToggle = true  // Default value is true, controls if privacy toggle should be shown
}) {
    const fileInputRef = useRef(null);  // Reference to the hidden file input for image uploads
    const [previewImages, setPreviewImages] = useState([]);  // State to store preview images
    const [imageFiles, setImageFiles] = useState([]);  // Store actual image files
    const userAvatar = user?.avatar; // Retrieves the avatar of the logged-in user

    // Trigger the file input when the "Add Image" button is clicked
    const handleImageUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();  // Open the hidden file input
        }
    };

    // Handle image selection and create image previews
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);  // Convert the file list into an array
        const imagePreviews = files.map(file => URL.createObjectURL(file));  // Create a preview URL for each file

        setPreviewImages([...previewImages, ...imagePreviews]);  // Update preview images state
        const newFiles = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result); // Push base64 encoded image
                };
                reader.readAsDataURL(file);
            });
        });

        // Wait for all the images to be processed into base64
        Promise.all(newFiles).then(encodedImages => {
            setImageFiles([...imageFiles, ...encodedImages]);  // Store the base64-encoded images
        });
    };

    // Remove a selected image from the preview and the actual image data
    const handleRemoveImage = (indexToRemove) => {
        setPreviewImages(previewImages.filter((_, index) => index !== indexToRemove));  // Filter out the image by index
        setImageFiles(imageFiles.filter((_, index) => index !== indexToRemove));  // Filter out the image from actual image data
    };

    // Toggle the privacy setting of the post between public and friends-only
    const handleTogglePrivacy = () => {
        setIsPrivate(!isPrivate);  // Invert the current privacy state
    };

    // Add the post and reset the image previews
    const handleAddPost = () => {
        onAdd(imageFiles);  // Pass the actual image files (base64 encoded) when adding the post
        setPreviewImages([]);  // Reset image previews after the post is added
        setImageFiles([]);  // Reset the actual image data
    };

    return (
        <div className="createPostContainer">
            <div className="postHeaderForInputPost">
                <div className="imgContainer">
                    <div className='mx-4'>
                        {/* Display the user's avatar or a default avatar */}
                        <img 
                            src={userAvatar || 'default-avatar-url.jpg'} 
                            className='w-10 h-10 ring-yellow ring-2 rounded-full' 
                            alt='rounded-avatar'
                        />
                    </div>
                </div>
                <div className="postInput">
                    {/* Text input for creating a post */}
                    <input 
                        value={text}  // Controlled input value for post content
                        onChange={(e) => onPostChange(e.target.value)}  // Update the post content
                        type="text" 
                        placeholder="What's on your mind?"  // Placeholder text
                    />
                </div>
            </div>
            <hr className="solid"></hr>
            <div className="imagePreviewContainer">
                {/* Display selected images as previews */}
                {previewImages.map((src, index) => (
                    <div key={index} className="imageWrapper">
                        <img src={src} alt={`Preview ${index}`} className="previewImage" />  {/* Preview image */}
                        <button className="removeImageBtn" onClick={() => handleRemoveImage(index)}>X</button>  {/* Button to remove image */}
                    </div>
                ))}
            </div>
            <div className="btnContainer">
                {/* Hidden file input for image uploads */}
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}  // Triggered when images are selected
                    className="imageUploadInput" 
                    ref={fileInputRef}  // Reference to the hidden input
                    style={{ display: 'none' }}  // Hidden from the UI
                    multiple  // Allow multiple file selection
                />
                {/* Button to trigger image upload */}
                <button className="submitImg" onClick={handleImageUploadClick}>Add Image</button>

                {/* Button to submit the post */}
                <button className="submitBtn" onClick={handleAddPost}>Post</button>

                {/* Conditionally render privacy toggle button if showPrivacyToggle is true */}
                {showPrivacyToggle && (
                    <button className="togglePrivacyBtn" onClick={handleTogglePrivacy}>
                        {isPrivate ? 'Friends Only' : 'Public'}  {/* Display current privacy status */}
                    </button>
                )}
            </div>
        </div>
    );
}
