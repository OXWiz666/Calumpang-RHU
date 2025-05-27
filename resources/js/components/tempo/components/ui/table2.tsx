import * as React from "react";
import { cn } from "../../lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type SortDirection = "asc" | "desc";
type SortConfig = {
    key: string;
    direction: SortDirection;
};

const TableContext = React.createContext<{
    sortConfig: SortConfig | null;
    requestSort: (key: string) => void;
    sortedData: any[];
}>({
    sortConfig: null,
    requestSort: () => {},
    sortedData: [],
});

type SortableTableProps = {
    children:
        | React.ReactNode
        | ((context: {
              sortedData: any[];
              sortConfig: SortConfig | null;
              requestSort: (key: string) => void;
          }) => React.ReactNode);
    defaultSort?: SortConfig;
    data?: any[];
};

const SortableTable = ({
    children,
    defaultSort,
    data = [],
}: SortableTableProps) => {
    const [sortConfig, setSortConfig] = React.useState<SortConfig | null>(
        defaultSort || null
    );

    const sortedData = React.useMemo(() => {
        if (!sortConfig) return data;

        return [...data].sort((a, b) => {
            // Handle nested properties (e.g., user.firstname)
            const getNestedValue = (obj, path) =>
                path.split(".").reduce((o, p) => (o ? o[p] : ""), obj);

            const aValue = getNestedValue(a, sortConfig.key);
            const bValue = getNestedValue(b, sortConfig.key);

            if (aValue < bValue) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }, [data, sortConfig]);

    const requestSort = (key: string) => {
        let direction: SortDirection = "asc";
        if (sortConfig && sortConfig.key === key) {
            direction = sortConfig.direction === "asc" ? "desc" : "asc";
        }
        setSortConfig({ key, direction });
    };

    return (
        <TableContext.Provider value={{ sortConfig, requestSort, sortedData }}>
            {typeof children === "function"
                ? children({ sortedData, sortConfig, requestSort }) // pass more if needed
                : children}
        </TableContext.Provider>
    );
};

const SortableTableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement> & {
        sortKey?: string;
        sortable?: boolean;
    }
>(({ className, sortKey, sortable = false, children, ...props }, ref) => {
    const { sortConfig, requestSort } = React.useContext(TableContext);

    const canSort = sortable && sortKey !== undefined;
    const isSorted = canSort && sortConfig?.key === sortKey;
    const sortDirection = isSorted ? sortConfig.direction : null;

    const handleClick = () => {
        if (canSort) {
            requestSort(sortKey);
        }
    };

    return (
        <th
            ref={ref}
            className={cn(
                "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                canSort && "cursor-pointer hover:bg-muted/50",
                className
            )}
            onClick={canSort ? handleClick : undefined}
            {...props}
        >
            <div className="flex items-center">
                {children}
                {canSort && (
                    <span className="ml-2">
                        {!isSorted && <ArrowUpDown className="h-4 w-4" />}
                        {isSorted && sortDirection === "asc" && (
                            <ArrowUp className="h-4 w-4" />
                        )}
                        {isSorted && sortDirection === "desc" && (
                            <ArrowDown className="h-4 w-4" />
                        )}
                    </span>
                )}
            </div>
        </th>
    );
});
SortableTableHead.displayName = "SortableTableHead";

// Keep all the original components as they are
const Table = React.forwardRef<
    HTMLTableElement,
    React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
        <table
            ref={ref}
            className={cn("w-full caption-bottom text-sm", className)}
            {...props}
        />
    </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
    />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tfoot
        ref={ref}
        className={cn(
            "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
            className
        )}
        {...props}
    />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
            className
        )}
        {...props}
    />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
            className
        )}
        {...props}
    />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn(
            "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
            className
        )}
        {...props}
    />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
    HTMLTableCaptionElement,
    React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
    <caption
        ref={ref}
        className={cn("mt-4 text-sm text-muted-foreground", className)}
        {...props}
    />
));
TableCaption.displayName = "TableCaption";

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
    SortableTable,
    SortableTableHead,
};
