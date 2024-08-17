import React, { useState } from "react";
import './UserDetails.css';

export default function UserDetails() {
    const [name, setName] = useState("Cho Jaesuk"); // 초기 상태값을 기본 이름으로 설정
    const [isEditing, setIsEditing] = useState(false);

    const handleNameChange = (e) => {
        setName(e.target.value); // 새로운 값으로 상태를 업데이트
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing); // 편집 모드 전환
    };

    return (
        <div>
            <div className="mainContent">
                <div className="userProfileContainer">
                    <span className="profileImgContaimer">
                        <img src="/Images/example2.png" alt="userImage" className="profileImg" />
                        <button className="changeProfileImg">
                            <svg className="h-8 w-8 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                        </button>
                    </span>
                    <span className="userName">
                        {isEditing ? (
                            <input
                                type="text"
                                value={name} // 입력된 값이 표시됩니다.
                                onChange={handleNameChange} // 입력값이 변경될 때마다 상태를 업데이트
                                onBlur={toggleEditing}  // 입력이 끝나면 편집 모드 해제
                                className="nameInput"
                            />
                        ) : (
                            <p>{name}</p>  // 수정 모드가 아닐 때 이름을 표시
                        )}
                        <button onClick={toggleEditing} className="changeNameBtn">
                            <svg className="h-8 w-8 text-yellow-500" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                <line x1="16" y1="5" x2="19" y2="8" />
                            </svg>
                        </button>
                    </span>
                    <span className="editBtn">
                        <button>Save New Changes</button>
                    </span>
                </div>
            </div>
            <hr className="solid"></hr>
        </div>
    );
}
