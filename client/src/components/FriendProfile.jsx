import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_URL = "http://localhost:5001/api";

const FriendProfile = () => {
  const { username } = useParams();
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  useEffect(() => {
    fetch(`${API_URL}/user/friend/${username}`, { headers: authHeaders() })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Friend not found");
        }
        return res.json();
      })
      .then((data) => {
        setFriend(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error loading friend:", err);
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <p className="text-blue-600">Loading...</p>
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Link to="/friends" className="text-blue-600 underline">
          ← Back to Friends
        </Link>
        <p className="mt-4 text-red-500">Friend not found.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link to="/home" className="cursor-pointer">
          <div className="bg-blue-600 text-white px-3 py-1 inline-block rounded font-propaganda tracking-wide">
            UNCENSORED
          </div>
          <div className="text-blue-600 text-4xl font-propaganda leading-none tracking-wide">SH*TS</div>
        </Link>
        <Link to="/friends" className="text-blue-600 underline">
          ← Back to Friends
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        {friend.profilePhoto ? (
          <img
            src={friend.profilePhoto}
            alt={friend.username}
            className="w-16 h-16 rounded-full object-cover border-4 border-blue-600"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
            {friend.username.slice(0, 2)}
          </div>
        )}
        <div>
          <p className="text-blue-600 font-bold text-2xl">@{friend.username}</p>
          <p className="text-gray-600">Bathroom buddy</p>
        </div>
      </div>

      <p className="text-gray-500">Friend profile</p>
    </div>
  );
};

export default FriendProfile;


