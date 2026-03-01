import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../ui/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { departmentService } from '../../services/api/department.service';
import { Department } from '../../services/api/department.service';

const departmentSchema = z.object({
  name: z.string().min(2, 'Department name must be at least 2 characters'),
  code: z.string().min(2, 'Department code must be at least 2 characters').toUpperCase(),
  description: z.string().optional(),
  head_of_department: z.string().optional(),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  department?: Department;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function DepartmentForm({ department, onSuccess, onCancel }: DepartmentFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: department?.name || '',
      code: department?.code || '',
      description: department?.description || '',
      head_of_department: department?.head_of_department || '',
    },
  });

  useEffect(() => {
    if (department) {
      form.reset({
        name: department.name,
        code: department.code,
        description: department.description || '',
        head_of_department: department.head_of_department || '',
      });
    }
  }, [department, form]);

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      setLoading(true);
      
      if (department) {
        await departmentService.update(department.id, data);
        toast({
          title: "Success",
          description: "Department updated successfully",
        });
      } else {
        await departmentService.create(data);
        toast({
          title: "Success",
          description: "Department created successfully",
        });
      }
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${department ? 'update' : 'create'} department`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {department ? 'Edit Department' : 'Create New Department'}
        </CardTitle>
        <CardDescription>
          {department 
            ? 'Update the department information below.'
            : 'Fill in the details to create a new academic department.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Computer Science" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Code *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., CS" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for the department
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of the department..."
                      className="resize-none"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="head_of_department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Head of Department</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Dr. John Smith" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Name of the department head
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-6 border-t">
              {onCancel && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {department ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  department ? 'Update Department' : 'Create Department'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
