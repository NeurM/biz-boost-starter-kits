
import { supabase } from '@/integrations/supabase/client';
import { logApiCall } from './apiLogger';

// Generic database types
export type TableRow = {
  [key: string]: any;
};

// Generic database functions for basic CRUD operations
export const fetchData = async (tableName: string) => {
  try {
    // Use type casting to avoid TypeScript errors with dynamic table names
    const response = await supabase
      .from(tableName as any)
      .select('*');
    
    await logApiCall(`/${tableName}`, 'GET', null, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall(`/${tableName}`, 'GET', null, null, error as Error);
    throw error;
  }
};

export const insertData = async <T extends TableRow>(tableName: string, data: T) => {
  try {
    // Use type casting to avoid TypeScript errors with dynamic table names
    const response = await supabase
      .from(tableName as any)
      .insert(data)
      .select();
      
    await logApiCall(`/${tableName}`, 'POST', data, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall(`/${tableName}`, 'POST', data, null, error as Error);
    throw error;
  }
};

export const updateData = async <T extends TableRow>(tableName: string, id: string, data: Partial<T>) => {
  try {
    // Use type casting to avoid TypeScript errors with dynamic table names
    const response = await supabase
      .from(tableName as any)
      .update(data)
      .eq('id', id)
      .select();
      
    await logApiCall(`/${tableName}/${id}`, 'PATCH', data, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall(`/${tableName}/${id}`, 'PATCH', data, null, error as Error);
    throw error;
  }
};

export const deleteData = async (tableName: string, id: string) => {
  try {
    // Use type casting to avoid TypeScript errors with dynamic table names
    const response = await supabase
      .from(tableName as any)
      .delete()
      .eq('id', id);
      
    await logApiCall(`/${tableName}/${id}`, 'DELETE', { id }, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall(`/${tableName}/${id}`, 'DELETE', { id }, null, error as Error);
    throw error;
  }
};
