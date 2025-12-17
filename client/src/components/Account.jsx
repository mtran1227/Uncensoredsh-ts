import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Account = () => {
  // --- USER STATE ---
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [friends, setFriends] = useState(0);
  const [shitInCount, setShitInCount] = useState(0);
  const [bucketListCount, setBucketListCount] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [bucketList, setBucketList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // Fallback history (auto-fill 4 bathrooms)
  const fallbackHistory = [
    {
      _id: "bobst-library-4f",
      name: "Bobst Library 4th Floor",
      address: "70 Washington Square S",
      averageRating: 3.5,
      image: "/bathroomphotos/bobst4th.png",
    },
    {
      _id: "kimmel-center-2f",
      name: "Kimmel Center 2nd Floor",
      address: "60 Washington Square S",
      averageRating: 4.0,
      image: "/bathroomphotos/kimmel2nd.png",
    },
    {
      _id: "palladium-2f",
      name: "Palladium 2nd Floor",
      address: "140 E 14th St",
      averageRating: 4.2,
      image: "/bathroomphotos/palladium2nd.png",
    },
    {
      _id: "metrotech-8f",
      name: "2 MetroTech 8th Floor",
      address: "2 MetroTech Center",
      averageRating: 4.9,
      image: "/bathroomphotos/2metrotech8thfloor.png",
    },
  ];

  // --- LOAD DATA FROM BACKEND ---
useEffect(() => {
    fetch("http://localhost:5001/api/user/account", { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => {
        setShitInCount(data.shitIn);
        setBucketListCount(data.bucketList);
        const cached = localStorage.getItem("profilePhotoCache");
        setProfilePhoto(data.profilePhoto || cached || null);
      })
      .catch((err) => console.log("Error loading user:", err));

    // Fetch friends list directly to get accurate count
    fetch("http://localhost:5001/api/user/friends", { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => {
        setFriends((data || []).length);
      })
      .catch((err) => {
        console.log("Error loading friends:", err);
        setFriends(0);
      });

    // favorites
    fetch("http://localhost:5001/api/user/favorites", { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => setFavorites(data || []))
      .catch((err) => console.log("Error loading favorites:", err));

    // bucket list - use same fallback as BucketList page
    const fallbackBucketList = [
      { _id: "bobst-library-4f", name: "Bobst Library 4th Floor", location: "70 Washington Square S", geoLocation: { address: "70 Washington Square S" }, averageRating: 3.5, images: [{ url: "/bathroomphotos/bobst4th.png" }] },
      { _id: "kimmel-center-2f", name: "Kimmel Center 2nd Floor", location: "60 Washington Square S", geoLocation: { address: "60 Washington Square S" }, averageRating: 4.0, images: [{ url: "/bathroomphotos/kimmel2nd.png" }] },
      { _id: "palladium-2f", name: "Palladium 2nd Floor", location: "140 E 14th St", geoLocation: { address: "140 E 14th St" }, averageRating: 4.2, images: [{ url: "/bathroomphotos/palladium2nd.png" }] },
      { _id: "metrotech-8f", name: "2 MetroTech 8th Floor", location: "2 MetroTech Center", geoLocation: { address: "2 MetroTech Center" }, averageRating: 4.9, images: [{ url: "/bathroomphotos/2metrotech8thfloor.png" }] },
      { _id: "silver-center-6f", name: "Silver Center 6th Floor", location: "100 Washington Square E", geoLocation: { address: "100 Washington Square E" }, averageRating: 3.8, images: [{ url: "/bathroomphotos/silvercenter.png" }] },
      { _id: "bobst-ll1", name: "Bobst Library LL1", location: "70 Washington Square S", geoLocation: { address: "70 Washington Square S" }, averageRating: 3.6, images: [{ url: "/bathroomphotos/bobstll1.png" }] },
      { _id: "bobst-2nd", name: "Bobst Library 2nd Floor", location: "70 Washington Square S", geoLocation: { address: "70 Washington Square S" }, averageRating: 3.7, images: [{ url: "/bathroomphotos/bobst2nd.png" }] },
      { _id: "bobst-5th", name: "Bobst Library 5th Floor", location: "70 Washington Square S", geoLocation: { address: "70 Washington Square S" }, averageRating: 3.9, images: [{ url: "/bathroomphotos/bobst5th.png" }] },
      { _id: "bobst-7th", name: "Bobst Library 7th Floor", location: "70 Washington Square S", geoLocation: { address: "70 Washington Square S" }, averageRating: 4.1, images: [{ url: "/bathroomphotos/bobst7th.png" }] },
      { _id: "kimmel-8th", name: "Kimmel Center 8th Floor", location: "60 Washington Square S", geoLocation: { address: "60 Washington Square S" }, averageRating: 4.3, images: [{ url: "/bathroomphotos/kimmel8th.png" }] },
      { _id: "stern-4th", name: "Stern 4th Floor", location: "44 W 4th St", geoLocation: { address: "44 W 4th St" }, averageRating: 3.8, images: [{ url: "/bathroomphotos/stern4th.png" }] },
      { _id: "studentlink", name: "StudentLink Center", location: "383 Lafayette St", geoLocation: { address: "383 Lafayette St" }, averageRating: 3.7, images: [{ url: "/bathroomphotos/studentlink.png" }] },
    ];

    fetch("http://localhost:5001/api/user/bucket", { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => {
        // Combine API data with fallback, avoiding duplicates (to match BucketList page behavior)
        const apiData = data && Array.isArray(data) ? data : [];
        const normalizeId = (id) => {
          if (!id) return null;
          if (typeof id === 'string') return id.toLowerCase().trim();
          if (id._id) return id._id.toString().toLowerCase().trim();
          if (id.toString) return id.toString().toLowerCase().trim();
          return null;
        };
        const normalizeName = (name) => {
          if (!name) return '';
          return name.toLowerCase().trim().replace(/\s+/g, ' ');
        };
        const isDuplicate = (b1, b2) => {
          const id1 = normalizeId(b1._id || b1);
          const id2 = normalizeId(b2._id || b2);
          if (id1 && id2 && id1 === id2) return true;
          const name1 = normalizeName(b1.name);
          const name2 = normalizeName(b2.name);
          if (name1 && name2 && name1 === name2) return true;
          return false;
        };
        
        // Remove duplicates from API data
        const seenIds = new Set();
        const uniqueApiData = apiData.filter(b => {
          const id = normalizeId(b._id || b);
          if (!id || seenIds.has(id)) return false;
          seenIds.add(id);
          return true;
        });
        
        // Filter fallback to avoid duplicates (check both ID and name)
        const fallbackToAdd = fallbackBucketList.filter(fallbackBathroom => {
          return !uniqueApiData.some(apiBathroom => 
            isDuplicate(apiBathroom, fallbackBathroom)
          );
        });
        
        // Final deduplication pass
        const finalSeen = new Set();
        const finalBucketList = [...uniqueApiData, ...fallbackToAdd].filter(b => {
          const id = normalizeId(b._id || b);
          const name = normalizeName(b.name);
          const key = `${id || ''}|${name || ''}`;
          if (!key || finalSeen.has(key)) return false;
          for (const seenKey of finalSeen) {
            const [seenId, seenName] = seenKey.split('|');
            if ((id && seenId && id === seenId) || (name && seenName && name === seenName)) {
              return false;
            }
          }
          finalSeen.add(key);
          return true;
        });
        
        setBucketList(finalBucketList);
        // Update count to match actual bucket list length
        setBucketListCount(finalBucketList.length);
      })
      .catch((err) => {
        console.log("Error loading bucket list:", err);
        setBucketList(fallbackBucketList);
        setBucketListCount(fallbackBucketList.length);
      });
  }, []);
  // --- HANDLE PHOTO UPLOAD ---
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // preview in UI
    const reader = new FileReader();
    reader.onload = () => setProfilePhoto(reader.result);
    reader.readAsDataURL(file);

    // send base64 to backend so it persists
    reader.onloadend = () => {
      localStorage.setItem("profilePhotoCache", reader.result);
      fetch("http://localhost:5001/api/user/uploadPhoto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ photo: reader.result }),
      }).catch((err) => console.log("Error uploading photo:", err));
    };
  };

  const renderCardImage = (item) =>
    item?.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80";

  const historyList = favorites.length > 0
    ? favorites.map(f => ({
        _id: f._id,
        name: f.name,
        address: f.geoLocation?.address || f.location || "NYU Campus",
        averageRating: f.averageRating || 0,
        image: renderCardImage(f),
      }))
    : fallbackHistory;

  // Filter history list based on search term
  const filteredHistoryList = historyList.filter((b) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      b.name?.toLowerCase().includes(q) ||
      (b.address || "").toLowerCase().includes(q)
    );
  });

  const displayShitIn = historyList.length || shitInCount;
  // Use the actual bucket list length (after deduplication) to match what's displayed
  const displayBucket = bucketList.length;

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white">
      {/* Top bar with logo */}
      <div className="mb-6">
        <Link to="/home" className="cursor-pointer inline-block">
          <div className="bg-blue-600 text-white px-3 py-1 inline-block rounded font-propaganda tracking-wide">
            UNCENSORED
          </div>
          <div className="text-blue-600 text-5xl font-propaganda leading-none tracking-wide">SH*TS</div>
        </Link>
      </div>

      {/* Main content: Profile and Stats side by side */}
      <div className="flex items-start justify-between gap-8 mb-6">
        {/* Left side: Profile */}
        <div className="flex flex-col items-start gap-4">
          <div className="relative w-32 h-32">
            <label className="cursor-pointer block w-full h-full">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-100 border-4 border-blue-600 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-4xl uppercase">
                    MA
                  </span>
                </div>
              )}
              <input type="file" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>

          <div>
            <h2 className="text-blue-600 text-4xl font-uncensored leading-tight mb-1">@maish*tsnyc</h2>
            <p className="text-blue-600 text-lg mb-1">Senior Bathroom Analyst</p>
            <p className="text-blue-600 text-sm">Class of '27 · Tandon School of Engineering</p>
          </div>
        </div>

        {/* Right side: Stats and Bucketlist */}
        <div className="flex flex-col items-end gap-4">
          <div className="flex items-center gap-4">
            <Link to="/account" className="w-40 h-48 bg-blue-600 text-white rounded-xl flex flex-col items-center justify-center shadow">
              <span className="text-6xl font-bold">{displayShitIn}</span>
              <span className="text-base mt-2">sh*t in</span>
            </Link>
            <div className="w-40 h-48 bg-blue-600 text-white rounded-xl flex flex-col items-center justify-center shadow">
              <span className="text-6xl font-bold">{displayBucket}</span>
              <span className="text-base mt-2 text-center px-2">want to sh*t in</span>
            </div>
            <Link to="/friends" className="w-40 h-48 bg-blue-100 text-blue-600 rounded-xl flex flex-col items-center justify-center shadow">
              <span className="text-5xl font-bold">{friends}</span>
              <span className="text-base mt-2 text-center px-2">friends</span>
            </Link>
          </div>
          <Link
            to="/bucketlist"
            className="w-full bg-blue-600 text-white rounded-xl font-propaganda font-bold text-xl py-6 text-center hover:bg-blue-700 transition shadow"
          >
            Bucketlist
          </Link>
        </div>
      </div>

      {/* History section */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-blue-600 text-2xl font-propaganda whitespace-nowrap">HISTORY</h2>
          <div className="flex-1 flex justify-end">
            <input
              type="text"
              placeholder="Search for a bathroom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[512px] px-4 py-2 bg-gray-100 rounded-lg outline-none"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {filteredHistoryList.length === 0 && searchTerm.trim() === "" && <div className="col-span-3 text-gray-500">No history yet.</div>}
        {filteredHistoryList.length === 0 && searchTerm.trim() !== "" && <div className="col-span-3 text-gray-500">No bathrooms found matching "{searchTerm}".</div>}
        {filteredHistoryList.map((b) => (
          <Link
            to={`/bathrooms/${b._id}`}
            key={b._id}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <img
              src={b.image}
              alt={b.name}
              className="w-full h-32 object-cover"
            />
            <div className="p-3">
              <div className="text-blue-600 font-bold text-sm mb-1 flex items-center gap-2">
                {b.name}
              </div>
              <p className="text-gray-500 text-xs">
                {b.address}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="text-blue-600 font-bold text-lg flex items-center gap-1">
                  {(b.averageRating || 0).toFixed(1)} ⭐
                </div>
                <button className="px-4 py-1 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700">
                  visit
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default Account;