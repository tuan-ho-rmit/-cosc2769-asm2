import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './PostDetail.css';
// function SampleNextArrow(props) {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{ ...style, display: "block", background: "#FFD369" }}
//       onClick={onClick}
//     />
//   );
// }

// function SamplePrevArrow(props) {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{ ...style, display: "block", background: "#FFD369" }}
//       onClick={onClick}
//     />
//   );
// }
export default function PostDetail() {
  const { id } = useParams(); // URL 파라미터에서 id 가져오기
  const [post, setPost] = useState(null);

  useEffect(() => {
    // API 요청을 통해 포스트 데이터를 가져옵니다.
    axios.get(`http://localhost:3000/api/posts/${id}`)
      .then(response => setPost(response.data))
      .catch(error => console.error('Error fetching the post:', error));
  }, [id]);

  if (!post) return <div>Loading...</div>;
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    
  };

  return (
    <div className="postDetailContainer">
      <div className="postHeader">
        <div className="imgContainer">
            <div className='mx-4'>
                <img src='https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-6/454539036_476839358283813_2967004303045072180_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=-9m-zIRhoLYQ7kNvgF3oBm_&_nc_ht=scontent.fhan4-3.fna&oh=00_AYAcyZp-BRKgTQ_HzRZA-G0OMKGRy4C84B3jhXkfw6A58g&oe=66C0DFF9'
                className='w-10 h-10 ring-yellow ring-2 rounded-full' alt='rounded-avatar'/>
            </div>
        </div>
        <div className="postInfo">
          <div className="userName">
            <p>{post.author}</p>
          </div>
          <div className="postDate">
              <p>{post.date}</p>
          </div>
        </div>
      </div>
      <div className="postContent">
          {post.content}
        </div>
        {post.images && post.images.length > 0 && (
        <div className="imageSlider">
          <Slider {...settings}>
            {post.images.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Slide ${index}`} className="postImage" />
              </div>
            ))}
          </Slider>
        </div>
      )}
      <hr className="solidPostForDetail"></hr>
      <div className="likeComment">
                    <span className="likeBtn">
                        <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                    </span>
                    <span className="commentBtn">
                        <button>Comment</button>
                    </span>
                </div>
                <hr className="solidPostForDetail"></hr>
    </div>
  );
}
