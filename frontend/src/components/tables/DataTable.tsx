import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  title?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  onView,
  searchable = true,
  searchPlaceholder = "Search...",
  title,
  pagination,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    return columns.some(column => {
      const value = item[column.key];
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    setSortConfig(prev => ({
      key: column.key,
      direction: prev.key === column.key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const paginatedData = pagination
    ? sortedData.slice(
        (pagination.currentPage - 1) * 10,
        pagination.currentPage * 10
      )
    : sortedData;

  return (
    <Card>
      {(title || searchable || onAdd) && (
        <CardHeader>
          <div className="flex items-center justify-between">
            {title && <CardTitle>{title}</CardTitle>}
            <div className="flex items-center space-x-2">
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              )}
              {onAdd && (
                <Button onClick={onAdd} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add New</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead
                        key={String(column.key)}
                        style={{ width: column.width }}
                        className={column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''}
                        onClick={() => handleSort(column)}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{column.title}</span>
                          {column.sortable && (
                            <div className="flex flex-col">
                              <ChevronLeft
                                className={`h-3 w-3 -mb-1 ${
                                  sortConfig.key === column.key && sortConfig.direction === 'asc'
                                    ? 'text-primary'
                                    : 'text-gray-400'
                                }`}
                              />
                              <ChevronRight
                                className={`h-3 w-3 -mt-1 ${
                                  sortConfig.key === column.key && sortConfig.direction === 'desc'
                                    ? 'text-primary'
                                    : 'text-gray-400'
                                }`}
                              />
                            </div>
                          )}
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1} className="text-center py-8">
                        {emptyMessage}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((row, index) => (
                      <TableRow key={index}>
                        {columns.map((column) => (
                          <TableCell key={String(column.key)}>
                            {column.render ? column.render(row[column.key], row) : row[column.key]}
                          </TableCell>
                        ))}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {onView && (
                                <DropdownMenuItem onClick={() => onView(row)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                              )}
                              {onEdit && (
                                <DropdownMenuItem onClick={() => onEdit(row)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {onDelete && (
                                <DropdownMenuItem
                                  onClick={() => onDelete(row)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Showing {((pagination.currentPage - 1) * 10) + 1} to{' '}
                  {Math.min(pagination.currentPage * 10, sortedData.length)} of{' '}
                  {sortedData.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === pagination.currentPage ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => pagination.onPageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
