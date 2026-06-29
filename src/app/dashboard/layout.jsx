import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <DashboardSidebar />

      <main className="flex-1 md:ml-64 min-h-screen p-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;