"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { X, MessageSquare, Edit } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  profileImage?: string;
  verified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export function ViewDetailsModal({ userId }: { userId: string }) {
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;

  const { data: singleUser, isLoading } = useQuery<User>({
    queryKey: ["user-data", userId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const json = await res.json();
      return json.data;
    },
    enabled: !!TOKEN && !!userId,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full">
          <Edit className="h-4 w-4" /> View
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-0">
        <div className="relative">
          {/* Close button */}
          <DialogTrigger asChild>
            <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </DialogTrigger>

          {/* Profile Image */}
          <div className="flex justify-start px-5 pt-8 pb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              {isLoading ? (
                <div className="w-full h-full bg-gray-300 animate-pulse"></div>
              ) : (
                <Image
                  width={300}
                  height={300}
                  src={singleUser?.profileImage ?? "/Images/sum-user.jpg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-4">
            {isLoading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <>
                {/* Full Name & Role */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Full Name</p>
                    <p className="text-sm font-medium">{singleUser?.fullName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Role</p>
                    <p className="text-sm font-medium">{singleUser?.role}</p>
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm font-medium">{singleUser?.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                    <p className="text-sm font-medium">+880786 2345678</p>
                  </div>
                </div>

                {/* Verification Status & Account Status */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Verification Status
                    </p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        singleUser?.verified
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {singleUser?.verified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Account Status</p>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                      Active
                    </span>
                  </div>
                </div>

                {/* Joined & Last Active */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Joined</p>
                    <p className="text-sm font-medium text-teal-600">
                      {new Date(singleUser?.createdAt ?? "").toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Last Active</p>
                    <p className="text-sm font-medium">
                      {new Date(singleUser?.updatedAt ?? "").toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Listing */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Listing</p>
                    <p className="text-sm font-medium text-teal-600">24 Active Ads</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1"></p>
                    <p className="text-sm font-medium text-purple-600">
                      Total Revenue
                    </p>
                    <p className="text-lg font-semibold">৳</p>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Documents</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">
                        📄 National ID Certificate.pdf
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-teal-600 border-teal-600"
                      >
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">🆔 ID Verification.jpg</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-teal-600 border-teal-600"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                  >
                    ✕ Suspend
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                  >
                    🗑 Delete
                  </Button>
                  <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
