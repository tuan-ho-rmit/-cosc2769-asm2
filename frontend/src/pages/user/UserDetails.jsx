import React from "react";
import './UserDetails.css';
export default function UserDetails() {
    return (
        <div>
            <div className="mainContent">
                <div className="userProfileContainer">
                    <span className="profileImgContaimer">
                        <img className="profileImg" src="/Images/example.jpg" alt="profileImg" />
                        <button className="changeProfileImg">
                        <svg class="h-8 w-8 text-yellow-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />  <polyline points="17 8 12 3 7 8" />  <line x1="12" y1="3" x2="12" y2="15" /></svg>
                        </button>
                    </span>
                    <span className="userName">
                        <p>userName</p>
                        <button className="changeNameBtn">
                        <svg class="h-8 w-8 text-yellow-500"  viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />  <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />  <line x1="16" y1="5" x2="19" y2="8" /></svg>
                        </button>
                    </span>
                    <span className="editBtn">
                        <button>Save New Changes</button>
                    </span>
                </div>
            </div>
            <hr class="solid"></hr>
        </div>
        

    )
}