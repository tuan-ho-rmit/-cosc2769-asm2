import React from "react";

export default function CreatePost({
    text,
    onAdd,
    onPostChange,


}) {
    return (
        <div className="createPostContainer">
            <div className="postHeaderForInputPost">
                <div className="imgContainer">
                <div className='mx-4'>
              <img src='https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-6/454539036_476839358283813_2967004303045072180_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=-9m-zIRhoLYQ7kNvgF3oBm_&_nc_ht=scontent.fhan4-3.fna&oh=00_AYAcyZp-BRKgTQ_HzRZA-G0OMKGRy4C84B3jhXkfw6A58g&oe=66C0DFF9'
                   className='w-10 h-10 ring-yellow ring-2 rounded-full' alt='rounded-avatar'/>
            </div>
                </div>
                <div className="postInput">
                    <input value={text} onChange={(e) => onPostChange(e.target.value)} type="text" placeholder="What's on your mind?"/>
                </div>
            </div>
            <hr className="solid"></hr>
            <div className="btnContainer">
                <button className="submitImg">image</button>
                <button className="submitBtn" onClick={onAdd}>Post</button>
            </div>
        </div>
        
    )
}