"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BadgeCheck, CreditCard, Clock, FileText, Layers } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Subscription {
  _id: string;
  name: string;
  discription: string;
  amount: number;
  type: string;
  status: string;
}

const SubscriptionPage = () => {
  const [isActive, setIsActive] = useState(false);
  const session = useSession();
  const TOKEN = session.data?.user?.accessToken || "";

  // Fetch subscription
  const { data, isLoading, isError, refetch } = useQuery<{
    data: Subscription[];
  }>({
    queryKey: ["subscriptionData"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/subscription`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch subscription data");
      return res.json();
    },
  });

  const subscription = data?.data?.[0];

  // Set initial toggle state based on API
  useEffect(() => {
    if (subscription) setIsActive(subscription.status === "active");
  }, [subscription]);

  // Mutation to update subscription status
  const subscriptionUpdateMutation = useMutation({
    mutationFn: async (status: boolean) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/subscription/status/${subscription?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({ isActive: status }),
        }
      );

      if (!res.ok) throw new Error("Failed to update subscription status");
      return res.json();
    },
    onSuccess: () => {
      refetch(); // Refresh subscription data
      toast.success("Subscription status updated successfully!");
    },
    onError: (err) => {
      toast.info(err.message || "Something went wrong");
    },
  });

  const handleToggle = (checked: boolean) => {
    setIsActive(checked);
    subscriptionUpdateMutation.mutate(checked);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading subscription...
      </div>
    );
  }

  if (isError || !subscription) {
    return (
      <div className="flex justify-center items-center h-screen text-red-400">
        No subscription data found.
      </div>
    );
  }

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-[450px] bg-[#0E1635] border border-white/10 text-white shadow-lg rounded-2xl relative">
        {/* EDIT BUTTON */}
        <Link href={`/subscription/${subscription._id}`}>
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 transition rounded-full border border-white/10"
            title="Edit Subscription"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </Link>

        {/* HEADER */}
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-semibold flex items-center gap-2 text-white">
            <Layers className="w-6 h-6 text-blue-400" />
            Subscription Overview
          </CardTitle>
        </CardHeader>

        {/* BODY CONTENT */}
        <CardContent className="space-y-6 pt-4">
          {/* PLAN NAME */}
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <p className="flex items-center gap-2 text-sm text-gray-300">
              <BadgeCheck className="w-4 h-4 text-blue-400" />
              Plan Name
            </p>
            <p className="text-xl font-semibold mt-1">{subscription.name}</p>
          </div>

          {/* AMOUNT & TYPE */}
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="flex items-center gap-2 text-sm text-gray-300">
                <CreditCard className="w-4 h-4 text-green-400" />
                Amount
              </p>
              <p className="text-lg font-medium mt-1">${subscription.amount}</p>
            </div>

            <div className="flex-1 bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="flex items-center gap-2 text-sm text-gray-300">
                <Clock className="w-4 h-4 text-yellow-400" />
                Type
              </p>
              <p className="text-lg font-medium mt-1">{subscription.type}</p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <p className="flex items-center gap-2 text-sm text-gray-300">
              <FileText className="w-4 h-4 text-purple-400" />
              Description
            </p>
            <p className="text-base mt-1 leading-relaxed">
              {subscription.discription.slice(0, 150)}...
            </p>
          </div>

          {/* STATUS */}
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex justify-between items-center">
            <p className="text-sm text-gray-300">Status</p>
            <span
              className={`px-3 py-1 text-sm rounded-full capitalize ${
                subscription.status === "active"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {subscription.status}
            </span>
          </div>

          {/* SWITCH ON/OFF */}
          <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10">
            <Label
              htmlFor="subscription-toggle"
              className="text-sm font-medium text-white"
            >
              Subscription Mode
            </Label>
            <Switch
              id="subscription-toggle"
              checked={isActive}
              onCheckedChange={handleToggle}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPage;
