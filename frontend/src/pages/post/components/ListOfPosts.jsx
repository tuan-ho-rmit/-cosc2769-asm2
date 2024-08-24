import React from "react";
import DropDowns from "./DropDowns";
import { Link } from 'react-router-dom';

export default function ListOfPosts({ posts, onPostEdit, onPostDelete, user }) {

    // 로그인된 유저의 ID (user.id를 사용합니다)
    const currentUserId = user ? user.id : null; 

    const postItems = posts.map((each) => {
        const displayImages = each.images.slice(0, 3); // 최대 3장까지 이미지를 잘라냅니다.
        const remainingImagesCount = each.images.length - 3; // 3장 이후의 남은 이미지 수 계산

        // 현재 사용자 ID와 게시물 작성자 ID 비교 (비교를 위해 문자열 변환)
        const isAuthor = currentUserId === each.author._id;

        // 콘솔 로그 추가
        console.log("Current User Object:", user); // user 객체 출력
        console.log("Current User ID:", currentUserId); // user.id 출력
        console.log("Post Author ID:", each.author._id);
        console.log("Is Author:", isAuthor);

        return (
            <div key={each._id} className="postContainer"> {/* key를 each._id로 설정 */}
                <div className="postHeader">
                    <div className="imgContainer">
                        <Link to={`/user/${each.author._id}`}> {/* 클릭 시 UserDetails 페이지로 이동 */}
                            <div className='mx-4'>
                                <img
                                    src={each.userProfile.avatar || 'default-avatar-url.jpg'}  // userProfile이 로드되었는지 확인 후 avatar를 참조
                                    className='w-10 h-10 ring-yellow ring-2 rounded-full'
                                    alt='rounded-avatar'
                                />
                            </div>
                        </Link>
                    </div>
                    <div className="postInfo">
                        <Link to={`/user/${each.author._id}`}> {/* 클릭 시 UserDetails 페이지로 이동 */}
                            <div className="userName">
                                <p>{each.author.firstName} {each.author.lastName || "Anonymous"}</p>
                            </div>
                        </Link>
                        <div className="postDate">
                            <p>{new Date(each.date).toLocaleString()}</p>  {/* 날짜를 보기 좋게 포맷 */}
                        </div>
                    </div>

                    {/* 드롭다운 메뉴는 현재 사용자가 게시물 작성자일 때만 렌더링 */}
                    {isAuthor && (
                        <div className="dropDown">
                            <DropDowns
                                onEdit={() => onPostEdit(each._id)}
                                onDelete={() => onPostDelete(each._id)}  // 정확한 each._id 전달
                            />
                        </div>
                    )}
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
