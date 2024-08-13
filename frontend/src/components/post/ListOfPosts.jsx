import React from "react";
import DropDowns from "./DropDowns";
import { Link } from 'react-router-dom';
export default function ListOfPosts({posts, onPostEdit, onPostDelete}) {
    
    const post = posts.map((each, index) => {
        return (
            <div key={index} className="postContainer">
                <div className="postHeader">
                    <div className="imgContainer">
                    <div className='mx-4'>
              <img src='https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-6/454539036_476839358283813_2967004303045072180_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=-9m-zIRhoLYQ7kNvgF3oBm_&_nc_ht=scontent.fhan4-3.fna&oh=00_AYAcyZp-BRKgTQ_HzRZA-G0OMKGRy4C84B3jhXkfw6A58g&oe=66C0DFF9'
                   className='w-10 h-10 ring-yellow ring-2 rounded-full' alt='rounded-avatar'/>
            </div>
                    </div>
                    <div className="postInfo">
                        <div className="userName">
                            <p>{each.author}</p>
                        </div>
                        <div className="postDate">
                            <p>{each.date}</p>
                        </div>
                    </div>
                    <div className="dropDown">
                        <DropDowns onEdit={() => onPostEdit(index)} onDelete={() => onPostDelete(index)} />
                    </div>
                </div>
                <Link to={`/post/${index}`}>
                <div className="postContent">
                    {each.content}
                </div>
                <div className="postContentImg">
                    {each.images}
                </div>
                </Link>
                <hr className="solid"></hr>
                <div className="likeComment">
                    <div>

                    </div>
                </div>
            </div>
        )
    })
    return (
        <div className="postListContainer">
            {post}
        </div>
    )
}   