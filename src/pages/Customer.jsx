import React, { useEffect, useState } from "react";
import axios from "axios";

const Customer = () => {
  const [customerData, setCustomerData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [data, setData] = useState({
    customerName: "",
    email: "",
    contactNumber: "",
    emergencyNumber: "",
    CNIC: "",
    password: "",
    roomType: "",
    roomName: "",
  });

  const [roomTypes, setRoomTypes] = useState([]); // List of room types
  const [rooms, setRooms] = useState([]); // List of rooms filtered by selected room type

  // Fetch all rooms
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

  // Fetch rooms based on selected room type
  const handleRoomTypeChange = (e) => {
    const selectedRoomType = e.target.value;
    setData({ ...data, roomType: selectedRoomType, roomName: "" }); // Reset room name on type change
    if (selectedRoomType) {
      axios
        .get("http://localhost:3001/getroom")
        .then((response) => {
          const filteredRooms = response.data.filter(
            (room) => room.roomType === selectedRoomType && room.status === true // Filter rooms by selected type and status: true
          );
          setRooms(filteredRooms);
        })
        .catch((error) => console.log(error));
    } else {
      setRooms([]); // Clear rooms if no type is selected
    }
  };

  // Handle form input changes
  const handleInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Fetch Customer Data
  useEffect(() => {
    axios
      .get("http://localhost:3001/getcustomer")
      .then((response) => setCustomerData(response.data))
      .catch((error) => console.log(error));
  }, []);

  // Handle form submission to POST or UPDATE data
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      // Update customer
      axios
        .put(`http://localhost:3001/editCustomer/${editingCustomer._id}`, data)
        .then((response) => {
          const updatedData = customerData.map((customer) =>
            customer._id === editingCustomer._id ? response.data : customer
          );
          setCustomerData(updatedData);
          setEditingCustomer(null);
          setIsModalOpen(false); // Close modal after successful update
        })
        .catch((error) => console.log(error));
    } else {
      // Add new customer
      axios
        .post("http://localhost:3001/addCustomer", data)
        .then((response) => {
          setCustomerData([...customerData, response.data]); // Update table after submission
          setIsModalOpen(false); // Close modal after successful addition
        })
        .catch((error) => console.log(error));
    }
    // Clear form fields after submit
    setData({
      customerName: "",
      email: "",
      contactNumber: "",
      emergencyNumber: "",
      CNIC: "",
      password: "",
      roomType: "",
      roomName: "",
    });
  };

  // Handle Delete
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/deleteCustomer/${id}`)
      .then(() => {
        const filteredData = customerData.filter(
          (customer) => customer._id !== id
        );
        setCustomerData(filteredData); // Remove from UI
      })
      .catch((error) => console.log(error));
  };

  // Open modal for editing
  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setData(customer);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 h-screen">
      <h1 className="text-4xl font-bold text-start text-blue-600">
        Customer Management
      </h1>

      {/* Add Customer Button */}
      <div className="text-start my-6">
        <button
          className="bg-blue-600 text-white/90 font-semibold px-8 py-3 rounded-lg text-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          onClick={() => {
            setEditingCustomer(null);
            setData({
              customerName: "",
              email: "",
              contactNumber: "",
              emergencyNumber: "",
              CNIC: "",
              password: "",
              roomType: "",
              roomName: "",
            });
            setIsModalOpen(true);
          }}
        >
          Add Customer
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center  h-auto my- items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full h-full  overflow-y-auto ">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {editingCustomer ? "Edit Customer" : "Add New Customer"}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Form Inputs */}
              {[
                "customerName",
                "email",
                "contactNumber",
                "emergencyNumber",
                "CNIC",
              ].map((field, index) => (
                <div className="mb-4" key={index}>
                  <label className="block text-gray-700 font-medium mb-2 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    name={field}
                    value={data[field]}
                    onChange={handleInput}
                    required
                  />
                </div>
              ))}
              {/* Room Type Dropdown */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Room Type
                </label>
                <select
                  name="roomType"
                  value={data.roomType}
                  onChange={handleRoomTypeChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none text-gray-700 focus:ring-2 focus:ring-blue-500"
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

              {/* Room Name Dropdown */}
              {data.roomType && rooms.length > 0 && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Room Name
                  </label>
                  <select
                    name="roomName"
                    value={data.roomName}
                    onChange={handleInput}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    required
                  >
                    <option value="">Select Room</option>
                    {rooms.map((room, index) => (
                      <option key={index} value={room.roomName}>
                        {room.roomName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Password */}
              {!editingCustomer && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2 ">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    name="password"
                    value={data.password}
                    onChange={handleInput}
                    required
                  />
                </div>
              )}

              <div className="flex justify-between mt-8">

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-500 focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                >
                  {editingCustomer ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Table */}
      <div className="mt-6">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="text-left bg-gray-200">
              <th className="px-6 py-3 text-lg font-medium text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-lg font-medium text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-lg font-medium text-gray-700">
                Contact
              </th>
              <th className="px-6 py-3 text-lg font-medium text-gray-700">
                Room
              </th>
              <th className="px-6 py-3 text-lg font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {customerData.map((customer) => (
              <tr key={customer._id} className="border-b">
                <td className="px-6 py-4 text-gray-700">
                  {customer.customerName}
                </td>
                <td className="px-6 py-4 text-gray-700">{customer.email}</td>
                <td className="px-6 py-4 text-gray-700">
                  {customer.contactNumber}
                </td>
                <td className="px-6 py-4 text-gray-700">{customer.roomName}</td>
                <td className="px-6 py-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white w-24 text-center  font-semibold py-2 rounded-lg mr-2"
                    onClick={() => handleEdit(customer)}
                  >
                    Edit
                  </button>
                  
                  <button
                    className="bg-red-600 text-white  py-2 rounded-lg w-24 text-center  font-semibold"
                    onClick={() => handleDelete(customer._id)}
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

export default Customer;
