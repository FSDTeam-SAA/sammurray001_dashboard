"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BadgeCheck, CreditCard, FileText, Layers, ClipboardSignature } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface SubscriptionFormData {
  name: string;
  amount: string;
  type: string;
  description: string;
}

export default function SubscriptionForm() {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: "",
    amount: "",
    type: "",
    description: "",
  });

  const params = useParams();
  const subscriptionId = params?.id; // if editing an existing subscription
  console.log(params)

  const session = useSession();
  const TOKEN = session.data?.user?.accessToken || "";

  // ✅ Mutation for create/update subscription
  const subscriptionMutation = useMutation({
    mutationFn: async (data: SubscriptionFormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/subscription/${subscriptionId}`,
        {
          method: subscriptionId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" , authorization: `Bearer ${TOKEN}` },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to save subscription");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Subscription saved successfully!");
      setFormData({ name: "", amount: "", type: "", description: "" }); // reset form
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    subscriptionMutation.mutate(formData);
  };

  return (
    <div className="p-6 flex justify-center items-center min-h-[90vh]">
      <Card className="w-[500px] bg-[#0E1635] border border-white/10 text-white shadow-xl rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <ClipboardSignature className="w-6 h-6 text-blue-400" />
            {subscriptionId ? "Edit Subscription Plan" : "Add Subscription Plan"}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-4 space-y-6">
          {/* Plan Name */}
          <div>
            <Label className="text-gray-300 flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-blue-400" /> Plan Name
            </Label>
            <Input
              name="name"
              placeholder="Enter subscription plan name"
              className="bg-white/5 border-white/10 text-white"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Amount */}
          <div>
            <Label className="text-gray-300 flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-green-400" /> Amount ($)
            </Label>
            <Input
              type="number"
              name="amount"
              placeholder="Enter price"
              className="bg-white/5 border-white/10 text-white"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>

          {/* Type */}
          <div>
            <Label className="text-gray-300 flex items-center gap-2 mb-1">
              <BadgeCheck className="w-4 h-4 text-yellow-400" /> Subscription Type
            </Label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg p-3 outline-none"
            >
              <option value="" className="text-black">Select type</option>
              <option value="monthly" className="text-black">Monthly</option>
              <option value="yearly" className="text-black">Yearly</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <Label className="text-gray-300 flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-purple-400" /> Description
            </Label>
            <Textarea
              name="description"
              placeholder="Write short description..."
              className="bg-white/5 border-white/10 text-white h-28"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Button */}
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4 py-3 rounded-xl"
            onClick={handleSubmit}
            disabled={subscriptionMutation.isPending}
          >
            {subscriptionMutation.isPending ? "Saving..." : "Save Subscription"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
