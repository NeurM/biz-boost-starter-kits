
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserAgenciesWithClients } from "@/services/tenant/tenantService";
import { AgencyClientList } from "@/components/tenant/AgencyClientList";
import { Loader2 } from "lucide-react";
import AppNavbar from "@/components/AppNavbar";
import Footer from "@/components/Footer";

const AgencyManagement: React.FC = () => {
  const { user } = useAuth();
  const [agencies, setAgencies] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      if (!user) return setLoading(false);
      setLoading(true);
      const { data, error } = await getUserAgenciesWithClients(user.id);
      if (!error && data) setAgencies(data);
      setLoading(false);
    })();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppNavbar />
      <div className="max-w-3xl mx-auto mt-8 p-4 flex-1 w-full">
        <h1 className="text-2xl font-bold mb-4">Agency Management</h1>
        <p className="mb-4 text-gray-600">
          View agencies you are a part of and manage clients. Click an agency or client to view their websites.
        </p>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading...
          </div>
        ) : (
          <AgencyClientList agencies={agencies} />
        )}
      </div>
      {/* Example Footer - update nav items and contact info as needed */}
      <Footer
        logo="Website Builder"
        navItems={[
          { name: "Home", path: "/" },
          { name: "Templates", path: "/templates" },
          { name: "Websites", path: "/saved-websites" },
          { name: "Agencies", path: "/agency-management" },
        ]}
        contactInfo={{
          email: "support@example.com",
        }}
      />
    </div>
  );
};

export default AgencyManagement;
