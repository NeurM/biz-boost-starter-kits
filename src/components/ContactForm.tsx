
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface ContactFormProps {
  className?: string;
  buttonText?: string;
  buttonClass?: string;
}

const ContactForm = ({
  className = "",
  buttonText = "Send Message",
  buttonClass = "w-full"
}: ContactFormProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      // Here you would integrate with Supabase to store the contact form submission
      console.log("Form data:", data);
      
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      reset();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "There was a problem sending your message.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Input
            placeholder="Your Name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message?.toString()}</p>
          )}
        </div>
        
        <div>
          <Input
            type="email"
            placeholder="Email Address"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message?.toString()}</p>
          )}
        </div>
      </div>

      <div>
        <Input
          placeholder="Subject"
          {...register("subject", { required: "Subject is required" })}
        />
        {errors.subject && (
          <p className="text-sm text-red-500 mt-1">{errors.subject.message?.toString()}</p>
        )}
      </div>

      <div>
        <Textarea
          placeholder="Your Message"
          rows={5}
          {...register("message", { required: "Message is required" })}
        />
        {errors.message && (
          <p className="text-sm text-red-500 mt-1">{errors.message.message?.toString()}</p>
        )}
      </div>

      <Button type="submit" className={buttonClass}>
        {buttonText}
      </Button>
    </form>
  );
};

export default ContactForm;
