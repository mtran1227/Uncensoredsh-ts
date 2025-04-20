import React from 'react';
import { Link } from 'react-router-dom';

const Account = () => {
  return (
    <div className="w-[1280px] h-[832px] relative bg-white overflow-hidden">
      {/* Navigation Bar */}
      <div className="flex gap-4 absolute top-[20px] left-[28px] z-50">
        <Link to="/" className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
          Home
        </Link>
        <Link to="/favorites" className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-800 hover:bg-blue-600 hover:text-white">
          Favorites
        </Link>
        <Link to="/history" className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-800 hover:bg-blue-600 hover:text-white">
          History
        </Link>
        <Link to="/recs" className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-800 hover:bg-blue-600 hover:text-white">
          Recs Nearby
        </Link>
      </div>

      {/* Everything else shifted DOWN */}
      <div className="mt-28 relative">
        {/* Branding (UNCENSORED SH*TS title) */}
        <div className="absolute left-7 top-5 flex flex-col leading-none">
  <div className="text-white text-xl font-boldonse">UNCENSORED</div>
  <div className="text-blue-600 text-5xl font-propaganda">SH*TS</div>
</div>

        {/* Search Bar */}
        <div className="w-[1033px] h-11 pl-3 pr-4 py-2 left-[221px] top-[70px] absolute bg-gray-100 rounded-lg inline-flex items-center gap-3">
          <div className="w-6 h-6 relative">
            <div className="w-4 h-4 left-[3px] top-[3px] absolute outline outline-2 outline-offset-[-1px] outline-zinc-500" />
            <div className="w-1 h-1 left-[16.65px] top-[16.65px] absolute outline outline-2 outline-offset-[-1px] outline-zinc-500" />
          </div>
          <div className="flex-1 text-zinc-500 text-base font-normal font-['Inter'] leading-normal">
            Search
          </div>
        </div>

        {/* User Info */}
        <div className="left-[221px] top-[266px] absolute text-center text-blue-600 text-base font-medium font-['Inter'] leading-snug">
          the creators of this sh*t
        </div>
        <div className="w-40 h-40 left-[27px] top-[162px] absolute bg-blue-600 rounded-full" />
        <div className="left-[222px] top-[162px] absolute text-blue-600 text-3xl font-normal font-['Propaganda']">
          @mai_shts
        </div>
        <div className="left-[221px] top-[225px] absolute text-blue-600 text-2xl font-normal font-['Propaganda']">
          NYU's resident toilet tour guide
        </div>
        <div className="left-[221px] top-[305px] absolute text-blue-600 text-base font-['Inter']">
          <span className="font-bold">313 </span>friends
        </div>

        {/* Score Cards */}
        <div className="w-24 h-28 left-[872px] top-[169px] absolute bg-blue-600" />
        <div className="left-[882px] top-[284px] absolute text-blue-600 text-2xl font-medium font-['Inter'] leading-loose">
          sh*t in
        </div>
        <div className="w-24 h-28 left-[1121px] top-[169px] absolute bg-blue-600" />
        <div className="left-[1085px] top-[284px] absolute text-blue-600 text-2xl font-medium font-['Inter'] leading-loose text-right">
          want to sh*t in
        </div>
        <div className="w-14 h-24 left-[892px] top-[175px] absolute text-white text-7xl font-extrabold font-['FONTSPRING_DEMO_-_Vanguard_CF_Extra_Bold']">
          12
        </div>
        <div className="w-8 h-24 left-[1153px] top-[175px] absolute text-white text-7xl font-extrabold font-['FONTSPRING_DEMO_-_Vanguard_CF_Extra_Bold']">
          3
        </div>

        {/* Section Title */}
        <div className="w-72 h-12 left-[35px] top-[343px] absolute text-blue-600 text-xl font-normal font-['Propaganda']">
          FAVORITES:
        </div>

        {/* Bathroom Listings */}
        <div className="w-96 h-[644px] left-[27px] top-[370px] absolute bg-gray-100 rounded-t-3xl overflow-hidden" />
        <div className="w-96 h-[644px] left-[457px] top-[370px] absolute bg-gray-100 rounded-t-3xl overflow-hidden" />
        <div className="w-96 h-[644px] left-[886px] top-[368px] absolute bg-gray-100 rounded-t-3xl overflow-hidden" />
      </div>
    </div>
  );
};

export default Account;
