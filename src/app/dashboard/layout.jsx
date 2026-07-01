'use client';

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0A0918] flex overflow-hidden">
      <DashboardSidebar />

      <main className="flex-1 md:ml-[240px] min-h-screen p-4 md:p-6 lg:p-8 bg-[#0A0918]">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;