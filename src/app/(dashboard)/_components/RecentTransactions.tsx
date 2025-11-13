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

const transactions = [
  {
    id: "TXN-2025-001",
    user: {
      name: "Olivia Rhye",
      email: "olivia@untitledui.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    },
    type: "Booking",
    price: "15,000",
    status: "Completed",
    date: "Jan 06, 2025",
  },
  {
    id: "TXN-2025-001",
    user: {
      name: "Olivia Rhye",
      email: "olivia@untitledui.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    },
    type: "Booking",
    price: "3,000",
    status: "Completed",
    date: "Jan 06, 2025",
  },
  {
    id: "TXN-2025-001",
    user: {
      name: "Olivia Rhye",
      email: "olivia@untitledui.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    },
    type: "Subscriptions",
    price: "3,000",
    status: "Completed",
    date: "Jan 06, 2025",
  },
  {
    id: "TXN-2025-001",
    user: {
      name: "Olivia Rhye",
      email: "olivia@untitledui.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    },
    type: "Subscriptions",
    price: "15,000",
    status: "Completed",
    date: "Jan 06, 2025",
  },
  {
    id: "TXN-2025-001",
    user: {
      name: "Olivia Rhye",
      email: "olivia@untitledui.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    },
    type: "Booking",
    price: "3,000",
    status: "Completed",
    date: "Jan 06, 2025",
  },
];

export default function RecentTransactions() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[18px] font-semibold leading-[120%]">
          Recent Transactions
        </h1>
        <h3 className="text-[#0D9488]">See All</h3>
      </div>
      <div className="w-full bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E8F8F6] hover:bg-gray-50">
              <TableHead className="font-medium text-gray-600 text-xs">
                Transaction ID
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">
                User
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-xs">
                Type
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
            {transactions.map((transaction, index) => (
              <TableRow
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <TableCell className="font-normal text-sm text-gray-900">
                  {transaction.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={transaction.user.avatar}
                        alt={transaction.user.name}
                      />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {transaction.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {transaction.user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {transaction.user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {transaction.type}
                </TableCell>
                <TableCell className="text-sm text-gray-900">
                  {transaction.price}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 font-medium px-2.5 py-0.5 text-xs border-0"
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {transaction.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
