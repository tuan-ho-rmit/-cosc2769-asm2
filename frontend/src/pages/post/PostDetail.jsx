import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// import './PostDetail.css';

export default function PostDetail() {
  const { id } = useParams();
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
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="postDetailContainer">
      <h1>Post Detail</h1>
      <div className="imageSlider">
        <Slider {...settings}>
          {post.images.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Slide ${index}`} />
            </div>
          ))}
        </Slider>
      </div>
      <div className="postContent">
        <p>{post.content}</p>
      </div>
      <div className="commentsSection">
        <h2>Comments</h2>
        <ul>
          {post.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
