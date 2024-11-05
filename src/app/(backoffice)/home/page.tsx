export default function HomePage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold">Total Users</h3>
        <p className="text-3xl font-bold text-blue-600">1,257</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold">Active Sessions</h3>
        <p className="text-3xl font-bold text-green-600">423</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold">Revenue</h3>
        <p className="text-3xl font-bold text-purple-600">$12,426</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold">Conversion Rate</h3>
        <p className="text-3xl font-bold text-orange-600">2.4%</p>
      </div>
    </div>
  );
}
