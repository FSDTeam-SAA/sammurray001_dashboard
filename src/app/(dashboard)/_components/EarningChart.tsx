"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton"; // ✅ Import Skeleton

export const description = "An area chart with a legend";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#0D9488",
  },
  mobile: {
    label: "Mobile",
    color: "#0D9488",
  },
} satisfies ChartConfig;

export function EarningChart() {
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;

  const [selectedYear, setSelectedYear] = useState("2025"); // Default year

  const { data: earningData, isLoading, isError } = useQuery({
    queryKey: ["earning", selectedYear],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/dashboard/monthly-earnings?year=${selectedYear}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const json = await res.json();
      return json.data;
    },
    enabled: !!TOKEN,
  });

  const chartData = earningData?.map((item: { month: string; totalEarnings: number }) => ({
    month: item.month,
    mobile: item.totalEarnings,
    desktop: item.totalEarnings,
  })) ?? [];

  // Example years for selection
  const availableYears = ["2023", "2024", "2025"];

  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Total Earning</CardTitle>

        {/* 🔹 Year Select Dropdown */}
        <Select value={selectedYear} onValueChange={(val) => setSelectedYear(val)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent className="border-gray-700">
            {availableYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // ✅ Skeleton for loading state
          <div className="h-[300px] w-full flex items-center justify-center">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        ) : isError ? (
          <p className="p-6 text-red-500">Failed to load earnings</p>
        ) : (
          <ChartContainer className="h-[300px] w-full" config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="mobile"
                type="natural"
                fill="var(--color-mobile)"
                fillOpacity={0.4}
                stroke="var(--color-mobile)"
                stackId="a"
              />
              <Area
                dataKey="desktop"
                type="natural"
                fill="var(--color-desktop)"
                fillOpacity={0.4}
                stroke="var(--color-desktop)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
