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
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import Link from "next/link";

// ✅ TypeScript interfaces for API response
interface User {
  _id: string;
  fullName: string;
  email: string;
  profileImage: string;
}

interface Subscription {
  _id: string;
  name: string;
  discription: string;
  amount: number;
  type: string;
}

interface Transaction {
  _id: string;
  user: User;
  subscription: Subscription;
  stripeSessionId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export default function RecentTransactions() {

  const { data: session } = useSession();
    const TOKEN = session?.user?.accessToken;

  const { data: transactionData, isLoading, isError } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      const json = await res.json();
      return json.data as Transaction[];
    },
   enabled: !!TOKEN,
  });

  const skeletonRows = Array.from({ length: 3 });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[18px] font-semibold leading-[120%]">Recent Transactions</h1>
        <Link href="/payments" className="text-[#0D9488] cursor-pointer">See All</Link>
      </div>

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
            {isLoading &&
              skeletonRows.map((_, index) => (
                <TableRow key={index} className="border-b border-gray-100">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <TableCell key={i}>
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            }

            {isError && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-red-500 p-4">
                  Failed to load transactions
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && transactionData?.slice(0,5)?.map((transaction) => (
              <TableRow key={transaction._id} className="border-b border-gray-100 hover:bg-gray-50">
                <TableCell className="font-normal text-sm text-gray-900">{transaction._id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={transaction.user.profileImage} alt={transaction.user.fullName} />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {transaction.user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{transaction.user.fullName}</span>
                      <span className="text-xs text-gray-500">{transaction.user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">{transaction.subscription?.type}</TableCell>
                <TableCell className="text-sm text-gray-900">{transaction.amount} {transaction.currency.toUpperCase()}</TableCell>
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
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
