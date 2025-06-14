
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tenant } from "@/types/tenant";
import { useNavigate } from "react-router-dom";
import { useTenantWebsites } from "@/hooks/useTenantWebsites";

interface AgencyClientListProps {
  agencies: (Tenant & { clients: Tenant[] })[];
}

const AgencyBox: React.FC<{
  agency: Tenant & { clients: Tenant[] };
}> = ({ agency }) => {
  const navigate = useNavigate();
  const { data: websites = [] } = useTenantWebsites(agency.id);

  return (
    <div className="border-b hover:bg-gray-50 transition cursor-pointer">
      <div
        className="flex items-center p-4 group"
        onClick={() => navigate(`/saved-websites?tenant=${agency.id}`)}
        tabIndex={0}
        role="button"
        aria-label={`Go to ${agency.name} websites`}
      >
        <div className="font-semibold text-lg">{agency.name}</div>
        <Badge variant="secondary" className="ml-2">
          Agency
        </Badge>
        <span className="ml-3 text-gray-400 text-xs">
          {websites.length} Website{websites.length !== 1 && "s"}
        </span>
        <span className="ml-auto text-blue-600 underline opacity-0 group-hover:opacity-100 transition">
          View Sites
        </span>
      </div>
      {agency.clients && agency.clients.length > 0 && (
        <ul className="pl-8 mb-2">
          {agency.clients.map((client) => (
            <ClientBox client={client} key={client.id} />
          ))}
        </ul>
      )}
    </div>
  );
};

const ClientBox: React.FC<{ client: Tenant }> = ({ client }) => {
  const navigate = useNavigate();
  const { data: websites = [] } = useTenantWebsites(client.id);

  return (
    <li
      key={client.id}
      className="flex items-center py-1 pl-4 hover:bg-gray-25 cursor-pointer transition"
      onClick={e => {
        e.stopPropagation();
        navigate(`/saved-websites?tenant=${client.id}`);
      }}
      tabIndex={0}
      role="button"
      aria-label={`Go to ${client.name} websites`}
    >
      <span className="text-gray-700">{client.name}</span>
      <Badge variant="outline" className="ml-2">
        Client
      </Badge>
      <span className="ml-2 text-gray-400 text-xs">{websites.length} Site{websites.length !== 1 && "s"}</span>
      <span className="ml-auto text-blue-600 underline opacity-0 hover:opacity-100 transition">
        View Sites
      </span>
    </li>
  );
};

export const AgencyClientList: React.FC<AgencyClientListProps> = ({
  agencies,
}) => {
  if (!agencies.length)
    return <div className="text-gray-500 p-4">No agencies found.</div>;
  return (
    <div className="divide-y border rounded bg-white">
      {agencies.map((agency) => (
        <AgencyBox agency={agency} key={agency.id} />
      ))}
    </div>
  );
};
