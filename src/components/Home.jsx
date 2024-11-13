import React, { useEffect, useState } from "react";
import {
  BsFillArchiveFill,
  BsFillBellFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
} from "react-icons/bs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

function Home() {
  const [customerCount, setCustomerCount] = useState(0);
  const [roomCount, setRoomCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);

  useEffect(() => {
    // Fetch customer count
    fetch("http://localhost:3001/getCustomer")
      .then((response) => response.json())
      .then((data) => setCustomerCount(data.count))
      .catch((error) => console.error("Error fetching customer count:", error));

    // Fetch room count
    fetch("http://localhost:3001/getroom")
      .then((response) => response.json())
      .then((data) => setRoomCount(data.count))
      .catch((error) => console.error("Error fetching room count:", error));

    // Fetch staff count
    fetch("http://localhost:3001/getstaff")
      .then((response) => response.json())
      .then((data) => setStaffCount(data.count))
      .catch((error) => console.error("Error fetching staff count:", error));
  }, []);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>DASHBOARD</h3>
      </div>

      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>CUSTOMER</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1>{customerCount}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>ROOMS</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <h1 className="">{roomCount}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>STAFF</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>{staffCount}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Booked Room</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <h1>42</h1>
        </div>
      </div>

      {/* <div className="charts">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#8884d8" />
            <Bar dataKey="uv" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div> */}
    </main>
  );
}

export default Home;
