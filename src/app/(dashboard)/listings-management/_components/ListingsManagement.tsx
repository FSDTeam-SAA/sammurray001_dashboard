"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  MoreVertical,
  Trash,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ListingDataView } from "@/components/Reusealbe/ListingDataView";

type ListingType = {
  _id: string;
  name: string;
};

type ListingUser = {
  fullName: string;
  email: string;
  profileImage?: string;
};

type ListingItem = {
  _id: string;
  title: string;
  price: number;
  type: ListingType | null;
  address: string;
  country: string;
  city: string;
  user?: ListingUser;
};

type ListingApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: ListingItem[];
};

export default function ListingsManagement() {
  const limit = 10;

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const { data: listingData, isLoading } = useQuery<ListingApiResponse>({
    queryKey: ["listing-data", currentPage, debouncedSearch],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append("page", String(currentPage));
      queryParams.append("limit", String(limit));
      if (debouncedSearch) queryParams.append("searchTerm", debouncedSearch);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/listing/?${queryParams.toString()}`
      );
      return res.json();
    },
    // keepPreviousData: true,
  });

  const listings = listingData?.data ?? [];
  const totalItems = listingData?.meta?.total ?? 0;
  const totalPages = Math.ceil(totalItems / limit);

  const formatPrice = (price: number) => {
    if (price < 0) return `-${Math.abs(price).toLocaleString()}`;
    return price.toLocaleString();
  };

  return (
    <div>
      {/* ---------- Search ---------- */}
      <div className="w-full bg-gray-50 pb-10">
        <div className="flex items-center gap-3">
          <div className="flex-none w-[400px] relative">
            <Input
              type="text"
              placeholder="Search listing title"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full h-[50px] pr-24"
            />
            <Button className="absolute right-1 top-1/2 -translate-y-1/2 bg-teal-600 hover:bg-teal-700 h-10">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* ---------- Table ---------- */}
      <div className="w-full bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E8F8F6] hover:bg-gray-50">
              <TableHead className="pl-10 text-gray-600 text-xs font-medium">
                Listing Title
              </TableHead>
              <TableHead className="text-gray-600 text-xs font-medium">
                Provider
              </TableHead>
              <TableHead className="text-gray-600 text-xs font-medium">
                Category
              </TableHead>
              <TableHead className="text-gray-600 text-xs font-medium">
                Price
              </TableHead>
              <TableHead className="text-gray-600 text-xs font-medium">
                Status
              </TableHead>
              <TableHead className="text-gray-600 text-xs font-medium">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j} className="py-2">
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : listings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                  No listings found.
                </TableCell>
              </TableRow>
            ) : (
              listings.map((listing) => (
                <TableRow key={listing._id} className="hover:bg-gray-50">
                  {/* Listing Title */}
                  <TableCell className="pl-10">{listing.title}</TableCell>

                  {/* Provider */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={listing.user?.profileImage || ""} />
                        <AvatarFallback>
                          {listing.user?.fullName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {listing.user?.fullName ?? "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {listing.user?.email ?? "no-email@domain.com"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>{listing.type?.name ?? "N/A"}</TableCell>

                  {/* Price */}
                  <TableCell>${formatPrice(listing.price)}</TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge className="bg-emerald-50 text-emerald-700">Active</Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Popover>
                      <PopoverTrigger>
                        <Button variant="ghost" size="icon">
                          <MoreVertical />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-28 p-0">
                        

                        <ListingDataView  listingId={listing?._id}/>
                        <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-red-600">
                          <Trash className="h-4 w-4" /> Delete
                        </button>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* ---------- Pagination ---------- */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-2 p-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
