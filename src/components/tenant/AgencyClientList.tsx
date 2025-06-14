
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tenant } from "@/types/tenant";

interface AgencyClientListProps {
  agencies: (Tenant & { clients: Tenant[] })[];
}

export const AgencyClientList: React.FC<AgencyClientListProps> = ({ agencies }) => {
  if (!agencies.length) return <div className="text-gray-500 p-4">No agencies found.</div>;

  return (
    <div className="divide-y border rounded bg-white">
      {agencies.map((agency) => (
        <div key={agency.id}>
          <div className="flex items-center p-4">
            <div className="font-semibold text-lg">{agency.name}</div>
            <Badge variant="secondary" className="ml-2">Agency</Badge>
          </div>
          {agency.clients && agency.clients.length > 0 ? (
            <ul className="pl-8 mb-2">
              {agency.clients.map((client) => (
                <li key={client.id} className="flex items-center py-1">
                  <span className="text-gray-700">{client.name}</span>
                  <Badge variant="outline" className="ml-2">Client</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <div className="pl-8 pb-2 text-gray-400 text-sm">No clients</div>
          )}
        </div>
      ))}
    </div>
  );
};
