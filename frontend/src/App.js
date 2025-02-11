import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from "axios";

function App() {
  const [userEmail, setUserEmail] = useState(null);
  const [query, setQuery] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleLoginSuccess = (response) => {
    const token = response.credential;
    axios
      .post("https://startupnetwork.onrender.com/api/login", { token })
      .then((res) => {
        setUserEmail(res.data.email);
      })
      .catch((err) => console.error("Login failed", err));
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResponseMessage("");

    try {
      const response = await axios.post("https://startupnetwork.onrender.com/api/search", {
        query,
        userEmail,
      });
      setResponseMessage(response.data.message);
    } catch (error) {
      if (error.response?.status === 403) {
        setResponseMessage("Your credits are exhausted. Please check your email to recharge.");
      } else {
        setResponseMessage("Error processing search request.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-semibold mb-4">Investor & Mentor Finder</h1>

        {!userEmail ? (
          <div className="flex justify-center items-center w-full max-w-sm">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.error("Login Failed")}
            />
          </div>
        ) : (
          <div className="w-full max-w-md p-4 shadow-lg bg-white rounded-2xl">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-2">Logged in as: {userEmail}</p>
             
              <input
                type="text"
                placeholder="Enter your query (e.g., 'We need a video investor')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="mb-2 w-full px-3 py-2 border border-gray-300 rounded-md"
              />

              <div className="w-full flex justify-center">
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className={`w-1/3 px-4 py-2 rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-600 text-white'}`}
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>

              {responseMessage && (
                <div className="mt-4 p-2 bg-gray-100 text-sm text-gray-700">
                  {responseMessage}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
