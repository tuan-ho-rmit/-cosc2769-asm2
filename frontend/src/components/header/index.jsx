import React from 'react'

export default function Header() {
  return (
      <>
        <div className='bg-grey text-center h-[50px] border-1 border-white flex flex-row items-center' >
          <div className='basis-1/3 justify-start mx-4'>
            <svg className="h-[30px] w-[30px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </div>
          <div className='basis-1/3 '>
            <form className='flex flex-nowrap justify-center'>
              <div>
                <input type='text' placeholder='Search..' name='search'
                       className="bg-black block w-[200px] h-[35px] rounded-md border-0 py-1.5 pl-7 pr-20 text-white
                       ring-inset ring-white placeholder:text-yellow placeholder:text-center text-center focus:ring-1 focus:ring-inset focus:ring-indigo-600
                       sm:text-title text-title sm:leading-6"/>
              </div>
              <div className='mx-4 content-center'>
                <button type="submit">
                  <svg className="h-[30px] w-[30px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>
          <div className='basis-1/3 flex flex-nowrap justify-end'>
            <div className='mx-8'>
              <svg className="h-[30px] w-[30px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <div className='mx-4'>
              <img src='https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-6/454539036_476839358283813_2967004303045072180_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=-9m-zIRhoLYQ7kNvgF3oBm_&_nc_ht=scontent.fhan4-3.fna&oh=00_AYAcyZp-BRKgTQ_HzRZA-G0OMKGRy4C84B3jhXkfw6A58g&oe=66C0DFF9'
                   className='w-10 h-10 ring-yellow ring-2 rounded-full' alt='rounded-avatar'/>
            </div>
          </div>
        </div>
      </>
  )
}
