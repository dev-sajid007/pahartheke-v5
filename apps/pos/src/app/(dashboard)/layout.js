import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import TopLoader from "@/components/layout/TopLoader";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <TopLoader />
      <Sidebar />
      <div className="sm:ml-64 flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
