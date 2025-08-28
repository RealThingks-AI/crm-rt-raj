import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { NotificationBell } from "./NotificationBell";
import { Button } from "./ui/button";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
interface CRMLayoutProps {
  children: ReactNode;
}
export const CRMLayout = ({
  children
}: CRMLayoutProps) => {
  const {
    user,
    signOut
  } = useAuth();
  return <div className="min-h-screen bg-background flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>;
};