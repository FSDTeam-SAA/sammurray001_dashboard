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
  Edit,
  Trash,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

type ListingType = {
  _id: string;
  name: string;
};

type ListingItem = {
  _id: string;
  title: string;
  price: number;
  type: ListingType;
  address: string;
  country: string;
  city: string;
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

  // ---------- 🔍 Search & Filter States ----------
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);

  // ---------- ⏳ Debounce Search ----------
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  // ---------- API Request ----------
  const { data: listingData } = useQuery<ListingApiResponse>({
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
  });

  const listings = listingData?.data ?? [];
  const totalItems = listingData?.meta?.total ?? 0;
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div>
      {/* ---------- Header Search & Filters ---------- */}
      <div className="w-full bg-gray-50 pb-10">
        <div className="flex items-center gap-3">
          {/* Search Box */}
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
              <TableHead className="font-medium text-gray-600 text-xs pl-10">
                Listing Title
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">
                Provider
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">
                Category
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">
                Price
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">
                Status
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing._id}>
                <TableCell>{listing.title}</TableCell>

                {/* Provider (fake since API doesn't provide) */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="https://avatar.iran.liara.run/public/60.png" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium">Unknown User</span>
                      <span className="block text-xs text-gray-500">
                        no-email@domain.com
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>{listing.type?.name ?? "N/A"}</TableCell>
                <TableCell>৳{listing.price}</TableCell>

                <TableCell>
                  <Badge className="bg-emerald-50 text-emerald-700">
                    Active
                  </Badge>
                </TableCell>

                <TableCell>
                  <Popover>
                    <PopoverTrigger>
                      <MoreVertical />
                    </PopoverTrigger>
                    <PopoverContent className="w-28 p-0">
                      <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100">
                        <Edit className="h-4 w-4" /> Edit
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 text-red-600">
                        <Trash className="h-4 w-4" /> Delete
                      </button>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
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
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
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
