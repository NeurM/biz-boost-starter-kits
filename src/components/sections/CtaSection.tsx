
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone } from 'lucide-react';

const CtaSection = () => {
  return (
    <section className={`bg-gradient-to-r from-orange-500 to-orange-600 py-16 text-white`}>
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Need Urgent Assistance?</h2>
        <p className="text-xl mb-8">Our emergency team is available 24/7 to help with urgent issues.</p>
        <Button variant="cta-outline" size="lg" asChild className="border-white text-white hover:bg-white hover:text-orange-600">
          <Link to="/tradecraft/contact">
            <Phone className="mr-2 h-5 w-5" /> Call For Emergency Service
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CtaSection;
