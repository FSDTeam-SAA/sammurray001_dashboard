"use client";

import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash, X } from "lucide-react";

interface DeleteModalProps {
  onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ onConfirm }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-red-500 text-red-500 w-full flex items-center gap-2"
        >
          <Trash className="w-4 h-4" /> Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
          <DialogTrigger asChild>
            <button className="rounded-sm opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </DialogTrigger>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete this user? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <DialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
