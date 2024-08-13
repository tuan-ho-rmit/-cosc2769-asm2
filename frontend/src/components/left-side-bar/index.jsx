import React from 'react'

export default function LeftSideBar() {
  return (
      <>
        <div className='w-[250px] bg-black relative left-0'>
            <div>Home</div>
            <div>Groups</div>
            <div>Friends</div>
            <div>Log Out</div>
        </div>
        {/*<div className='w-[250px] bg-black absolute inset-y-0 right-0'>RightSideBar</div>*/}
      </>
  )
}
