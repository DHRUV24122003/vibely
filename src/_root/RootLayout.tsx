import { Outlet } from "react-router-dom";
//import { Outlet } from "react-router-dom";

import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";

const RootLayout = () => {
  return (
    <div className="min-h-screen w-full bg-[#08080A]">
      <Topbar />

      <LeftSidebar />

      <main
        className="
          min-h-screen
          min-w-0
          md:ml-[280px]
          xl:ml-[300px]
        "
      >
        <Outlet />
      </main>

      <Bottombar />
    </div>
  );
};

export default RootLayout;