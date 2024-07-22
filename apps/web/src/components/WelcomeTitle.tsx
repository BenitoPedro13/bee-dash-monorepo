import useDataStore from '@/store';
import React from 'react'

const WelcomeTitle = () => {
    const session = useDataStore((state) => state.session);

  return (
    <div className="">
    <span className="flex-shrink-0 w-full h-auto whitespace-pre-wrap break-words relative font-Balgin-Text text-[#0f1728] text-[40px] font-semibold">
      Bem vindo,{" "}
    </span>
    <span className="flex-shrink-0 w-full h-auto whitespace-pre-wrap break-words relative font-Balgin-Display text-[#0f1728] text-[40px] font-semibold capitalize">
      {session.user.name}
    </span>
  </div>
  )
}

export default WelcomeTitle