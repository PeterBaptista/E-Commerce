"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal, PlusCircle } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { axiosApi } from "@/lib/axios-client";
import { cn } from "@/lib/utils";
import { CouponType } from "@/modules/products/types/coupons-types";
import { DialogEditCoupon } from "./coupon-edit-dialog";
import { DialogCreateCoupon } from "./coupon-create-dialog";
import { queryClient } from "@/providers/tanstack-query-provider";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function DataTableCoupons() {
  const [coupon, setCoupon] = React.useState<CouponType>();
  const [open, setOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  
  const {toast} = useToast();

  const deleteCoupon = useMutation({
      mutationFn: async (codename: string) => {
        const response = await axiosApi.delete(`/coupons/${codename}`);
        return response.data;
      },
      onSuccess: () => {
        setOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["coupons-query"],
        });
        toast({
          "title": "Cupom deletado", 
          "description": "O cupom foi deletado com sucesso",
          "variant": "destructive"
        }) 
      },
    });

  const columns: ColumnDef<CouponType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "codename",
      header: "Nome",
      cell: ({ row }) => <div className="capitalize">{row.getValue("codename")}</div>,
    },
    {
      accessorKey: "expiration_date",
      header: "Data de expiração",
      cell: ({ row }) =>
        <div className="capitalize">
          {row.getValue("expiration_date") || "Sem data de expiração"}
        </div>
    },
  
    {
      accessorKey: "is_active",
      header: "Está ativo?",
      cell: ({ row }) =>
        <div className="capitalize">
          {row.getValue("expiration_date") || new Date() >= new Date() ? "Sim" : "Não"}
        </div>
    },
  
    {
      accessorKey: "percentage",
      header: () => <div className="text-right">Porcentagem</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("percentage"));
  
        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("pt-BR", {
          style: "percent"
        }).format(amount/100);
  
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" data-cy="dropdown-menu-trigger">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setCoupon(row.original);
                  setOpen(true);
                }}
                data-cy="edit-coupon-button"
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500 dark:text-red-400 cursor-pointer"
                onClick={() => {
                  deleteCoupon.mutate(row.original.codename);
                }}
                data-cy="delete-coupon-button"
              >
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { data = [] } = useQuery({
    queryKey: ["coupons-query"],
    queryFn: async (): Promise<CouponType[]> => {
      const response = await axiosApi("/coupons");

      return response.data;
    },
  });
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <DialogCreateCoupon setOpen={setCreateOpen} open={createOpen} />
      <DialogEditCoupon open={open} setOpen={setOpen} item={coupon} />
      <div className="w-full">
        <div className="flex items-center justify-between py-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cupons</h1>
            <p className="text-muted-foreground">
              Gerencie seus cupons aqui. Você pode adicionar, editar ou
              desativar cupons
            </p>
          </div>
          <Button
            type="button"
            className="w-fit gap-2"
            data-cy="create-coupon-button"
            onClick={() => setCreateOpen(true)}
          >
            <PlusCircle /> Adicionar Cupom
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody data-cy="coupons-table">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
