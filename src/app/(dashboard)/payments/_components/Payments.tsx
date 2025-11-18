"use client";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { useState } from "react";

// TYPES
interface User {
  fullName: string;
  email: string;
  profileImage: string;
}

interface Subscription {
  type: string;
}

interface Transaction {
  _id: string;
  user: User;
  subscription: Subscription;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export default function Payments() {
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;

  const [searchText, setSearchText] = useState("");

  const { data: transactionData = [], isLoading, isError } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const json = await res.json();
      return json.data as Transaction[];
    },
    enabled: !!TOKEN,
  });

  // ⭐ FILTER LOGIC LIKE USER MANAGEMENT
  const filteredTransactions = transactionData.filter((t) =>
    t.user.fullName.toLowerCase().includes(searchText.toLowerCase())
  );

  const skeletonRows = Array.from({ length: 3 });

  return (
    <div>
      {/* SEARCH BAR */}
      <div className="w-full bg-gray-50 pb-10">
        <div className="flex items-center gap-3">
          <div className="flex-none w-[400px] relative">
            <Input
              type="text"
              placeholder="Search by user name"
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

      {/* TABLE */}
      <div className="w-full bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E8F8F6] hover:bg-gray-50">
              <TableHead className="font-medium text-gray-600 text-xs">Transaction ID</TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">User</TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">Type</TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">Price</TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">Status</TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* LOADING */}
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

            {/* ERROR */}
            {isError && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-red-500 p-4">
                  Failed to load transactions
                </TableCell>
              </TableRow>
            )}

            {/* DATA (SEARCH + ORIGINAL) */}
            {!isLoading &&
              !isError &&
              filteredTransactions.map((transaction) => (
                <TableRow
                  key={transaction._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <TableCell className="font-normal text-sm text-gray-900">
                    {transaction._id}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={transaction.user.profileImage || ""}
                          alt={transaction.user.fullName}
                        />
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {transaction.user.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {transaction.user.fullName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {transaction.user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-gray-600">
                    {transaction.subscription.type}
                  </TableCell>

                  <TableCell className="text-sm text-gray-900">
                    {transaction.amount} {transaction.currency?.toUpperCase()}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${
                        transaction.status === "completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-yellow-50 text-yellow-700"
                      } hover:bg-transparent font-medium px-2.5 py-0.5 text-xs border-0`}
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-gray-600">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}

            {/* NO DATA */}
            {!isLoading && filteredTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center p-4 text-gray-500">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
