export default function Dashboard() {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Total Rooms</h3>
            <p className="text-3xl font-bold">50</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Available Rooms</h3>
            <p className="text-3xl font-bold">20</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Total Guests</h3>
            <p className="text-3xl font-bold">135</p>
          </div>
        </div>
      </div>
    );
  }
  