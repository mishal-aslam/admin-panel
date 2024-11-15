import React, { useEffect, useState } from "react";
import axios from "axios";

const RoomManagement = () => {
  const [roomData, setRoomData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]); // List of room types

  const [data, setData] = useState({
    roomName: "",
    roomType: "",
    availablity: "",
    roomStatus: "available", // Default room status
    rentPerDay: "",
    imageurls: [],
    description: "",
  });

  // Fetch all room types
  useEffect(() => {
    axios
      .get("http://localhost:3001/getroom")
      .then((response) => {
        const allRooms = response.data;
        const uniqueRoomTypes = [
          ...new Set(allRooms.map((room) => room.roomType)), // Get unique room types
        ];
        setRoomTypes(uniqueRoomTypes);
      })
      .catch((error) => console.log(error));
  }, []);

  // Fetch room data
  useEffect(() => {
    axios
      .get("http://localhost:3001/getroom")
      .then((response) => setRoomData(response.data))
      .catch((error) => console.log(error));
  }, []);

  // Handle form input changes
  const handleInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Handle form submission to POST or UPDATE data
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRoom) {
      // Update room
      axios
        .put(`http://localhost:3001/editRoom/${editingRoom._id}`, data)
        .then((response) => {
          const updatedData = roomData.map((room) =>
            room._id === editingRoom._id ? response.data : room
          );
          setRoomData(updatedData);
          setEditingRoom(null);
          setIsModalOpen(false); // Close modal after successful update
        })
        .catch((error) => console.log(error));
    } else {
      // Add new room
      axios
        .post("http://localhost:3001/addRoom", data)
        .then((response) => {
          setRoomData([...roomData, response.data]); // Update table after submission
          setIsModalOpen(false); // Close modal after successful addition
        })
        .catch((error) => console.log(error));
    }
    // Clear form fields after submit
    setData({
      roomName: "",
      roomType: "",
      availablity: "",
      roomStatus: "available",
      rentPerDay: "",
      imageurls: [],
      description: "",
    });
  };

  // Handle Delete
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/deleteRoom/${id}`)
      .then(() => {
        const filteredData = roomData.filter((room) => room._id !== id);
        setRoomData(filteredData); // Remove from UI
      })
      .catch((error) => console.log(error));
  };

  // Open modal for editing
  const handleEdit = (room) => {
    setEditingRoom(room);
    setData(room);
    setIsModalOpen(true);
  };

  // Function to handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Here, you can upload the image to a server or store it locally.
      // For simplicity, I'll assume you store the image URL.
      const imageUrl = URL.createObjectURL(file); // Temporary URL for local image display
      setData((prevData) => ({
        ...prevData,
        imageurls: [...prevData.imageurls, imageUrl], // Add the new image URL to the list
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-r from-gray-100 via-white to-gray-200 h-screen">
    <h1 className="text-5xl font-extrabold text-start text-blue-700 mb-8">Room Management</h1>
  
    {/* Add Room Button */}
    <div className="text-start my-6">
      <button
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-8 py-3 rounded-xl text-xl shadow-md hover:shadow-lg hover:scale-105 transform transition-all focus:ring-2 focus:ring-blue-500"
        onClick={() => {
          setEditingRoom(null);
          setData({
            roomName: "",
            roomType: "",
            availablity: "",
            roomStatus: "available",
            rentPerDay: "",
            imageurls: [],
            description: "",
          });
          setIsModalOpen(true);
        }}
      >
        Add Room
      </button>
    </div>
  
    {/* Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center  h-auto my- items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full h-full  overflow-y-auto ">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            {editingRoom ? "Edit Room" : "Add New Room"}
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Form Inputs */}
            {["roomName", "availablity", "rentPerDay", "description"].map((field, index) => (
              <div className="mb-6" key={index}>
                <label className="block text-gray-700 font-medium mb-2 capitalize text-lg">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={field === "rentPerDay" ? "number" : "text"}
                  className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  name={field}
                  value={data[field]}
                  onChange={handleInput}
                  required
                />
              </div>
            ))}
  
            {/* Room Type Dropdown */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 text-lg">Room Type</label>
              <select
                name="roomType"
                value={data.roomType}
                onChange={handleInput}
                className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                required
              >
                <option value="">Select Room Type</option>
                {roomTypes.map((roomType, index) => (
                  <option key={index} value={roomType}>
                    {roomType}
                  </option>
                ))}
              </select>
            </div>
  
            {/* Room Status Dropdown */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 text-lg">Room Status</label>
              <select
                name="roomStatus"
                value={data.roomStatus}
                onChange={handleInput}
                className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option value="available">Available</option>
                <option value="cleaning">Cleaning</option>
                <option value="occupied">Occupied</option>
              </select>
            </div>
  
            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 text-lg">Room Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
  
            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-md shadow-lg hover:shadow-xl hover:scale-105 transform transition-all focus:ring-2 focus:ring-blue-500"
              >
                {editingRoom ? "Save Changes" : "Add Room"}
              </button>
              <button
                type="button"
                className="ml-4 bg-gray-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-gray-600 hover:shadow-lg"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  
    {/* Room Table */}
    <div className="mt-8 overflow-x-auto">
      <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-6 py-4 text-lg font-semibold">Room #</th>
            <th className="px-6 py-4 text-lg font-semibold">Room Name</th>
            <th className="px-6 py-4 text-lg font-semibold">Type</th>
            <th className="px-6 py-4 text-lg font-semibold">Availability</th>
            <th className="px-6 py-4 text-lg font-semibold">Rent Per Day</th>
            <th className="px-6 py-4 text-lg font-semibold">Status</th>
            <th className="px-6 py-4 text-lg font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {roomData.map((room) => (
            <tr key={room._id} className="border-b hover:bg-gray-100">
           <td className="px-6 py-4">
              {room.imageurls.length > 0 ? (
                  <img
                    src={room.imageurls[0]} // Displaying the first image
                    alt={room.roomName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <span>No image</span>
                )}
              </td>
              <td className="px-6 py-4">{room.roomName}</td>
              <td className="px-6 py-4">{room.roomType}</td>
              <td className="px-6 py-4">{room.availablity}</td>
              <td className="px-6 py-4">${room.rentPerDay}</td>
              <td className="px-6 py-4">{room.roomStatus}</td>
              <td className="px-6 py-4 flex items-center gap-2">
               
              
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white w-24 text-center  font-semibold py-2 rounded-lg mr-2"
                    onClick={() => handleEdit(room)}
                  >
                    Edit
                  </button>
                <button
                  onClick={() => handleDelete(room._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  
  );
};

export default RoomManagement;
