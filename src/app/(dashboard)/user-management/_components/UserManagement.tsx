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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ViewDetailsModal } from "@/components/Reusealbe/ViewDetailsModal";

const users = [
  {
    id: "USR-001",
    name: "Olivia Rhye",
    email: "olivia@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    role: "Admin",
    joinDate: "Jan 06, 2025",
    status: "Active",
    lastActive: "Nov 12, 2025",
  },
  {
    id: "USR-002",
    name: "James Smith",
    email: "james@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    role: "Editor",
    joinDate: "Feb 14, 2025",
    status: "Inactive",
    lastActive: "Nov 10, 2025",
  },
  {
    id: "USR-003",
    name: "Sophia Lee",
    email: "sophia@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
    role: "User",
    joinDate: "Mar 20, 2025",
    status: "Active",
    lastActive: "Nov 11, 2025",
  },
];

export default function UserManagement() {
  return (
    <div>
      <div className="w-full bg-gray-50 py-10">
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
            <Select defaultValue="all-user">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-user">All User</SelectItem>
                <SelectItem value="active-user">Active User</SelectItem>
                <SelectItem value="inactive-user">Inactive User</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-role">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-role">All Role</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
              </SelectContent>
            </Select>

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
                User
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">
                Role
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">
                Join Date
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">
                Status
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">
                Last Active
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                {/* User */}
                <TableCell className="font-normal text-sm text-gray-900">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell className="text-sm text-gray-600">
                  {user.role}
                </TableCell>

                {/* Join Date */}
                <TableCell className="text-sm text-gray-600">
                  {user.joinDate}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant={
                      user.status === "Active" ? "secondary" : "destructive"
                    }
                    className={`font-medium px-2.5 py-0.5 text-xs border-0 ${
                      user.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                        : "bg-red-50 text-red-700 hover:bg-red-50"
                    }`}
                  >
                    {user.status}
                  </Badge>
                </TableCell>

                {/* Last Active */}
                <TableCell className="text-sm text-gray-600">
                  {user.lastActive}
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
                      {/* Open the modal with a normal button */}
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
