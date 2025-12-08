import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5001/api";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFriendQuery, setAddFriendQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await fetch(`${API_URL}/user/friends`, { headers: authHeaders() });
      const data = await res.json();
      const friendsList = (data || []).map((f) => ({
        _id: f._id,
        username: f.username,
        profilePhoto: f.profilePhoto,
        link: `/friends/${f.username}`,
      }));
      setFriends(friendsList);
      setFiltered(friendsList);
    } catch (err) {
      console.log("Error loading friends:", err);
      setFriends([]);
      setFiltered([]);
    }
  };

  // Filter existing friends when search query changes
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setFiltered(friends);
    } else {
      // Only filter existing friends
      const filteredFriends = friends.filter((f) => f.username.toLowerCase().includes(q));
      setFiltered(filteredFriends);
    }
  }, [query, friends]);

  // Search for new users when add friend query changes
  useEffect(() => {
    const q = addFriendQuery.trim();
    if (q.length >= 2) {
      searchUsers(q);
    } else {
      setSearchResults([]);
    }
  }, [addFriendQuery, friends]);

  const searchUsers = async (searchTerm) => {
    try {
      const res = await fetch(`${API_URL}/user/search-users?q=${encodeURIComponent(searchTerm)}`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      // Filter out users who are already friends
      const notFriends = (data || []).filter(
        (user) => !friends.some((f) => f._id === user._id)
      );
      setSearchResults(notFriends);
    } catch (err) {
      console.log("Error searching users:", err);
      setSearchResults([]);
    }
  };

  const addFriend = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/user/friends/${userId}`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await res.json();
      
      if (res.ok) {
        // Refresh friends list
        await fetchFriends();
        // Remove from search results
        setSearchResults(searchResults.filter((u) => u._id !== userId));
        // Clear search if no more results
        if (searchResults.length === 1) {
          setAddFriendQuery("");
        }
      } else {
        alert(data.error || "Failed to add friend");
      }
    } catch (err) {
      console.log("Error adding friend:", err);
      alert("Failed to add friend");
    }
  };


  return (
    <div className="p-8 max-w-4xl mx-auto bg-white">
      {/* Top bar */}
      <div className="flex items-center gap-6 mb-8">
        <Link to="/home" className="cursor-pointer">
          <div className="bg-blue-600 text-white px-3 py-1 inline-block rounded font-propaganda tracking-wide">
            UNCENSORED
          </div>
          <div className="text-blue-600 text-4xl font-propaganda leading-none tracking-wide">SH*TS</div>
        </Link>
        <Link to="/account" className="ml-auto text-blue-600 underline">
          ← Back to Account
        </Link>
      </div>

      {/* Title and Add Friend Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-blue-600 text-3xl font-propaganda">Friends</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
        >
          + Add Friend
        </button>
      </div>

      {/* Search Bar for Existing Friends */}
      <input
        type="text"
        placeholder="Search your friends by username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-3 bg-gray-100 rounded-lg outline-none mb-6"
      />

      {/* Friends List */}
      <div>
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((f, index) => {
            const descriptions = [
              "restroom reviewer",
              "toilet connoisseur",
              "bathroom explorer",
              "stall specialist",
              "facility finder",
              "restroom rater",
              "bathroom critic",
              "toilet tracker"
            ];
            const description = descriptions[index % descriptions.length];
            return (
              <Link
                key={f._id}
                to={f.link}
                className="border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:shadow transition"
              >
                {f.profilePhoto ? (
                  <img
                    src={f.profilePhoto}
                    alt={f.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                    {f.username.slice(0, 2)}
                  </div>
                )}
                <div>
                  <p className="text-blue-600 font-bold">@{f.username}</p>
                  <p className="text-xs text-gray-500">{description}</p>
                </div>
              </Link>
            );
          })}
          {filtered.length === 0 && query.trim() === "" && (
            <div className="col-span-2 text-gray-500">No friends yet. Click "Add Friend" to find and add friends!</div>
          )}
          {filtered.length === 0 && query.trim() !== "" && (
            <div className="col-span-2 text-gray-500">No friends found matching "{query}"</div>
          )}
        </div>
      </div>

      {/* Add Friend Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-blue-600 text-2xl font-propaganda">add your toilet buddies</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddFriendQuery("");
                  setSearchResults([]);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <input
              type="text"
              placeholder="Search for users by username..."
              value={addFriendQuery}
              onChange={(e) => setAddFriendQuery(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-lg outline-none mb-4"
            />
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {addFriendQuery.trim().length < 2 ? (
                <p className="text-gray-500 text-center py-4">Start typing to search for users...</p>
              ) : searchResults.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No users found.</p>
              ) : (
                searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow transition"
                  >
                    <div className="flex items-center gap-3">
                      {user.profilePhoto ? (
                        <img
                          src={user.profilePhoto}
                          alt={user.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                          {user.username.slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <p className="text-blue-600 font-bold">@{user.username}</p>
                        <p className="text-xs text-gray-500">user</p>
                      </div>
                    </div>
                    <button
                      onClick={() => addFriend(user._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                    >
                      Add Friend
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Friends;

