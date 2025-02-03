import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ProfileCardProps {
  title: string;
  description?: string;
  data: Record<string, any>;
  schema: z.ZodObject<any>;
  onSubmit: (data: any) => Promise<void>;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    description?: string;
    readonly?: boolean;
  }>;
}

export function ProfileCard({
  title,
  description,
  data,
  schema,
  onSubmit,
  fields,
}: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const handleSubmit = async (formData: any) => {
    try {
      await onSubmit(formData);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        {...formField}
                        type={field.type}
                        disabled={!isEditing || field.readonly}
                      />
                    </FormControl>
                    {field.description && (
                      <FormDescription>{field.description}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            {isEditing && (
              <div className="flex gap-2">
                <Button type="submit">Save Changes</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        {!isEditing && (
          <Button type="button" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
