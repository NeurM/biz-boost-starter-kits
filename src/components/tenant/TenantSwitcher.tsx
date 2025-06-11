
import React from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useTenant } from '@/context/TenantContext';
import { Badge } from '@/components/ui/badge';

interface TenantSwitcherProps {
  onCreateTenant?: () => void;
}

export const TenantSwitcher: React.FC<TenantSwitcherProps> = ({ onCreateTenant }) => {
  const { currentTenant, tenantMemberships, switchTenant } = useTenant();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a tenant"
          className="w-[200px] justify-between"
        >
          {currentTenant ? (
            <div className="flex items-center space-x-2">
              <span className="truncate">{currentTenant.name}</span>
              <Badge variant="secondary" className="text-xs">
                {currentTenant.subscription_plan}
              </Badge>
            </div>
          ) : (
            "Select tenant..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search tenant..." />
          <CommandList>
            <CommandEmpty>No tenant found.</CommandEmpty>
            <CommandGroup>
              {tenantMemberships.map((membership) => {
                if (!membership.tenant) return null;
                
                return (
                  <CommandItem
                    key={membership.tenant.id}
                    value={membership.tenant.name}
                    onSelect={() => {
                      switchTenant(membership.tenant!.id);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            currentTenant?.id === membership.tenant.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="truncate">{membership.tenant.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Badge variant="outline" className="text-xs">
                          {membership.role}
                        </Badge>
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {onCreateTenant && (
              <>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      onCreateTenant();
                      setOpen(false);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create new tenant
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
