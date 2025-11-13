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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const transactions = [
  {
    id: "TXN-001",
    user: {
      name: "Olivia Rhye",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
      email: "olivia@example.com",
    },
    type: "Booking",
    price: "৳15,000",
    status: "Completed",
    date: "Jan 06, 2025",
  },
  {
    id: "TXN-002",
    user: {
      name: "James Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      email: "james@example.com",
    },
    type: "Subscription",
    price: "৳3,000",
    status: "Completed",
    date: "Feb 10, 2025",
  },
  {
    id: "TXN-003",
    user: {
      name: "Sophia Lee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
      email: "sophia@example.com",
    },
    type: "Booking",
    price: "৳20,000",
    status: "Completed",
    date: "Mar 12, 2025",
  },
];

export default function Payments() {
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
                Transaction ID
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">
                User
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">
                Types
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">
                Price
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">
                Status
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.map((txn) => (
              <TableRow
                key={txn.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                {/* Transaction ID */}
                <TableCell className="font-normal text-sm text-gray-900">
                  {txn.id}
                </TableCell>

                {/* User */}
                <TableCell className="text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={txn.user.avatar} alt={txn.user.name} />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {txn.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {txn.user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {txn.user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Type */}
                <TableCell className="text-sm text-gray-600">
                  {txn.type}
                </TableCell>

                {/* Price */}
                <TableCell className="text-sm text-gray-900">
                  {txn.price}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant={
                      txn.status === "Completed" ? "secondary" : "destructive"
                    }
                    className={`font-medium px-2.5 py-0.5 text-xs border-0 ${
                      txn.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                        : "bg-red-50 text-red-700 hover:bg-red-50"
                    }`}
                  >
                    {txn.status}
                  </Badge>
                </TableCell>

                {/* Date */}
                <TableCell className="text-sm text-gray-600">
                  {txn.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
