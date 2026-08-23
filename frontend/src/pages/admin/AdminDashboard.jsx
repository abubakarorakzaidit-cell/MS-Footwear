import React, { useEffect, useState } from "react";
import { FiBox, FiClipboard, FiClock, FiCheckCircle, FiDollarSign } from "react-icons/fi";
import { fetchDashboardStats } from "../../services/adminService";
import Loader from "../../components/Loader";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="card flex items-center gap-4 p-5">
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
      <Icon size={22} />
    </span>
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="text-xl font-bold text-ink">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => setStats(data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard..." fullPage />;

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-ink">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={FiBox} label="Total Products" value={stats?.totalProducts ?? 0} />
        <StatCard icon={FiClipboard} label="Total Orders" value={stats?.totalOrders ?? 0} />
        <StatCard icon={FiClock} label="Pending Orders" value={stats?.pendingOrders ?? 0} />
        <StatCard icon={FiCheckCircle} label="Completed Orders" value={stats?.completedOrders ?? 0} />
        <StatCard
          icon={FiDollarSign}
          label="Total Sales"
          value={`Rs. ${(stats?.totalSales ?? 0).toLocaleString("en-PK")}`}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
