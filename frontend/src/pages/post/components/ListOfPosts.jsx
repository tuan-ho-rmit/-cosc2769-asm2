import React from "react";
import DropDowns from "./DropDowns";
import { Link } from 'react-router-dom';

export default function ListOfPosts({ posts, onPostEdit, onPostDelete }) {

    const postItems = posts.map((each) => {
        const displayImages = each.images.slice(0, 3); // 최대 3장까지 이미지를 잘라냅니다.
        const remainingImagesCount = each.images.length - 3; // 3장 이후의 남은 이미지 수 계산

        return (
            <div key={each._id} className="postContainer"> {/* key를 each._id로 설정 */}
                <div className="postHeader">
                    <div className="imgContainer">
                        <div className='mx-4'>
                            <img
                                src={each.userProfile}  // 저장된 Base64 이미지 또는 URL을 사용
                                className='w-10 h-10 ring-yellow ring-2 rounded-full'
                                alt='rounded-avatar'
                            />
                        </div>
                    </div>
                    <div className="postInfo">
                        <div className="userName">
                            <p>{each.author}</p>  {/* 저장된 작성자 이름 표시 */}
                            {/* <p>{each._id}</p> */}
                        </div>
                        <div className="postDate">
                            <p>{new Date(each.date).toLocaleString()}</p>  {/* 날짜를 보기 좋게 포맷 */}
                        </div>
                    </div>
                    <div className="dropDown">
                        <DropDowns
                            onEdit={() => onPostEdit(each._id)}
                            onDelete={() => onPostDelete(each._id)}  // 정확한 each._id 전달
                        />
                    </div>
                </div>
                <Link to={`/post/${each._id}`}> {/* 정확한 each._id 전달 */}
                    <div className="postContent">
                        {each.content}
                    </div>
                    <div className="postContentImg">
                        {displayImages.map((image, idx) => (
                            <div key={idx} className="imageWrapper">
                                <img src={image} alt={`Post image ${idx}`} className="postImage" />
                                {idx === 2 && remainingImagesCount > 0 && ( // 세 번째 이미지 위에 오버레이 추가
                                    <div className="imageOverlay">
                                        +{remainingImagesCount} Pictures
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Link>
                <hr className="solidPost"></hr>
                <div className="likeComment">
                    <span className="likeBtn">
                        <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </span>
                    <span className="commentBtn">
                        <button>Comment</button>
                    </span>
                </div>
                <hr className="solidPost"></hr>
            </div>
        );
    });

    return (
        <div className="postListContainer">
            {postItems}
        </div>
    );
}
