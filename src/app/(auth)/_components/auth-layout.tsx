import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc?: string;
  imagePosition?: "left" | "right";
}

export default function AuthLayout({
  children,
  imageSrc,
  imagePosition = "right",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT IMAGE */}
      {imagePosition === "left" && (
        <div
          className="hidden lg:block bg-cover bg-center"
          style={{
            backgroundImage: imageSrc
              ? `url(${imageSrc})`
              : "linear-gradient(to bottom right, #004E76, #002F48)",
          }}
        />
      )}

      {/* FORM */}
      <div className="flex justify-center items-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* RIGHT IMAGE */}
      {imagePosition === "right" && (
        <div
          className="hidden lg:block bg-cover bg-center"
          style={{
            backgroundImage: imageSrc
              ? `url(${imageSrc})`
              : "linear-gradient(to bottom right, #004E76, #002F48)",
          }}
        />
      )}
    </div>
  );
}
