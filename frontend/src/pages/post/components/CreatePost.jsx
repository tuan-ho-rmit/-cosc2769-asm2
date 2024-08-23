import React, { useRef, useState, useEffect } from "react";

export default function CreatePost({
    text,
    onAdd,
    onPostChange,
    onImageUpload,
}) {
    const fileInputRef = useRef(null);
    const [previewImages, setPreviewImages] = useState([]);
    const [userAvatar, setUserAvatar] = useState(null); // 세션에서 받아온 유저 아바타를 저장

    // 세션에서 유저 아바타를 받아오는 함수
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/auth/user', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (data && data.user && data.user.avatar) {
                    setUserAvatar(data.user.avatar); // 유저 아바타를 설정
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleImageUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const imagePreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages([...previewImages, ...imagePreviews]);
        onImageUpload(e);
    };

    const handleRemoveImage = (indexToRemove) => {
        setPreviewImages(previewImages.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="createPostContainer">
            <div className="postHeaderForInputPost">
                <div className="imgContainer">
                    <div className='mx-4'>
                        <img 
                            src={userAvatar || 'https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-6/454539036_476839358283813_2967004303045072180_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=-9m-zIRhoLYQ7kNvgF3oBm_&_nc_ht=scontent.fhan4-3.fna&oh=00_AYAcyZp-BRKgTQ_HzRZA-G0OMKGRy4C84B3jhXkfw6A58g&oe=66C0DFF9'}
                            className='w-10 h-10 ring-yellow ring-2 rounded-full' 
                            alt='rounded-avatar'
                        />
                    </div>
                </div>
                <div className="postInput">
                    <input 
                        value={text} 
                        onChange={(e) => onPostChange(e.target.value)} 
                        type="text" 
                        placeholder="What's on your mind?"
                    />
                </div>
            </div>
            <hr className="solid"></hr>
            {/* 이미지 미리보기 영역 */}
            <div className="imagePreviewContainer">
                {previewImages.map((src, index) => (
                    <div key={index} className="imageWrapper">
                        <img src={src} alt={`Preview ${index}`} className="previewImage" />
                        <button className="removeImageBtn" onClick={() => handleRemoveImage(index)}>X</button>
                    </div>
                ))}
            </div>
            <div className="btnContainer">
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="imageUploadInput" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    multiple
                />
                <button className="submitImg" onClick={handleImageUploadClick}>Add Image</button>
                <button className="submitBtn" onClick={onAdd}>Post</button>
            </div>
        </div>
    );
}
