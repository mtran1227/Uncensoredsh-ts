import React from 'react';

const Account = () => {
  return (
    <div className="w-[1280px] h-[832px] relative bg-white overflow-hidden">
      {/* Navigation Bar */}
      <div className="w-40 h-7 left-[28px] top-[23.38px] absolute bg-blue-600" />
      <div className="w-40 h-8 left-[34px] top-[20px] absolute text-white text-xl font-normal font-['Propaganda']">UNCENSORED</div>
      <div className="left-[27px] top-[37px] absolute text-blue-600 text-5xl font-normal font-['Propaganda']">SH*TS</div>

      {/* Search Bar */}
      <div className="w-[1033px] h-11 pl-3 pr-4 py-2 left-[221px] top-[35px] absolute bg-gray-100 rounded-lg inline-flex items-center gap-3">
        <div className="w-6 h-6 relative">
          <div className="w-4 h-4 left-[3px] top-[3px] absolute outline outline-2 outline-offset-[-1px] outline-zinc-500" />
          <div className="w-1 h-1 left-[16.65px] top-[16.65px] absolute outline outline-2 outline-offset-[-1px] outline-zinc-500" />
        </div>
        <div className="flex-1 text-zinc-500 text-base font-normal font-['Inter'] leading-normal">Search</div>
      </div>

      {/* User Info Section */}
      <div className="left-[221px] top-[231px] absolute text-center text-blue-600 text-base font-medium font-['Inter'] leading-snug">the creators of this sh*t</div>
      <div className="w-40 h-40 left-[27px] top-[127px] absolute bg-blue-600 rounded-full" />
      <div className="left-[222px] top-[127px] absolute text-blue-600 text-3xl font-normal font-['Propaganda']">@uncensoredshts</div>
      <div className="left-[221px] top-[190px] absolute text-blue-600 text-2xl font-normal font-['Propaganda']">uncensored sh*ts</div>
      <div className="left-[221px] top-[270px] absolute text-blue-600 text-base font-['Inter']"><span className="font-bold">313 </span>friends</div>

      {/* Score Cards */}
      <div className="w-24 h-28 left-[872px] top-[134px] absolute bg-blue-600" />
      <div className="left-[882px] top-[249px] absolute text-blue-600 text-2xl font-medium font-['Inter'] leading-loose">sh*t in</div>
      <div className="w-24 h-28 left-[1121.51px] top-[134px] absolute bg-blue-600" />
      <div className="left-[1085px] top-[249px] absolute text-blue-600 text-2xl font-medium font-['Inter'] leading-loose text-right">want to sh*t in</div>
      <div className="w-14 h-24 left-[892.45px] top-[139.58px] absolute text-white text-7xl font-extrabold font-['FONTSPRING_DEMO_-_Vanguard_CF_Extra_Bold']">12</div>
      <div className="w-8 h-24 left-[1153.11px] top-[139.58px] absolute text-white text-7xl font-extrabold font-['FONTSPRING_DEMO_-_Vanguard_CF_Extra_Bold']">3</div>

      {/* Section Title */}
      <div className="w-72 h-12 left-[35px] top-[308px] absolute text-blue-600 text-xl font-normal font-['Propaganda']">FAVS</div>

      {/* Bathroom Listing Columns */}
      <div className="w-96 h-[644px] left-[27px] top-[335px] absolute bg-gray-100 rounded-t-3xl overflow-hidden">
        {/* Add bathroom cards */}
      </div>
      <div className="w-96 h-[644px] left-[457px] top-[335px] absolute bg-gray-100 rounded-t-3xl overflow-hidden">
        {/* Add bathroom cards */}
      </div>
      <div className="w-96 h-[644px] left-[886px] top-[333px] absolute bg-gray-100 rounded-t-3xl overflow-hidden">
        {/* Add bathroom cards */}
      </div>
    </div>
  );
};

export default Account;
