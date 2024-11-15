import React, { useEffect, useState } from "react";
import axios from "axios";

const Staff = () => {
  const [staffData, setStaffData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [data, setData] = useState({
    name: "",
    designation: "",
    status: true,
  });
  const [filterStatus, setFilterStatus] = useState(""); // Filter state

  // Fetch all staff data
  useEffect(() => {
    axios
      .get("http://localhost:3001/getstaff")
      .then((response) => setStaffData(response.data))
      .catch((error) => console.log(error));
  }, []);

  // Handle form input changes
  const handleInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Handle form submission to POST or UPDATE data
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStaff) {
      // Update staff
      axios
        .patch(`http://localhost:3001/updatestaff/${editingStaff._id}`, data)
        .then((response) => {
          const updatedData = staffData.map((staff) =>
            staff._id === editingStaff._id ? response.data : staff
          );
          setStaffData(updatedData);
          setEditingStaff(null);
          setIsModalOpen(false); // Close modal after successful update
        })
        .catch((error) => console.log(error));
    } else {
      // Add new staff
      axios
        .post("http://localhost:3001/addstaff", data)
        .then((response) => {
          setStaffData([...staffData, response.data]); // Update staff list
          setIsModalOpen(false); // Close modal after successful addition
        })
        .catch((error) => console.log(error));
    }
    // Clear form fields after submit
    setData({
      name: "",
      designation: "",
      status: true,
    });
  };

  // Handle Delete
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/deletestaff/${id}`)
      .then(() => {
        const filteredData = staffData.filter((staff) => staff._id !== id);
        setStaffData(filteredData); // Remove from UI
      })
      .catch((error) => console.log(error));
  };

  // Open modal for editing
  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setData(staff);
    setIsModalOpen(true);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  // Filter staff data based on status
  const filteredStaffData = staffData.filter((staff) => {
    if (filterStatus === "") return true; // Show all if no filter is selected
    return staff.status.toString() === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 h-screen">
      <h1 className="text-4xl font-bold text-start text-blue-600">
        Staff Management
      </h1>

      {/* Add Staff Button */}
      <div className="text-start my-6 flex flex-wrap gap-y-6 justify-between ">
        <button
          className="bg-blue-600 text-white/90 font-semibold px-8 py-3 rounded-lg text-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          onClick={() => {
            setEditingStaff(null);
            setData({
              name: "",
              designation: "",
              status: true,
            });
            setIsModalOpen(true);
          }}
        >
          Add Staff
        </button>

        {/* Filter Active/Inactive Staff */}
        <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg px-6 py-3 shadow-xl hover:shadow-2xl transition-all duration-300">
          <label className="text-lg text-white font-semibold tracking-wide">
            Filter by Status:
          </label>
          <select
            value={filterStatus}
            onChange={handleFilterChange}
            className="bg-white text-gray-800 border-2 border-gray-300 rounded-lg md:px-6 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-700 transition-all duration-300 text-lg font-medium shadow-md hover:shadow-lg"
          >
            <option value="">All</option>
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </select>
        </div>
      </div>

      {/* Modal for Add/Edit Staff */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full h-auto overflow-y-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {editingStaff ? "Edit Staff" : "Add New Staff"}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Form Inputs */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  name="name"
                  value={data.name}
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  name="designation"
                  value={data.designation}
                  onChange={handleInput}
                  required
                />
              </div>

              {/* Status */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={data.status}
                  onChange={handleInput}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  required
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>

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
                  {editingStaff ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="text-left bg-gray-200">
              <th className="px-6 py-3 text-lg font-medium text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-lg font-medium text-gray-700">
                Designation
              </th>
              <th className="px-6 py-3 text-lg font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-lg font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStaffData.map((staff) => (
              <tr key={staff._id} className="border-b">
                <td className="px-6 py-4 text-gray-700">{staff.name}</td>
                <td className="px-6 py-4 text-gray-700">{staff.designation}</td>
                <td className="px-6 py-4 text-gray-700">
                  {staff.status ? "Active" : "Inactive"}
                </td>
                <td className="px-6 py-4">
                
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white w-24 text-center  font-semibold py-2 rounded-lg mr-2"
                    onClick={() => handleEdit(staff)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white py-2 rounded-lg w-24 text-center font-semibold"
                    onClick={() => handleDelete(staff._id)}
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

export default Staff;
