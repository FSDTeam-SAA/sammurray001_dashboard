/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { MoreVertical, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  agentApproved?: boolean;
}

export default function AgentManagement() {
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [agentStatus, setAgentStatus] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ====================== FETCH USERS ======================
  const {
    data: usersData,
    isLoading,
    isError,
  } = useQuery<User[]>({
    queryKey: ["userData", searchQuery, agentStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("searchTerm", searchQuery);
      params.append("role", "AGENT");

      if (agentStatus !== "all") params.append("agentApproved", agentStatus);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/all-user?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      const json = await res.json();
      return json.data as User[];
    },
    enabled: !!TOKEN,
  });

  // ====================== HANDLE APPROVE ======================
  const handleApprove = async (userId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/approved-agent/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to approve agent");

      toast.success("Agent Approved Successfully!");
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // ====================== HANDLE REJECT ======================
  const handleReject = async (userId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/reject-agent/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to reject agent");

      toast.success("Agent Rejected Successfully!");
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // ====================== HANDLE DELETE ======================
  const handleDelete = async (userId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${TOKEN}` },
        }
      );

      if (!res.ok) throw new Error("Failed to delete user");

      toast.success("User Deleted Successfully!");
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    } catch (err) {
      console.error(err);
    }
  };

  // Pagination
  const paginatedData = usersData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = usersData ? Math.ceil(usersData.length / itemsPerPage) : 1;

  return (
    <div>
      {/* ====================== SEARCH + FILTER ====================== */}
      <div className="w-full bg-gray-50 py-10">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-none w-[400px] relative">
            <Input
              type="text"
              placeholder="Search by user name"
              className="w-full h-[50px] pr-24"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="absolute right-1 top-1/2 -translate-y-1/2 bg-teal-600 hover:bg-teal-700 h-10">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {/* FILTER */}
          <div className="ml-auto flex items-center gap-3">
            <Select value={agentStatus} onValueChange={setAgentStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Approved</SelectItem>
                <SelectItem value="false">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ====================== TABLE ====================== */}
      <div className="w-full bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E8F8F6]">
              <TableHead className="pl-10">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* LOADING */}
            {isLoading &&
              [...Array(3)].map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <TableCell key={i}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {/* NO DATA FOUND */}
            {!isLoading && paginatedData?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                  No agent found for this filter/search.
                </TableCell>
              </TableRow>
            )}

            {/* DATA ROWS */}
            {!isLoading &&
              paginatedData?.map((user) => (
                <TableRow key={user._id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profileImage || ""} />
                        <AvatarFallback>
                          {user.fullName?.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{user.role}</TableCell>

                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={
                        user.agentApproved
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }
                    >
                      {user.agentApproved ? "Approved" : "Rejected"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <Popover>
                      <PopoverTrigger>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical />
                        </button>
                      </PopoverTrigger>

                      <PopoverContent className="w-40 p-2 space-y-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleApprove(user._id)}
                          disabled={user.agentApproved === true} // disable if already approved
                        >
                          Approve
                        </Button>

                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => handleReject(user._id)}
                          disabled={user.agentApproved === false} // disable if already rejected
                        >
                          Reject
                        </Button>

                        <DeleteModal onConfirm={() => handleDelete(user._id)} />
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}

            {/* ERROR */}
            {isError && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-red-500">
                  Failed to load users
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ====================== PAGINATION ====================== */}
      {usersData && usersData.length > itemsPerPage && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
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
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
}
