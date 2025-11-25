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
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// ================== Interfaces ===================
interface PropertyType {
  _id: string;
  name: string;
  createBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PropertyTypeResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: PropertyType[];
}

// ================== Component ===================
export default function PropertyType() {
  const [newPropertyType, setNewPropertyType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;

  // ================== Fetch Property Types ===================
  const { data: propertyData, refetch, isLoading } = useQuery<PropertyTypeResponse>({
    queryKey: ["propertyTypes", currentPage],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/propertytype?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch property types");
      return res.json();
    },
    enabled: !!TOKEN,
  });

  const totalPages = propertyData
    ? Math.ceil(propertyData.meta.total / itemsPerPage)
    : 0;

  // ================== Add Property Type ===================
  const addMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/propertytype`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ name: newPropertyType }),
      });
      if (!res.ok) throw new Error("Failed to add property type");
      return res.json();
    },
    onSuccess: () => {
      setNewPropertyType("");
      toast.success("Property type added successfully");
      refetch();
    },
    onError: () => toast.error("Error adding property type"),
  });

  // ================== Update Property Type ===================
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!selectedId) return;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/propertytype/${selectedId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({ name: editName }),
        }
      );
      if (!res.ok) throw new Error("Failed to update property type");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Property type updated successfully");
      setSelectedId(null);
      setEditName("");
      refetch();
    },
    onError: () => toast.error("Failed to update property type"),
  });

  // ================== Delete Property Type ===================
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/propertytype/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete property type");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Property type deleted successfully");
      refetch();
    },
    onError: () => toast.error("Failed to delete property type"),
  });

  const handleAdd = () => {
    if (!newPropertyType.trim()) return;
    addMutation.mutate();
  };

  const handleEdit = (id: string, name: string) => {
    setSelectedId(id);
    setEditName(name);
  };

  const handleUpdate = () => {
    if (!editName.trim()) return;
    updateMutation.mutate();
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const goToPage = (page: number) => setCurrentPage(page);

  // ================== JSX ===================
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ===== Property Type List Table ===== */}
      <div>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Property Types
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#0080001A] border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-900 text-[16px] py-4 px-6">
                      Name
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 text-[16px] py-4 px-6 text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-10">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : propertyData?.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-10 text-gray-500">
                        No property types found
                      </TableCell>
                    </TableRow>
                  ) : (
                    propertyData?.data.map((item) => (
                      <TableRow
                        key={item._id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="text-sm text-gray-700 py-4 px-6">
                          {selectedId === item._id ? (
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                          ) : (
                            item.name
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700 py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {selectedId === item._id ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleUpdate}
                              >
                                Save
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => handleEdit(item._id, item.name)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDelete(item._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* ===== Pagination ===== */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing page {currentPage} of {totalPages} results
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="icon"
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ===== Add Property Type Form ===== */}
      <div>
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Add Property Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-16">
            <div className="space-y-2">
              <Label htmlFor="property-type" className="text-sm font-medium text-gray-700">
                Property Type Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="property-type"
                placeholder="Enter property type..."
                value={newPropertyType}
                onChange={(e) => setNewPropertyType(e.target.value)}
              />
            </div>
            <Button
              onClick={handleAdd}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
              disabled={addMutation.isPending}
            >
              {addMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
