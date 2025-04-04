import React from 'react';

const Home = () => {
  return (
    <div className="w-[1280px] h-[832px] relative bg-white overflow-hidden">
      {/* Navigation Bar */}
      <div className="w-40 h-7 left-[28px] top-[23px] absolute bg-blue-600" />
      <div className="w-40 h-8 left-[34px] top-[20px] absolute justify-start text-white text-xl font-normal font-['Propaganda']">UNCENSORED</div>
      <div className="left-[27px] top-[37px] absolute text-justify justify-start text-blue-600 text-5xl font-normal font-['Propaganda']">SH*TS</div>

      {/* Search Bar */}
      <div className="w-[954px] h-11 pl-3 pr-4 py-2 left-[221px] top-[35px] absolute bg-✦-_bg-bg-secondary rounded-lg inline-flex justify-start items-center gap-3">
        <div className="w-6 h-6 relative overflow-hidden">
          <div className="w-4 h-4 left-[3px] top-[3px] absolute outline outline-2 outline-offset-[-1px] outline-zinc-500" />
          <div className="w-1 h-1 left-[16.65px] top-[16.65px] absolute outline outline-2 outline-offset-[-1px] outline-zinc-500" />
        </div>
        <div className="flex-1 justify-start text-zinc-500 text-base font-normal font-['Inter'] leading-normal">Search</div>
      </div>

      {/* Top Buttons */}
      <div className="px-2.5 py-[5px] left-[28px] top-[117px] absolute rounded-md outline outline-1 outline-offset-[-1px] outline-✦-_border-border-default inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
        <div className="inline-flex justify-start items-center gap-1">
          <div className="w-4 h-4 relative overflow-hidden">
            <div className="w-4 h-3.5 left-[1.12px] top-[1.69px] absolute bg-blue-600" />
          </div>
          <div className="justify-start text-✦-_text-text-default/90 text-sm font-medium font-['Inter'] leading-snug">Favorites</div>
        </div>
      </div>
      <div className="px-2.5 py-[5px] left-[140px] top-[117px] absolute rounded-md outline outline-1 outline-offset-[-1px] outline-✦-_border-border-default inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
        <div className="inline-flex justify-start items-center gap-1">
          <div className="w-4 h-4 relative overflow-hidden">
            <div className="w-4 h-4 left-0 top-[1.12px] absolute bg-blue-600" />
          </div>
          <div className="justify-start text-zinc-900 text-sm font-medium font-['Inter'] leading-snug">History</div>
        </div>
      </div>
      <div className="px-2.5 py-[5px] left-[239px] top-[117px] absolute rounded-md outline outline-1 outline-offset-[-1px] outline-✦-_border-border-default inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
        <div className="inline-flex justify-start items-center gap-1">
          <div className="w-4 h-4 relative overflow-hidden">
            <div className="w-4 h-4 left-[0.75px] top-[1.50px] absolute bg-blue-600" />
          </div>
          <div className="justify-start text-zinc-900 text-sm font-medium font-['Inter'] leading-snug">Recs Nearby</div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="w-[790px] h-[620px] left-[28px] top-[178px] absolute rounded-lg outline outline-[10px] outline-offset-[-10px] outline-blue-600 overflow-hidden">
        <img className="w-[991px] h-[620px] left-[-96px] top-0 absolute" src="https://placehold.co/991x620" alt="Featured Bathroom" />
      </div>

      {/* Section Title */}
      <div className="w-72 h-12 left-[843px] top-[127px] absolute text-justify justify-start text-blue-600 text-xl font-normal font-['Propaganda']">
        have you ever tried...
      </div>

      {/* Bathroom Listings */}
      <div className="w-96 h-[644px] left-[835px] top-[154px] absolute bg-✦-_bg-bg-default rounded-tl-3xl rounded-tr-3xl overflow-hidden">
        {/* Bathrooms will go here */}
        {/* You can insert mapped bathrooms dynamically later */}
      </div>
    </div>
  );
};

export default Home;
