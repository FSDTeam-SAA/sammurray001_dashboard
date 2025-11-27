"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import Image from "next/image";

type ListingData = {
  _id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  size: string;
  city: string;
  country: string;
  mounth: string;
  areaya: string;
  type?: {
    _id: string;
    name: string;
  };
  user?: {
    fullName: string;
    email: string;
    phone?: string;
    profileImage?: string;
    role?: string;
  };
  extraLocation?: {
    type: string;
    coordinates: number[];
  };
};

export function ListingDataView({ listingId }: { listingId: string }) {
  const { data: listingData, isLoading } = useQuery<ListingData>({
    queryKey: ["listing-data", listingId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/listing/${listingId}`
      );
      const json = await res.json();
      return json.data;
    },
    enabled: !!listingId,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-black">
                          <Edit className="h-4 w-4" /> Views
                        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] bg-white rounded-lg shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Listing Details</DialogTitle>
          <DialogDescription className="text-gray-600 mt-1">
            Full information about this listing.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="text-center py-4">Loading...</p>
        ) : listingData ? (
          <div className="space-y-6 mt-4">
            {/* Listing Info */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Listing Information
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium text-gray-700">Title:</div>
                <div>{listingData.title}</div>

                <div className="font-medium text-gray-700">Description:</div>
                <div>{listingData.description}</div>

                <div className="font-medium text-gray-700">Price:</div>
                <div>৳{listingData.price.toLocaleString()}</div>

                <div className="font-medium text-gray-700">Address:</div>
                <div>{listingData.address}</div>

                <div className="font-medium text-gray-700">Size:</div>
                <div>{listingData.size}</div>

                <div className="font-medium text-gray-700">City:</div>
                <div>{listingData.city}</div>

                <div className="font-medium text-gray-700">Country:</div>
                <div>{listingData.country}</div>

                <div className="font-medium text-gray-700">Month:</div>
                <div>{listingData.mounth}</div>

                <div className="font-medium text-gray-700">Area:</div>
                <div>{listingData.areaya}</div>

                <div className="font-medium text-gray-700">Category:</div>
                <div>{listingData.type?.name ?? "N/A"}</div>
              </div>
            </div>

            {/* Provider Info */}
            {listingData.user && (
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                {listingData.user.profileImage && (
                  <Image
                  width={300}
                  height={300}
                    src={listingData.user.profileImage}
                    alt={listingData.user.fullName}
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Provider Information
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium text-gray-700">Name:</div>
                    <div>{listingData.user.fullName}</div>

                    <div className="font-medium text-gray-700">Email:</div>
                    <div>{listingData.user.email}</div>

                    {listingData.user.phone && (
                      <>
                        <div className="font-medium text-gray-700">Phone:</div>
                        <div>{listingData.user.phone}</div>
                      </>
                    )}

                    <div className="font-medium text-gray-700">Role:</div>
                    <div>{listingData.user.role}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Extra Location */}
            {listingData.extraLocation?.coordinates?.length === 2 && (
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Location
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium text-gray-700">Latitude:</div>
                  <div>{listingData.extraLocation.coordinates[1]}</div>

                  <div className="font-medium text-gray-700">Longitude:</div>
                  <div>{listingData.extraLocation.coordinates[0]}</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center py-4">No data available</p>
        )}

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
