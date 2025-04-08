
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  link?: string;
  linkText?: string;
  className?: string;
}

const ServiceCard = ({
  title,
  description,
  icon,
  link,
  linkText = "Learn More",
  className = ""
}: ServiceCardProps) => {
  return (
    <Card className={`hover-grow ${className}`}>
      <CardHeader className="pb-2">
        {icon && <div className="mb-4">{icon}</div>}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">{description}</CardDescription>
        {link && (
          <Button asChild variant="outline" size="sm">
            <Link to={link}>{linkText}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
