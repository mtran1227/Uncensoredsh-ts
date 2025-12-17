import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import RatingStars from "./RatingStars";

const API_URL = "http://localhost:5001/api";

const BathroomProfile = () => {
  const { id } = useParams();
  const [bathroom, setBathroom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const ratingCount = reviews.length;
  const avg =
    ratingCount > 0
      ? reviews.reduce((sum, r) => sum + (r.ratings?.overall || 0), 0) / ratingCount
      : bathroom?.averageRating ?? 0;

  const topWords = () => {
    if (!reviews.length) return [];
    const stop = new Set(["the", "and", "for", "with", "that", "this", "have", "would", "could"]);
    const counts = {};
    reviews.forEach((r) => {
      const words = (r.comment || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3 && !stop.has(w));
      words.forEach((w) => {
        counts[w] = (counts[w] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([w]) => w);
  };

  const descriptorWords = topWords();

  const fallbackBathrooms = {
    "silver-center": { _id: "silver-center", name: "Silver Center", location: "100 Washington Square E", geoLocation: { address: "100 Washington Square E" }, averageRating: 0 },
    "kimmel-center": { _id: "kimmel-center", name: "Kimmel Center for University Life", location: "60 Washington Sq S", geoLocation: { address: "60 Washington Sq S" }, averageRating: 0 },
    "kimmel-center-2f": { _id: "kimmel-center-2f", name: "Kimmel Center 2nd Floor", location: "60 Washington Square S", geoLocation: { address: "60 Washington Square S" }, averageRating: 4.0, images: [{ url: "/bathroomphotos/kimmel2nd.png" }] },
    "courant-warren-weaver": { _id: "courant-warren-weaver", name: "Warren Weaver Hall (Courant Institute)", location: "251 Mercer St", geoLocation: { address: "251 Mercer St" }, averageRating: 0 },
    "brown-building": { _id: "brown-building", name: "Brown Building", location: "29 Washington Pl", geoLocation: { address: "29 Washington Pl" }, averageRating: 0 },
    "gcasl": { _id: "gcasl", name: "GCASL", location: "238 Thompson St", geoLocation: { address: "238 Thompson St" }, averageRating: 0 },
    "king-juan-carlos": { _id: "king-juan-carlos", name: "King Juan Carlos I Center", location: "53 Washington Sq S", geoLocation: { address: "53 Washington Sq S" }, averageRating: 0 },
    "bobst-library": { _id: "bobst-library", name: "Bobst Library", location: "70 Washington Sq S", geoLocation: { address: "70 Washington Sq S" }, averageRating: 0, images: [{ url: "/bathroomphotos/bobst4th.png" }] },
    "bobst-library-4f": { _id: "bobst-library-4f", name: "Bobst Library 4th Floor", location: "70 Washington Square S", geoLocation: { address: "70 Washington Square S" }, averageRating: 3.5, images: [{ url: "/bathroomphotos/bobst4th.png" }] },
    "bobst-ll1": { _id: "bobst-ll1", name: "Bobst Library LL1", location: "70 Washington Square S", geoLocation: { address: "70 Washington Square S" }, averageRating: 3.6, images: [{ url: "/bathroomphotos/bobstll1.png" }] },
    "bobst-2nd": { _id: "bobst-2nd", name: "Bobst Library 2nd Floor", location: "70 Washington Square S", geoLocation: { address: "70 Washington Square S" }, averageRating: 3.7, images: [{ url: "/bathroomphotos/bobst2nd.png" }] },
    "bobst-5th": { _id: "bobst-5th", name: "Bobst Library 5th Floor", location: "70 Washington Square S", geoLocation: { address: "70 Washington Square S" }, averageRating: 3.9, images: [{ url: "/bathroomphotos/bobst5th.png" }] },
    "bobst-7th": { _id: "bobst-7th", name: "Bobst Library 7th Floor", location: "70 Washington Square S", geoLocation: { address: "70 Washington Square S" }, averageRating: 4.1, images: [{ url: "/bathroomphotos/bobst7th.png" }] },
    "palladium-2f": { _id: "palladium-2f", name: "Palladium 2nd Floor", location: "140 E 14th St", geoLocation: { address: "140 E 14th St" }, averageRating: 4.2, images: [{ url: "/bathroomphotos/palladium2nd.png" }] },
    "metrotech-8f": { _id: "metrotech-8f", name: "2 MetroTech 8th Floor", location: "2 MetroTech Center", geoLocation: { address: "2 MetroTech Center" }, averageRating: 4.9, images: [{ url: "/bathroomphotos/2metrotech8thfloor.png" }] },
    "kimmel-8th": { _id: "kimmel-8th", name: "Kimmel Center 8th Floor", location: "60 Washington Square S", geoLocation: { address: "60 Washington Square S" }, averageRating: 4.3, images: [{ url: "/bathroomphotos/kimmel8th.png" }] },
    "stern-4th": { _id: "stern-4th", name: "Stern 4th Floor", location: "44 W 4th St", geoLocation: { address: "44 W 4th St" }, averageRating: 3.8, images: [{ url: "/bathroomphotos/stern4th.png" }] },
    "studentlink": { _id: "studentlink", name: "StudentLink Center", location: "383 Lafayette St", geoLocation: { address: "383 Lafayette St" }, averageRating: 3.7, images: [{ url: "/bathroomphotos/studentlink.png" }] },
    "silver-center-6f": { _id: "silver-center-6f", name: "Silver Center 6th Floor", location: "100 Washington Square E", geoLocation: { address: "100 Washington Square E" }, averageRating: 3.8, images: [{ url: "/bathroomphotos/silvercenter.png" }] },
    "steinhardt-education": { _id: "steinhardt-education", name: "Steinhardt Education Building", location: "35 W 4th St", geoLocation: { address: "35 W 4th St" }, averageRating: 0 },
    "steinhardt-pless": { _id: "steinhardt-pless", name: "Steinhardt Pless Hall", location: "82 Washington Square E", geoLocation: { address: "82 Washington Square E" }, averageRating: 0 },
    "vanderbilt-hall": { _id: "vanderbilt-hall", name: "Vanderbilt Hall (NYU Law)", location: "40 Washington Sq S", geoLocation: { address: "40 Washington Sq S" }, averageRating: 0 },
    "furman-hall": { _id: "furman-hall", name: "Furman Hall (NYU Law)", location: "245 Sullivan St", geoLocation: { address: "245 Sullivan St" }, averageRating: 0 },
    "dagostino-hall": { _id: "dagostino-hall", name: "D'Agostino Hall (NYU Law)", location: "110 W 3rd St", geoLocation: { address: "110 W 3rd St" }, averageRating: 0 },
    "sps-building": { _id: "sps-building", name: "SPS Building", location: "7 E 12th St", geoLocation: { address: "7 E 12th St" }, averageRating: 0 },
    "gallatin-school": { _id: "gallatin-school", name: "Gallatin School", location: "1 Washington Pl", geoLocation: { address: "1 Washington Pl" }, averageRating: 0 },
    "tisch-arts": { _id: "tisch-arts", name: "Tisch School of the Arts", location: "721 Broadway", geoLocation: { address: "721 Broadway" }, averageRating: 0 },
    "tisch-theatre": { _id: "tisch-theatre", name: "Tisch Building (Theatre)", location: "111 2nd Ave", geoLocation: { address: "111 2nd Ave" }, averageRating: 0 },
    "tisch-dance": { _id: "tisch-dance", name: "Tisch Dance Annex", location: "111 2nd Ave Annex", geoLocation: { address: "111 2nd Ave Annex" }, averageRating: 0 },
    "arch-urban-design": { _id: "arch-urban-design", name: "Architecture & Urban Design", location: "370 Jay St, Brooklyn", geoLocation: { address: "370 Jay St" }, averageRating: 0 },
    "stern-kmc": { _id: "stern-kmc", name: "Stern School of Business – KMC", location: "44 W 4th St", geoLocation: { address: "44 W 4th St" }, averageRating: 0 },
    "stern-tisch-hall": { _id: "stern-tisch-hall", name: "Stern Tisch Hall", location: "40 W 4th St", geoLocation: { address: "40 W 4th St" }, averageRating: 0 },
    "palladium-athletic": { _id: "palladium-athletic", name: "Palladium Athletic Facility", location: "140 E 14th St", geoLocation: { address: "140 E 14th St" }, averageRating: 0 },
    "404-fitness": { _id: "404-fitness", name: "404 Fitness", location: "404 Lafayette St", geoLocation: { address: "404 Lafayette St" }, averageRating: 0 },
    "nyu-bookstore": { _id: "nyu-bookstore", name: "NYU Bookstore", location: "726 Broadway", geoLocation: { address: "726 Broadway" }, averageRating: 0 },
    "studentlink-center": { _id: "studentlink-center", name: "StudentLink Center", location: "383 Lafayette St", geoLocation: { address: "383 Lafayette St" }, averageRating: 0 },
    "arc": { _id: "arc", name: "Academic Resource Center (ARC)", location: "18 Washington Pl", geoLocation: { address: "18 Washington Pl" }, averageRating: 0 },
    "founders-hall": { _id: "founders-hall", name: "Founders Hall", location: "120 E 12th St", geoLocation: { address: "120 E 12th St" }, averageRating: 0 },
    "palladium-hall": { _id: "palladium-hall", name: "Palladium Hall", location: "140 E 14th St", geoLocation: { address: "140 E 14th St" }, averageRating: 0 },
    "brittany-hall": { _id: "brittany-hall", name: "Brittany Hall", location: "55 E 10th St", geoLocation: { address: "55 E 10th St" }, averageRating: 0 },
    "goddard-hall": { _id: "goddard-hall", name: "Goddard Hall", location: "79 Washington Sq E", geoLocation: { address: "79 Washington Sq E" }, averageRating: 0 },
    "lipton-hall": { _id: "lipton-hall", name: "Lipton Hall", location: "33 Washington Sq W", geoLocation: { address: "33 Washington Sq W" }, averageRating: 0 },
    "third-north": { _id: "third-north", name: "Third North", location: "75 3rd Ave", geoLocation: { address: "75 3rd Ave" }, averageRating: 0 },
    "university-hall": { _id: "university-hall", name: "University Hall", location: "110 E 14th St", geoLocation: { address: "110 E 14th St" }, averageRating: 0 },
    "carlyle-court": { _id: "carlyle-court", name: "Carlyle Court", location: "25 Union Square W", geoLocation: { address: "25 Union Square W" }, averageRating: 0 },
    "greenwich-hall": { _id: "greenwich-hall", name: "Greenwich Hall", location: "536 LaGuardia Pl", geoLocation: { address: "536 LaGuardia Pl" }, averageRating: 0 },
    "rubin-hall": { _id: "rubin-hall", name: "Rubin Hall", location: "35 Fifth Ave", geoLocation: { address: "35 Fifth Ave" }, averageRating: 0 },
    "weinstein-hall": { _id: "weinstein-hall", name: "Weinstein Hall", location: "5 University Pl", geoLocation: { address: "5 University Pl" }, averageRating: 0 },
    "clark-street-res": { _id: "clark-street-res", name: "Clark Street Residence", location: "55 Clark St, Brooklyn, NY", geoLocation: { address: "55 Clark St, Brooklyn" }, averageRating: 0 },
    "jacobs-jab": { _id: "jacobs-jab", name: "Jacobs Academic Building (2 MetroTech)", location: "2 MetroTech Center, Brooklyn, NY 11201", geoLocation: { address: "2 MetroTech Center" }, averageRating: 0 },
    "rogers-hall": { _id: "rogers-hall", name: "Rogers Hall (6 MetroTech)", location: "6 MetroTech Center, Brooklyn, NY 11201", geoLocation: { address: "6 MetroTech Center" }, averageRating: 0 },
    "370-jay": { _id: "370-jay", name: "370 Jay Street", location: "370 Jay St, Brooklyn, NY 11201", geoLocation: { address: "370 Jay St" }, averageRating: 0 },
    "5-metrotech": { _id: "5-metrotech", name: "5 MetroTech Center", location: "5 MetroTech Center, Brooklyn NY 11201", geoLocation: { address: "5 MetroTech Center" }, averageRating: 0 },
    "makerspace": { _id: "makerspace", name: "NYU MakerSpace", location: "6 MetroTech Center, Brooklyn NY 11201", geoLocation: { address: "6 MetroTech Center" }, averageRating: 0 },
    "dibner-library": { _id: "dibner-library", name: "Bern Dibner Library", location: "5 MetroTech Center, Brooklyn NY 11201", geoLocation: { address: "5 MetroTech Center" }, averageRating: 0 },
    "urban-future-lab": { _id: "urban-future-lab", name: "Urban Future Lab", location: "15 MetroTech Center, Brooklyn NY", geoLocation: { address: "15 MetroTech Center" }, averageRating: 0 },
    "othmer-residence": { _id: "othmer-residence", name: "Othmer Residence Hall", location: "101 Johnson St, Brooklyn NY 11201", geoLocation: { address: "101 Johnson St" }, averageRating: 0 },
    "hassenfeld-hospital": { _id: "hassenfeld-hospital", name: "Hassenfeld Children's Hospital", location: "160 E 34th St", geoLocation: { address: "160 E 34th St" }, averageRating: 0 },
    "harkness-pavilion": { _id: "harkness-pavilion", name: "Harkness Pavilion", location: "105 E 17th St", geoLocation: { address: "105 E 17th St" }, averageRating: 0 },
    "perelman-center": { _id: "perelman-center", name: "Perelman Center", location: "570 1st Ave", geoLocation: { address: "570 1st Ave" }, averageRating: 0 },
    "skirball-institute": { _id: "skirball-institute", name: "Skirball Institute", location: "540 1st Ave", geoLocation: { address: "540 1st Ave" }, averageRating: 0 },
    "smilow-research": { _id: "smilow-research", name: "Smilow Research Center", location: "522 1st Ave", geoLocation: { address: "522 1st Ave" }, averageRating: 0 },
    "tisch-hospital": { _id: "tisch-hospital", name: "Tisch Hospital", location: "550 1st Ave", geoLocation: { address: "550 1st Ave" }, averageRating: 0 },
    "kimmel-pavilion": { _id: "kimmel-pavilion", name: "Kimmel Pavilion", location: "30th St & 1st Ave", geoLocation: { address: "30th St & 1st Ave" }, averageRating: 0 },
    "ambulatory-care-center": { _id: "ambulatory-care-center", name: "Ambulatory Care Center (ACC)", location: "240 E 38th St", geoLocation: { address: "240 E 38th St" }, averageRating: 0 },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [b, r] = await Promise.all([
          axios.get(`${API_URL}/bathrooms/${id}`),
          axios.get(`${API_URL}/ratings/bathroom/${id}`),
        ]);
        setBathroom(b.data);
        setReviews(r.data);
        
        // Preload user's existing review if they have one and bathroom is in their history
        if (user && token) {
          try {
            // Check if bathroom is in user's history (favorites)
            const favoritesRes = await axios.get(`${API_URL}/user/favorites`, {
              headers: authHeaders
            });
            const favorites = favoritesRes.data || [];
            const bathroomId = b.data?._id || id;
            
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
            
            const isInHistory = favorites.some(fav => {
              const favId = normalizeId(fav._id || fav);
              const bathroomIdStr = normalizeId(bathroomId);
              const favName = normalizeName(fav.name);
              const bathroomName = normalizeName(b.data?.name);
              
              return (favId && bathroomIdStr && favId === bathroomIdStr) ||
                     (favName && bathroomName && favName === bathroomName);
            });
            
            // If bathroom is in history, find and preload user's review
            if (isInHistory && r.data && Array.isArray(r.data)) {
              const myReview = r.data.find(rev => {
                // Match by userId
                if (rev.userId) {
                  const revUserId = rev.userId._id ? rev.userId._id.toString() : rev.userId.toString();
                  const currentUserId = (user.id || user._id)?.toString();
                  if (revUserId && currentUserId && revUserId === currentUserId) {
                    return true;
                  }
                }
                // Match by email
                if (rev.userEmail && user.email && rev.userEmail.toLowerCase() === user.email.toLowerCase()) {
                  return true;
                }
                // Match by username
                if (rev.userName && user.username && rev.userName.toLowerCase() === user.username.toLowerCase()) {
                  return true;
                }
                return false;
              });
              
              // Preload the review into the form
              if (myReview) {
                setRating(myReview.ratings?.overall || 0);
                setComment(myReview.comment || "");
              }
            }
          } catch (err) {
            console.error("Error checking history or preloading review:", err);
          }
        }
      } catch (err) {
        console.error("Fetch error", err);
        // Try fallback bathroom
        if (fallbackBathrooms[id]) {
          setBathroom(fallbackBathrooms[id]);
          setReviews([]);
        } else {
          // If not found in fallback, still set loading to false so error message shows
          setBathroom(null);
          setReviews([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must sign in to leave a rating.");
      return;
    }

    try {
      setSaving(true);
      await axios.post(`${API_URL}/ratings`, {
        bathroomId: id,
        userId: user.id,
        userEmail: user.email,
        userName: user.username,
        ratings: {
          overall: rating,
          cleanliness: rating,
          privacy: rating,
          smell: rating,
        },
        comment,
      });

      const r = await axios.get(`${API_URL}/ratings/bathroom/${id}`);
      setReviews(r.data);
      setRating(0);
      setComment("");
      setMessage("Review submitted! This bathroom has been added to your history.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Submit failed");
    } finally {
      setSaving(false);
    }
  };

  const toggleFavorite = async () => {
    if (!token) return alert("Sign in first");
    try {
      await axios.post(`${API_URL}/user/favorites/${id}`, {}, { headers: authHeaders });
      setMessage("Updated favorites");
    } catch (err) {
      alert(err.response?.data?.error || "Favorite toggle failed");
    }
  };

  const toggleBucket = async () => {
    if (!token) return alert("Sign in first");
    try {
      await axios.post(`${API_URL}/user/bucket/${id}`, {}, { headers: authHeaders });
      setMessage("Updated bucket list");
    } catch (err) {
      alert(err.response?.data?.error || "Bucket toggle failed");
    }
  };

  if (loading) return <p className="p-6 text-blue-600">Loading...</p>;
  if (!bathroom) return <p className="p-6 text-red-500">Bathroom not found.</p>;

  const photo =
    bathroom.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1582719478248-54e9f2af78f1?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="min-h-screen bg-white px-10 py-8">
      {/* Top logo + actions */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/home" className="cursor-pointer">
          <div className="bg-blue-600 text-white px-3 py-1 inline-block rounded font-propaganda tracking-wide">
            UNCENSORED
          </div>
          <div className="text-blue-600 text-4xl font-propaganda leading-none tracking-wide">SH*TS</div>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleBucket}
            className="px-4 py-2 rounded bg-blue-600 text-white font-propaganda font-bold hover:bg-blue-700"
          >
            Add to Bucket List
          </button>
          {message && <span className="text-sm text-gray-600">{message}</span>}
        </div>
      </div>

      {/* Hero section */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7">
          <img
            src={photo}
            alt={bathroom.name}
            className="w-full h-[420px] object-cover rounded-2xl border border-gray-200"
          />

          <h1 className="text-blue-600 text-4xl font-propaganda leading-tight mt-6 mb-2">
            {bathroom.name.split(/(\d+)/).map((part, i) => 
              /^\d+$/.test(part) ? (
                <span key={i} className="font-sans">{part}</span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </h1>
          <p className="text-gray-700 mb-4">
            {(() => {
              const geo = bathroom.geoLocation;
              if (geo) {
                const parts = [];
                if (geo.address) parts.push(geo.address);
                if (geo.building && !geo.address?.includes(geo.building)) parts.push(geo.building);
                if (geo.floor) parts.push(geo.floor);
                // Add city, state, zip if not already in address
                const addressLower = (geo.address || '').toLowerCase();
                if (geo.city && !addressLower.includes(geo.city.toLowerCase())) {
                  parts.push(geo.city);
                }
                if (geo.state && !addressLower.includes(geo.state.toLowerCase())) {
                  parts.push(geo.state);
                }
                if (geo.zipCode && !addressLower.includes(geo.zipCode)) {
                  parts.push(geo.zipCode);
                }
                // If no city/state/zip in geoLocation, add default NYU location info
                if (parts.length === 1 && geo.address && !geo.city) {
                  parts.push('New York, NY');
                }
                return parts.length > 0 ? parts.join(', ') : bathroom.location || 'NYU Campus, New York, NY';
              }
              // Fallback: add city/state if location exists but no geoLocation
              const location = bathroom.location || 'NYU Campus';
              return location.includes('New York') || location.includes('NY') 
                ? location 
                : `${location}, New York, NY`;
            })()}
          </p>

          <div className="flex items-center gap-6 mb-6">
            <div className="w-28 h-28 bg-blue-600 text-white rounded-xl flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{avg.toFixed(1)}</span>
              <span className="text-xs uppercase tracking-wide">sh*ttability</span>
            </div>
            <div className="flex-1">
              <ul className="text-blue-600 text-lg space-y-1">
                <li>✱ Clean</li>
                <li>✱ Spacious</li>
                <li>✱ Private</li>
              </ul>
            </div>
          </div>

          {/* Rating form */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h3 className="text-blue-600 font-propaganda text-2xl mb-2 text-center">Been here?</h3>
            <p className="text-gray-700 mb-3 text-center">Give your own rating:</p>
            <RatingStars value={rating} onChange={(val) => setRating(val)} />

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Write your review..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
                
                {/* Photo Upload Button */}
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setPhotos(files);
                        setUploadingPhotos(files.length > 0);
                      }}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">+</span>
                      </div>
                      <span className="text-blue-600 font-propaganda font-bold">
                        {uploadingPhotos ? `UPLOADING PHOTOS (${photos.length})` : "UPLOADING PHOTOS"}
                      </span>
                    </div>
                  </label>
                </div>

                {/* Display selected photos */}
                {photos.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Preview ${index + 1}`}
                          className="w-20 h-20 object-cover rounded border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newPhotos = photos.filter((_, i) => i !== index);
                            setPhotos(newPhotos);
                            setUploadingPhotos(newPhotos.length > 0);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white font-propaganda font-bold px-6 py-2 rounded disabled:bg-blue-300"
                  >
                  {saving ? "Saving..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Reviews column */}
        <div className="col-span-5">
          <h2 className="text-blue-600 text-2xl font-propaganda mb-4">Reviews</h2>
          {reviews.length === 0 && <p className="text-gray-600">No reviews yet.</p>}

          <div className="space-y-4">
            {reviews.map((rev) => {
              const username = rev.userName || rev.userId?.username || "anonymous";
              
              // Check if this review belongs to the current user
              // Reviews can have userId as ObjectId, populated user object, or userEmail
              let isMyReview = false;
              
              if (user) {
                // Try matching by userId (ObjectId or populated object)
                if (rev.userId) {
                  const revUserId = rev.userId._id ? rev.userId._id.toString() : rev.userId.toString();
                  const currentUserId = (user.id || user._id)?.toString();
                  if (revUserId && currentUserId && revUserId === currentUserId) {
                    isMyReview = true;
                  }
                }
                
                // Try matching by email
                if (!isMyReview && rev.userEmail && user.email) {
                  if (rev.userEmail.toLowerCase() === user.email.toLowerCase()) {
                    isMyReview = true;
                  }
                }
                
                // Try matching by username
                if (!isMyReview && rev.userName && user.username) {
                  if (rev.userName.toLowerCase() === user.username.toLowerCase()) {
                    isMyReview = true;
                  }
                }
              }
              
              // Only show profile photo for the current user's own reviews
              // Use ONLY the current user's profile photo, never the review author's photo
              // For all other reviews, explicitly set to null to show default avatar
              const userProfilePhoto = isMyReview ? user?.profilePhoto : null;
              
              return (
                <div key={rev._id} className="flex gap-3 items-start">
                  {userProfilePhoto ? (
                    <img
                      src={userProfilePhoto}
                      alt={username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-600">
                      <span className="text-blue-600 font-bold text-sm uppercase">
                        {username.slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-blue-600 font-bold">@{username}</p>
                    {rev.comment && (
                      <p className="text-sm text-gray-700 mt-1">{rev.comment}</p>
                    )}
                    {rev.ratings?.overall && (
                      <p className="text-xs text-gray-500 mt-1">
                        {rev.ratings.overall} ⭐
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BathroomProfile;