"use client";

import React from "react";
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
import { MoreVertical, Edit, Trash, Search } from "lucide-react";
import { ViewDetailsModal } from "@/components/Reusealbe/ViewDetailsModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const listings = [
  {
    id: "LST-001",
    title: "Luxury Apartment Downtown",
    provider: {
      name: "Olivia Rhye",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
      email: "email@gmail.com",
    },
    category: "Real Estate",
    price: "৳150,000",
    status: "Active",
  },
  {
    id: "LST-002",
    title: "Modern Office Space",
    provider: {
      name: "James Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      email: "email@gmail.com",
    },
    category: "Commercial",
    price: "৳200,000",
    status: "Inactive",
  },
  {
    id: "LST-003",
    title: "Cozy Studio Apartment",
    provider: {
      name: "Sophia Lee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
      email: "email@gmail.com",
    },
    category: "Real Estate",
    price: "৳90,000",
    status: "Active",
  },
];

export default function ListingsManagement() {
  return (
    <div>
      <div className="w-full bg-gray-50 pb-10">
        <div className="flex items-center gap-3">
          <div className="flex-none w-[400px] relative">
            <Input
              type="text"
              placeholder="Search by user name"
              className="w-full h-[50px] pr-24"
            />
            <Button className="absolute right-1 top-1/2 -translate-y-1/2 bg-teal-600 hover:bg-teal-700 h-10">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Select defaultValue="all-status">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="w-full bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E8F8F6] hover:bg-gray-50">
              <TableHead className="font-medium text-gray-600 text-xs text-start pl-10">
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
              <TableRow
                key={listing.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                {/* Listing Title */}
                <TableCell className="font-normal text-sm text-gray-900">
                  {listing.title}
                </TableCell>

                {/* Provider */}
                {/* Provider */}
                <TableCell className="text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={listing.provider.avatar}
                        alt={listing.provider.name}
                      />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {listing.provider.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {listing.provider.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {listing.provider.email}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell className="text-sm text-gray-600">
                  {listing.category}
                </TableCell>

                {/* Price */}
                <TableCell className="text-sm text-gray-900">
                  {listing.price}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant={
                      listing.status === "Active" ? "secondary" : "destructive"
                    }
                    className={`font-medium px-2.5 py-0.5 text-xs border-0 ${
                      listing.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                        : "bg-red-50 text-red-700 hover:bg-red-50"
                    }`}
                  >
                    {listing.status}
                  </Badge>
                </TableCell>

                {/* Action */}
                <TableCell className="text-sm text-gray-600">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-28 p-0 border border-gray-200">
                      <ViewDetailsModal />

                      <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full">
                        <Edit className="h-4 w-4" /> Edit
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-red-600">
                        <Trash className="h-4 w-4" /> Delete
                      </button>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
