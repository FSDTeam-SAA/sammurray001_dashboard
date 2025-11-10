// import Header from "@/components/Header/Header";
// import { Sidebar } from "@/components/sidebar/Sidebar";
// import AppProvider from "@/provider/AppProvider";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <Header /> */}
      <div className="">
        {/* <Sidebar /> */}
        <div className="">
          {/* <AppProvider> */}
            {children}
            {/* </AppProvider> */}
        </div>
      </div>
    </>
  );
}

export default layout;
