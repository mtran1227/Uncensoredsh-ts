import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import axios from 'axios';
import AddBathroom from './AddBathroom';


const API_URL = 'http://localhost:5001/api';

const Home = () => {
  const navigate = useNavigate();

  // -------------------- STATE --------------------
  const [bathrooms, setBathrooms] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [visitedBathrooms, setVisitedBathrooms] = useState([]);
  const [bucketList, setBucketList] = useState([]);
  const [recommended, setRecommended] = useState([]);   // ⭐ FIXED LOCATION
  const [userLocation, setUserLocation] = useState({ lat: 40.7291, lng: -73.9965 });
  const [selectedBathroom, setSelectedBathroom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE'
  });
  const handleBathroomAdded = (newBathroom) => {
    setBathrooms((prev) => [...prev, newBathroom]);
  };
  // -------------------- GET USER LOCATION --------------------
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => console.log("Using default NYU location")
      );
    }
  };

  // -------------------- GET ALL BATHROOMS --------------------
  const fallbackBathrooms = {
    "silver-center": { _id: "silver-center", name: "Silver Center", location: "100 Washington Square E", geoLocation: { address: "100 Washington Square E", coordinates: [-73.995680, 40.729574] }, averageRating: 4.1 },
    "kimmel-center": { _id: "kimmel-center", name: "Kimmel Center for University Life", location: "60 Washington Sq S", geoLocation: { address: "60 Washington Sq S", coordinates: [-73.997440, 40.729168] }, averageRating: 4.0 },
    "courant-warren-weaver": { _id: "courant-warren-weaver", name: "Warren Weaver Hall (Courant Institute)", location: "251 Mercer St", geoLocation: { address: "251 Mercer St", coordinates: [-73.996960, 40.729820] }, averageRating: 3.9 },
    "brown-building": { _id: "brown-building", name: "Brown Building", location: "29 Washington Pl", geoLocation: { address: "29 Washington Pl", coordinates: [-73.995210, 40.729316] }, averageRating: 3.8 },
    "gcasl": { _id: "gcasl", name: "GCASL", location: "238 Thompson St", geoLocation: { address: "238 Thompson St", coordinates: [-73.998170, 40.729030] }, averageRating: 3.7 },
    "king-juan-carlos": { _id: "king-juan-carlos", name: "King Juan Carlos I Center", location: "53 Washington Sq S", geoLocation: { address: "53 Washington Sq S", coordinates: [-73.997010, 40.729100] }, averageRating: 3.6 },
    "bobst-library": { _id: "bobst-library", name: "Bobst Library", location: "70 Washington Sq S", geoLocation: { address: "70 Washington Sq S", coordinates: [-73.997199, 40.729453] }, averageRating: 3.5, images: [{ url: "/bathroomphotos/bobst4th.png" }] },
    "steinhardt-education": { _id: "steinhardt-education", name: "Steinhardt Education Building", location: "35 W 4th St", geoLocation: { address: "35 W 4th St", coordinates: [-73.999249, 40.729511] }, averageRating: 3.6 },
    "steinhardt-pless": { _id: "steinhardt-pless", name: "Steinhardt Pless Hall", location: "82 Washington Square E", geoLocation: { address: "82 Washington Square E", coordinates: [-73.994763, 40.730195] }, averageRating: 3.7 },
    "vanderbilt-hall": { _id: "vanderbilt-hall", name: "Vanderbilt Hall (NYU Law)", location: "40 Washington Sq S", geoLocation: { address: "40 Washington Sq S", coordinates: [-73.996376, 40.729239] }, averageRating: 3.8 },
    "furman-hall": { _id: "furman-hall", name: "Furman Hall (NYU Law)", location: "245 Sullivan St", geoLocation: { address: "245 Sullivan St", coordinates: [-73.997735, 40.728615] }, averageRating: 3.8 },
    "dagostino-hall": { _id: "dagostino-hall", name: "D'Agostino Hall (NYU Law)", location: "110 W 3rd St", geoLocation: { address: "110 W 3rd St", coordinates: [-73.999454, 40.729934] }, averageRating: 3.9 },
    "sps-building": { _id: "sps-building", name: "SPS Building", location: "7 E 12th St", geoLocation: { address: "7 E 12th St", coordinates: [-73.992706, 40.735028] }, averageRating: 3.7 },
    "gallatin-school": { _id: "gallatin-school", name: "Gallatin School", location: "1 Washington Pl", geoLocation: { address: "1 Washington Pl", coordinates: [-73.993900, 40.729430] }, averageRating: 3.6 },
    "tisch-arts": { _id: "tisch-arts", name: "Tisch School of the Arts", location: "721 Broadway", geoLocation: { address: "721 Broadway", coordinates: [-73.992160, 40.729497] }, averageRating: 4.0 },
    "tisch-theatre": { _id: "tisch-theatre", name: "Tisch Building (Theatre)", location: "111 2nd Ave", geoLocation: { address: "111 2nd Ave", coordinates: [-73.989524, 40.727917] }, averageRating: 3.8 },
    "tisch-dance": { _id: "tisch-dance", name: "Tisch Dance Annex", location: "111 2nd Ave Annex", geoLocation: { address: "111 2nd Ave Annex", coordinates: [-73.989550, 40.727900] }, averageRating: 3.8 },
    "arch-urban-design": { _id: "arch-urban-design", name: "Architecture & Urban Design", location: "370 Jay St, Brooklyn", geoLocation: { address: "370 Jay St", coordinates: [-73.987071, 40.692514] }, averageRating: 3.9 },
    "stern-kmc": { _id: "stern-kmc", name: "Stern School of Business – KMC", location: "44 W 4th St", geoLocation: { address: "44 W 4th St", coordinates: [-73.999222, 40.730341] }, averageRating: 3.7 },
    "stern-tisch-hall": { _id: "stern-tisch-hall", name: "Stern Tisch Hall", location: "40 W 4th St", geoLocation: { address: "40 W 4th St", coordinates: [-73.998983, 40.729960] }, averageRating: 3.6 },
    "palladium-athletic": { _id: "palladium-athletic", name: "Palladium Athletic Facility", location: "140 E 14th St", geoLocation: { address: "140 E 14th St", coordinates: [-73.987628, 40.732810] }, averageRating: 4.2 },
    "404-fitness": { _id: "404-fitness", name: "404 Fitness", location: "404 Lafayette St", geoLocation: { address: "404 Lafayette St", coordinates: [-73.992290, 40.729690] }, averageRating: 3.9 },
    "nyu-bookstore": { _id: "nyu-bookstore", name: "NYU Bookstore", location: "726 Broadway", geoLocation: { address: "726 Broadway", coordinates: [-73.992820, 40.729800] }, averageRating: 3.6 },
    "studentlink-center": { _id: "studentlink-center", name: "StudentLink Center", location: "383 Lafayette St", geoLocation: { address: "383 Lafayette St", coordinates: [-73.992390, 40.729150] }, averageRating: 3.7 },
    "arc": { _id: "arc", name: "Academic Resource Center (ARC)", location: "18 Washington Pl", geoLocation: { address: "18 Washington Pl", coordinates: [-73.995271, 40.729917] }, averageRating: 3.7 },
    "founders-hall": { _id: "founders-hall", name: "Founders Hall", location: "120 E 12th St", geoLocation: { address: "120 E 12th St", coordinates: [-73.987471, 40.731593] }, averageRating: 3.6 },
    "palladium-hall": { _id: "palladium-hall", name: "Palladium Hall", location: "140 E 14th St", geoLocation: { address: "140 E 14th St", coordinates: [-73.987628, 40.732810] }, averageRating: 4.1 },
    "brittany-hall": { _id: "brittany-hall", name: "Brittany Hall", location: "55 E 10th St", geoLocation: { address: "55 E 10th St", coordinates: [-73.993310, 40.732088] }, averageRating: 3.5 },
    "goddard-hall": { _id: "goddard-hall", name: "Goddard Hall", location: "79 Washington Sq E", geoLocation: { address: "79 Washington Sq E", coordinates: [-73.995123, 40.730387] }, averageRating: 3.6 },
    "lipton-hall": { _id: "lipton-hall", name: "Lipton Hall", location: "33 Washington Sq W", geoLocation: { address: "33 Washington Sq W", coordinates: [-73.999632, 40.730867] }, averageRating: 3.5 },
    "third-north": { _id: "third-north", name: "Third North", location: "75 3rd Ave", geoLocation: { address: "75 3rd Ave", coordinates: [-73.987251, 40.731633] }, averageRating: 3.6 },
    "university-hall": { _id: "university-hall", name: "University Hall", location: "110 E 14th St", geoLocation: { address: "110 E 14th St", coordinates: [-73.986547, 40.732654] }, averageRating: 3.5 },
    "carlyle-court": { _id: "carlyle-court", name: "Carlyle Court", location: "25 Union Square W", geoLocation: { address: "25 Union Square W", coordinates: [-73.992791, 40.736054] }, averageRating: 3.7 },
    "greenwich-hall": { _id: "greenwich-hall", name: "Greenwich Hall", location: "536 LaGuardia Pl", geoLocation: { address: "536 LaGuardia Pl", coordinates: [-73.998123, 40.729028] }, averageRating: 3.8 },
    "rubin-hall": { _id: "rubin-hall", name: "Rubin Hall", location: "35 Fifth Ave", geoLocation: { address: "35 Fifth Ave", coordinates: [-73.993592, 40.734040] }, averageRating: 3.6 },
    "weinstein-hall": { _id: "weinstein-hall", name: "Weinstein Hall", location: "5 University Pl", geoLocation: { address: "5 University Pl", coordinates: [-73.997980, 40.731030] }, averageRating: 3.7 },
    "clark-street-res": { _id: "clark-street-res", name: "Clark Street Residence", location: "55 Clark St, Brooklyn, NY", geoLocation: { address: "55 Clark St, Brooklyn, NY", coordinates: [-73.992720, 40.697418] }, averageRating: 3.5 },
    "jacobs-jab": { _id: "jacobs-jab", name: "Jacobs Academic Building (2 MetroTech)", location: "2 MetroTech Center, Brooklyn, NY 11201", geoLocation: { address: "2 MetroTech Center", coordinates: [-73.985839, 40.693382] }, averageRating: 3.9 },
    "rogers-hall": { _id: "rogers-hall", name: "Rogers Hall (6 MetroTech)", location: "6 MetroTech Center, Brooklyn, NY 11201", geoLocation: { address: "6 MetroTech Center", coordinates: [-73.986514, 40.694453] }, averageRating: 3.8 },
    "370-jay": { _id: "370-jay", name: "370 Jay Street", location: "370 Jay St, Brooklyn, NY 11201", geoLocation: { address: "370 Jay St", coordinates: [-73.987071, 40.692514] }, averageRating: 4.0 },
    "5-metrotech": { _id: "5-metrotech", name: "5 MetroTech Center", location: "5 MetroTech Center, Brooklyn NY 11201", geoLocation: { address: "5 MetroTech Center", coordinates: [-73.985900, 40.693700] }, averageRating: 3.7 },
    "makerspace": { _id: "makerspace", name: "NYU MakerSpace", location: "6 MetroTech Center, Brooklyn NY 11201", geoLocation: { address: "6 MetroTech Center", coordinates: [-73.986514, 40.694453] }, averageRating: 4.1 },
    "dibner-library": { _id: "dibner-library", name: "Bern Dibner Library", location: "5 MetroTech Center, Brooklyn NY 11201", geoLocation: { address: "5 MetroTech Center", coordinates: [-73.986130, 40.693840] }, averageRating: 3.8 },
    "urban-future-lab": { _id: "urban-future-lab", name: "Urban Future Lab", location: "15 MetroTech Center, Brooklyn NY", geoLocation: { address: "15 MetroTech Center", coordinates: [-73.985200, 40.693240] }, averageRating: 3.9 },
    "othmer-residence": { _id: "othmer-residence", name: "Othmer Residence Hall", location: "101 Johnson St, Brooklyn NY 11201", geoLocation: { address: "101 Johnson St", coordinates: [-73.985060, 40.694820] }, averageRating: 3.6 },
    "hassenfeld-hospital": { _id: "hassenfeld-hospital", name: "Hassenfeld Children's Hospital", location: "160 E 34th St", geoLocation: { address: "160 E 34th St", coordinates: [-73.976359, 40.744388] }, averageRating: 4.0 },
    "harkness-pavilion": { _id: "harkness-pavilion", name: "Harkness Pavilion", location: "105 E 17th St", geoLocation: { address: "105 E 17th St", coordinates: [-73.986058, 40.735669] }, averageRating: 3.7 },
    "perelman-center": { _id: "perelman-center", name: "Perelman Center", location: "570 1st Ave", geoLocation: { address: "570 1st Ave", coordinates: [-73.973204, 40.740258] }, averageRating: 3.8 },
    "skirball-institute": { _id: "skirball-institute", name: "Skirball Institute", location: "540 1st Ave", geoLocation: { address: "540 1st Ave", coordinates: [-73.974606, 40.740032] }, averageRating: 3.8 },
    "smilow-research": { _id: "smilow-research", name: "Smilow Research Center", location: "522 1st Ave", geoLocation: { address: "522 1st Ave", coordinates: [-73.974064, 40.739651] }, averageRating: 3.9 },
    "tisch-hospital": { _id: "tisch-hospital", name: "Tisch Hospital", location: "550 1st Ave", geoLocation: { address: "550 1st Ave", coordinates: [-73.974865, 40.739896] }, averageRating: 3.8 },
    "kimmel-pavilion": { _id: "kimmel-pavilion", name: "Kimmel Pavilion", location: "30th St & 1st Ave", geoLocation: { address: "30th St & 1st Ave", coordinates: [-73.974000, 40.741850] }, averageRating: 3.7 },
    "ambulatory-care-center": { _id: "ambulatory-care-center", name: "Ambulatory Care Center (ACC)", location: "240 E 38th St", geoLocation: { address: "240 E 38th St", coordinates: [-73.973304, 40.747208] }, averageRating: 3.7 },
  };

  const fetchNearbyBathrooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/bathrooms`);
      const data = response.data;
      const apiBathrooms = Array.isArray(data) ? data : [];
      
      // Combine API bathrooms with fallback to ensure all NYU bathrooms are shown
      const fallbackArray = Object.values(fallbackBathrooms);
      
      // Create a map of bathrooms by name to avoid duplicates
      const bathroomMap = new Map();
      
      // First add all API bathrooms
      apiBathrooms.forEach(b => {
        if (b.name && b.geoLocation?.coordinates) {
          bathroomMap.set(b.name.toLowerCase(), b);
        }
      });
      
      // Then add fallback bathrooms that aren't already in the map
      fallbackArray.forEach(b => {
        const key = b.name.toLowerCase();
        if (!bathroomMap.has(key) && b.geoLocation?.coordinates) {
          bathroomMap.set(key, b);
        }
      });
      
      const allBathrooms = Array.from(bathroomMap.values());
      setBathrooms(allBathrooms.length > 0 ? allBathrooms : fallbackArray);
    } catch (error) {
      console.error('Error fetching bathrooms:', error);
      // Use fallback if API fails
      setBathrooms(Object.values(fallbackBathrooms));
    }
  };

  // -------------------- GET VISITED BATHROOMS (from User's favorites/history) --------------------
  const fetchVisitedBathrooms = async () => {
    if (!user) return;
    try {
      // Use favorites as history (same as Account page)
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/user/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Convert to same format as visitedBathrooms for consistency
      // Include both ID and name for better matching
      const favorites = res.data || [];
      const visitedData = favorites.map(f => ({ 
        bathroomId: f._id || f,
        _id: f._id || f,
        name: f.name
      }));
      console.log('Visited bathrooms loaded:', visitedData.length, visitedData);
      setVisitedBathrooms(visitedData);
    } catch (err) {
      console.error("Error loading visited pins:", err);
    }
  };

  // -------------------- GET RECOMMENDED (UNVISITED) --------------------
  const fetchRecommended = async () => {
    const uid = user?._id || user?.id;
    if (!uid) return;
    try {
      const res = await axios.get(`${API_URL}/bathrooms/recommended/${uid}`);
      setRecommended(res.data);
    } catch (err) {
      console.log("Error loading recommended bathrooms", err);
    }
  };

  // -------------------- GET BUCKET LIST --------------------
  const fetchBucketList = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/user/bucket`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data || [];
      // Use fallback if empty (to match BucketList page)
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
      // Combine API data with fallback, avoiding duplicates (to match BucketList page behavior)
      const apiData = data && Array.isArray(data) ? data : [];
      const apiIds = new Set(apiData.map(b => normalizeId(b._id || b)));
      const fallbackToAdd = fallbackBucketList.filter(b => {
        const id = normalizeId(b._id);
        return !apiIds.has(id);
      });
      setBucketList([...apiData, ...fallbackToAdd]);
    } catch (err) {
      console.log("Error loading bucket list:", err);
      // Use fallback on error
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
      setBucketList(fallbackBucketList);
    }
  };

  // -------------------- ON PAGE LOAD --------------------
  useEffect(() => {
    fetchNearbyBathrooms();
    getUserLocation();
    fetchVisitedBathrooms();
    fetchRecommended();      // ⭐ NEW + FIXED
    fetchBucketList();
  }, []);

  const bathroomList = Array.isArray(bathrooms) ? bathrooms : Object.values(fallbackBathrooms);

  // -------------------- SEARCH FILTER --------------------
  const filteredBathrooms = bathroomList.filter((b) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      b.name.toLowerCase().includes(q) ||
      (b.location || "").toLowerCase().includes(q) ||
      (b.geoLocation?.address || "").toLowerCase().includes(q)
    );
  });

  // Helper function to normalize bathroom ID for comparison
  const normalizeId = (id) => {
    if (!id) return null;
    if (typeof id === 'string') return id.toLowerCase().trim();
    if (id._id) return id._id.toString().toLowerCase().trim();
    if (id.toString) return id.toString().toLowerCase().trim();
    return null;
  };

  // Helper function to normalize bathroom name for comparison
  const normalizeName = (name) => {
    if (!name) return '';
    return name.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  // Helper function to check if a bathroom is visited (by ID or name)
  // Priority: visited bathrooms should show as white pins
  const isVisited = (bathroom) => {
    if (!bathroom || visitedBathrooms.length === 0) return false;
    const normalizedId = normalizeId(bathroom._id);
    const normalizedName = normalizeName(bathroom.name);
    
    const isMatch = visitedBathrooms.some((v) => {
      // Handle different structures: v.bathroomId, v._id, or v itself
      const visitedBathroom = v.bathroomId || v._id || v;
      const visitedId = normalizeId(typeof visitedBathroom === 'object' ? visitedBathroom._id : visitedBathroom);
      const visitedName = normalizeName(v.name || (typeof visitedBathroom === 'object' ? visitedBathroom.name : ''));
      
      // Match by ID first (most reliable), then by name
      if (normalizedId && visitedId && normalizedId === visitedId) {
        return true;
      }
      if (normalizedName && visitedName && normalizedName === visitedName) {
        return true;
      }
      return false;
    });
    
    if (isMatch) {
      console.log('Bathroom marked as visited:', bathroom.name, normalizedId, normalizedName);
    }
    return isMatch;
  };

  // Helper function to check if a bathroom is in bucket list (but NOT visited)
  // Only check bucketlist if not already visited (visited takes priority)
  const isInBucketList = (bathroom) => {
    if (!bathroom) return false;
    // Don't check bucketlist if already visited
    if (isVisited(bathroom)) return false;
    
    const normalizedId = normalizeId(bathroom._id);
    const normalizedName = normalizeName(bathroom.name);
    
    return bucketList.some((b) => {
      const bucketId = normalizeId(b._id || b.bathroomId?._id);
      const bucketName = normalizeName(b.name);
      
      // Match by ID or name (exact match to avoid false positives)
      return (normalizedId && bucketId && normalizedId === bucketId) || 
             (normalizedName && bucketName && normalizedName === bucketName);
    });
  };

  // Show all bathrooms on map
  const markerBathrooms = bathroomList.filter((b) => b?.geoLocation?.coordinates);

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen text-blue-600 text-2xl">Loading map...</div>;
  }

  return (
    <div className="w-screen h-screen bg-white overflow-hidden">

      {/* TOP BAR */}
      <div className="absolute top-6 left-7 right-7 z-10 flex items-center gap-6">
        <Link to="/home" className="cursor-pointer">
          <div className="bg-blue-600 text-white px-3 py-1 inline-block rounded font-propaganda tracking-wide">
            UNCENSORED
          </div>
          <div className="text-blue-600 text-5xl font-propaganda leading-none tracking-wide">SH*TS</div>
        </Link>

        {/* Search next to logo */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search bathrooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const target = filteredBathrooms[0];
                if (target) navigate(`/bathrooms/${target._id}`);
              }
            }}
            className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* ACCOUNT BUTTON */}
        <Link to="/account" className="ml-auto">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M23.995 4C29.5297 4 34.0034 8.48 34.0034 14C34.0034 19.52 29.5297 24 23.995 24C18.4703 24 13.9865 19.52 13.9865 14C13.9865 8.48 18.4703 4 23.995 4ZM23.995 8C20.6822 8 17.9899 10.69 17.9899 14C17.9899 17.31 20.6822 20 23.995 20C27.3178 20 30.0001 17.31 30.0001 14C30.0001 10.69 27.3178 8 23.995 8ZM23.995 27C34.2937 27 40.6691 33.99 40.9994 44C41.0194 44.55 40.569 45 40.0085 45H38.0068C37.4564 45 37.016 44.55 36.996 44C36.6957 36.16 32.0918 31 23.995 31C15.9082 31 11.3043 36.16 11.004 44C10.984 44.55 10.5436 45 9.98316 45H7.98147C7.43101 45 6.98063 44.55 7.00064 44C7.33092 33.99 13.7063 27 23.995 27Z" fill="#004DFF"/>
          </svg>
        </Link>
      </div>

      {/* MAP */}
      <div className="absolute left-7 top-44 w-[70vw] max-w-[900px] h-[70vh] rounded-lg" style={{ border: '10px solid #004DFF' }}>
        
        <GoogleMap
          center={userLocation}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '8px' }}
        >

          {/* USER LOCATION */}
          <Marker 
            position={userLocation}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="12" r="5" fill="none" stroke="#004DFF" stroke-width="2"/>
                  <line x1="20" y1="17" x2="20" y2="28" stroke="#004DFF" stroke-width="2" stroke-linecap="round"/>
                  <line x1="20" y1="22" x2="12" y2="18" stroke="#004DFF" stroke-width="2" stroke-linecap="round"/>
                  <line x1="20" y1="22" x2="28" y2="18" stroke="#004DFF" stroke-width="2" stroke-linecap="round"/>
                  <line x1="20" y1="28" x2="12" y2="36" stroke="#004DFF" stroke-width="2" stroke-linecap="round"/>
                  <line x1="20" y1="28" x2="28" y2="36" stroke="#004DFF" stroke-width="2" stroke-linecap="round"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20)
            }}
          />

          {/* PINS: All NYU bathrooms displayed with correct colors
              - White pins: visited/history bathrooms (highest priority)
              - Light blue pins: bucketlist bathrooms (not visited)
              - Dark blue pins: all other bathrooms */}
          {markerBathrooms.map(bathroom => {
            if (!bathroom.geoLocation?.coordinates) return null;
            
            // Check categories in priority order to avoid overlap
            const visited = isVisited(bathroom);
            const inBucketList = isInBucketList(bathroom); // Already checks !visited internally
            
            let pinColor, circleColor, strokeColor, strokeWidth;
            if (visited) {
              // Priority 1: White pin with white circle for visited/history bathrooms
              pinColor = '#FFFFFF';
              circleColor = '#FFFFFF';
              strokeColor = '#004DFF';
              strokeWidth = '2';
            } else if (inBucketList) {
              // Priority 2: Light blue pin for bucketlist bathrooms (not visited)
              pinColor = '#87CEEB';
              circleColor = 'white';
              strokeColor = '#004DFF';
              strokeWidth = '1';
            } else {
              // Priority 3: Regular dark blue pin for all other bathrooms
              pinColor = '#004DFF';
              circleColor = 'white';
              strokeColor = 'none';
              strokeWidth = '0';
            }
            
            return (
              <Marker
                key={bathroom._id || bathroom.name}
                position={{
                  lat: bathroom.geoLocation.coordinates[1],
                  lng: bathroom.geoLocation.coordinates[0]
                }}
                onClick={() => setSelectedBathroom(bathroom)}
                icon={{
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="30" height="40" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 0C8.4 0 3 5.4 3 12c0 8.3 12 28 12 28s12-19.7 12-28c0-6.6-5.4-12-12-12z" fill="${pinColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
                      <circle cx="15" cy="12" r="6" fill="${circleColor}" ${visited ? 'stroke="#004DFF" stroke-width="1.5"' : ''}/>
                    </svg>
                  `)
                }}
              />
            );
          })}

        </GoogleMap>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="absolute right-7 top-32 w-96">

        {/* Add Bathroom moved above header */}
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-4 w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          + Add Bathroom
        </button>

        <h2 className="text-blue-uncensored text-2xl font-propaganda mb-4">
          HAVE YOU EVER TRIED...
        </h2>

        {/* SEARCH + RECOMMENDED + ALL BATHROOMS LIST */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto">

        {/* ⭐ RECOMMENDED FOR YOU (UNVISITED) */}
        {recommended.length > 0 && (
        <>
            {recommended.map(b => (
            <div
                key={b._id}
                onClick={() => navigate(`/bathrooms/${b._id}`)}
                className="bg-blue-600 rounded-lg p-4 cursor-pointer hover:bg-blue-700 transition"
            >
                <h3 className="text-white font-bold text-lg">{b.name}</h3>
                <p className="text-white text-sm opacity-90">
                {b.location || b.geoLocation?.address}
                </p>

                <div className="flex items-center mt-2">
                <span className="text-white font-bold text-xl">
                    {b.averageRating?.toFixed(1)}
                </span>
                <span className="text-white ml-1">⭐</span>
                </div>
            </div>
            ))}
        </>
        )}

        {filteredBathrooms.map(b => (
        <div
            key={b._id}
            onClick={() => navigate(`/bathrooms/${b._id}`)}
            className="bg-blue-600 rounded-lg p-4 cursor-pointer hover:bg-blue-700 transition"
        >
            <h3 className="text-white font-bold text-lg">{b.name}</h3>
            <p className="text-white text-sm opacity-90">
            {b.location || b.geoLocation?.address}
            </p>

            <div className="flex items-center mt-2">
            <span className="text-white font-bold text-xl">
                {(b.averageRating || 0).toFixed(1)}
            </span>
            <span className="text-white ml-1">⭐</span>
            </div>
        </div>
        ))}
        </div>

        {/* POPUP */}
        {selectedBathroom && (
          <div className="fixed bottom-10 right-10 bg-white p-4 rounded-lg shadow-2xl border-4 border-blue-600 w-80">
            <button
              onClick={() => setSelectedBathroom(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h3 className="text-blue-600 font-bold text-xl mb-2">
              {selectedBathroom.name}
            </h3>

            <p className="text-gray-700 mb-2">
              {selectedBathroom.geoLocation?.address}
            </p>

            <p className="text-blue-600 font-bold text-2xl">
              {selectedBathroom.averageRating.toFixed(1)} ⭐
            </p>

            <button
              onClick={() => navigate(`/bathrooms/${selectedBathroom._id}`)}
              className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              View Details
            </button>
          </div>
        )}

      </div>
      {showAddForm && (
        <AddBathroom
            onClose={() => setShowAddForm(false)}
            onBathroomAdded={handleBathroomAdded}
        />
        )}
    </div>
  );
};

export default Home;