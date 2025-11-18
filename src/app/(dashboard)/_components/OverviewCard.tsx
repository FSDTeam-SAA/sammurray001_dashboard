"use client";

import React from "react";
import { Users, Briefcase, User, Eye, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";

function OverviewCard() {
  const { data: session, status } = useSession();
  const TOKEN = session?.user?.accessToken;

  // TanStack Query: only enabled if token exists
  const { data, isLoading, isError } = useQuery({
    queryKey: ["overviewData"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/dashboard/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      const json = await res.json();
      return json.data;
    },
    enabled: !!TOKEN, // ✅ Only run query when token is ready
  });

  const cards = [
    { id: 1, title: "Total Users", value: data?.totalUser ?? 0, change: "+12.5%", icon: Users, bgColor: "bg-blue-500" },
    { id: 2, title: "Active Providers", value: data?.totalActiveProperty ?? 0, change: "+8.2%", icon: Briefcase, bgColor: "bg-green-500" },
    { id: 3, title: "Active Clients", value: data?.subscriptionData ?? 0, change: "+5.3%", icon: User, bgColor: "bg-purple-500" },
    { id: 4, title: "Total Listings", value: data?.totalListing ?? 0, change: "+10.1%", icon: Eye, bgColor: "bg-orange-500" },
    { id: 5, title: "Total Revenue", value: data?.totalRevenue ?? 0, change: "+22.4%", icon: DollarSign, bgColor: "bg-yellow-500" },
  ];

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 flex-1 min-w-[200px] border border-[#0000001A]">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <Skeleton className="w-16 h-5 rounded" />
      </div>
      <Skeleton className="w-24 h-4 mb-2 rounded" />
      <Skeleton className="w-32 h-7 rounded" />
    </div>
  );

  // Show skeleton while loading session or query
  if (status === "loading" || isLoading) {
    return (
      <div className="flex gap-4 flex-wrap p-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (isError || !data)
    return <p className="p-6 text-red-500 text-center">Failed to load overview data</p>;

  return (
    <div className="flex gap-4 flex-wrap p-6">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white rounded-xl shadow-sm p-6 flex-1 min-w-[200px] hover:shadow-md transition-shadow border border-[#0000001A]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${card.bgColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>

              <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>{card.change}</span>
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OverviewCard;
