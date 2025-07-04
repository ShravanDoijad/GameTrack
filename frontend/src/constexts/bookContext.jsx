import React, { createContext } from 'react';
import { useState, useEffect } from 'react';
export const BookContext = createContext();
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookContextProvider = ({ children }) => {
    const navigate = useNavigate()
    const [isLoading, setisLoading] = useState(true)
    const [userInfo, setuserInfo] = useState()
    const [selectedSport, setSelectedSport] = useState("");
    const [token, settoken] = useState(false)
    const [favorite, setfavorite] = useState()
    const [loginPanel, setloginPanel] = useState(false)
    const [menuPanel, setmenuPanel] = useState(false)

    let backend = import.meta.env.DEV
  ? "http://localhost:10000"
  : import.meta.env.VITE_BACKEND;


    useEffect(() => {
        const fetchToken = async () => {
           
            try {
                const response = await axios.get(`${backend}/api/auth/authCheck`, { withCredentials: true });
                if (response.data.success) {

                    console.log(response.data)
                    settoken(response.data.isToken);
                    setuserInfo(response.data.user);
                } else {
                    console.warn("No valid session found.");
                    settoken(false);
                }
            } catch (error) {
                console.error("Error fetching token:", error);
            } finally {
                setisLoading(false);
            }
        };

        fetchToken();
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault()
        try {

            const response = await axios.post('/api/users/userLogout');

            settoken(false);
            setmenuPanel(false);
            navigate('/turfs');

        } catch (error) {
            console.error("Error during logout:", error);
        }
    };


    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    let backendUrl = import.meta.env.VITE_BACKEND;
    const value = {
        backendUrl,
        menuPanel,
        setmenuPanel,
        setloginPanel,
        handleLogout,
        loginPanel,
        settoken,
        token,
        favorite,
        setfavorite,
        isLoading,
        setisLoading,
        selectedSport,
        setSelectedSport,
        userInfo,
        setuserInfo,
        calculateDistance

    }
    return (
        <BookContext.Provider value={value}>
            {children}
        </BookContext.Provider>
    )
}

export default BookContextProvider; 