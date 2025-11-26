"use client";

import React, { useState } from "react";
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
import { MoreVertical, Edit, Search, ChevronLeft, ChevronRight } from "lucide-react";
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
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { DeleteModal } from "@/components/Reusealbe/DeleteModal";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  verified?: boolean;
}

interface UserResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: User[];
}

export default function UserManagement() {
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;

  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState("all-role");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: usersResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery<UserResponse>({
    queryKey: ["userData", searchQuery, userRole, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("searchTerm", searchQuery);
      if (userRole !== "all-role") params.append("role", userRole);
      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/all-user?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    enabled: !!TOKEN,
  });

  const handleDelete = async (userId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete user");

      toast.success("User Deleted Successfully!");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  const totalPages = usersResponse
    ? Math.ceil(usersResponse.meta.total / itemsPerPage)
    : 1;

  const skeletonRows = Array.from({ length: 3 });

  return (
    <div>
      {/* Search and Filters */}
      <div className="w-full bg-gray-50 py-10 flex items-center gap-3">
        <div className="flex-none w-[400px] relative">
          <Input
            type="text"
            placeholder="Search by user name"
            className="w-full h-[50px] pr-24"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-teal-600 hover:bg-teal-700 h-10"
            onClick={() => setCurrentPage(1)}
          >
            <Search className="w-4 h-4 mr-2" /> Search
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Select value={userRole} onValueChange={(value) => setUserRole(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-role">All Role</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="TENANT">Tenant</SelectItem>
              <SelectItem value="SUPPLIER">Supplier</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
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
            {isLoading &&
              skeletonRows.map((_, index) => (
                <TableRow key={index} className="border-b border-gray-100">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <TableCell key={i}>
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {isError && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-red-500 p-4">
                  Failed to load users
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !isError &&
              usersResponse?.data.map((user) => (
                <TableRow
                  key={user._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <TableCell className="font-normal text-sm text-gray-900">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profileImage ?? ""} alt={user.fullName} />
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {user.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {user.fullName}
                        </span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-gray-600">{user.role}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.verified ? "secondary" : "destructive"}
                      className={`font-medium px-2.5 py-0.5 text-xs border-0 ${
                        user.verified
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                          : "bg-red-50 text-red-700 hover:bg-red-50"
                      }`}
                    >
                      {user.verified ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="p-1 rounded hover:bg-gray-100">
                          <MoreVertical className="h-5 w-5 text-gray-600" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-28 p-0 border border-gray-200 flex flex-col gap-1">
                        <ViewDetailsModal userId={user._id} />
                        <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full">
                          <Edit className="h-4 w-4" /> Edit
                        </button>
                        <DeleteModal onConfirm={() => handleDelete(user._id)} />
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 ||
              page === totalPages ||
              Math.abs(currentPage - page) <= 1
            ) {
              return (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            } else if (Math.abs(currentPage - page) === 2) {
              return (
                <span key={page} className="text-gray-500 px-1">
                  ...
                </span>
              );
            }
            return null;
          })}

          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
