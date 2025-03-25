import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, YAxis } from "recharts";

const API_URL = "http://localhost:4000";

const FacilityDate = () => {
  const [facilities, setFacilities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newFacility, setNewFacility] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchFacilities();
    fetchAllBookings();
  }, []);

  const fetchFacilities = async () => {
    try {
      const res = await axios.get(`${API_URL}/getfacilities`);
      setFacilities(res.data);
    } catch (error) {
      toast.error("Failed to load facilities");
    }
  };

  const fetchAllBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/bookings`);
      setBookings(res.data);
    } catch (error) {
      toast.error("Failed to load bookings");
    }
  };

  const uniqueDates = [...new Set(bookings.map((b) => b.date))];

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex">
      {/* Sidebar with booking dates */}
      <div className="w-1/4 bg-white p-4 rounded-lg shadow-md overflow-auto h-screen">
        <h3 className="text-lg font-bold mb-3">📅 Booking Dates</h3>
        <ul>
          {uniqueDates.length === 0 ? (
            <p className="text-gray-500">No bookings yet.</p>
          ) : (
            uniqueDates.map((date) => (
              <li
                key={date}
                className={`p-2 cursor-pointer rounded-lg text-center text-gray-800 ${
                  selectedDate === date ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setSelectedDate(date)}
              >
                {date}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 bg-white p-6 ml-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">🏫 Facility Management</h2>

        {facilities.map((facility) => (
          <div key={facility._id} className="mb-6 p-4 border rounded-lg bg-gray-50 shadow-sm">
            <h3 className="text-lg font-semibold">{facility.name}</h3>
            {selectedDate && (
              <div className="mt-4">
                <h4 className="text-md font-semibold">Bookings on {selectedDate}:</h4>
                {bookings
                  .filter((booking) => booking.date === selectedDate && booking.facilityName === facility.name)
                  .map((booking) => (
                    <div key={booking._id} className="p-2 border rounded mt-2">
                      <p>
                        <span className="font-semibold">{booking.email}</span> ({booking.startTime} - {booking.endTime})
                      </p>
                      <p className={booking.status === "approved" ? "text-green-600" : "text-red-600"}>
                        {booking.status.toUpperCase()}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacilityDate;
