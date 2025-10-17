import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <>
      <Toaster richColors position="top-center" />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
