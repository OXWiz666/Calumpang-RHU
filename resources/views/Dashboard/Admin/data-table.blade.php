@props([
    'data',
    'columns',
    'searchable' => true,
    'exportable' => true,
])

<div class="space-y-4">
    @if($searchable || $exportable)
        <div class="flex items-center justify-between px-6">
            @if($searchable)
                <div class="relative max-w-sm">
                    <div class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                        <x-icon name="search" class="w-4 h-4" />
                    </div>
                    <input type="search" placeholder="Search..." class="pl-9 w-[300px] h-10 rounded-md border border-input">
                </div>
            @endif

            @if($exportable)
                <button type="button" onclick="alert('Export functionality would be implemented here')" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    <x-icon name="download" class="mr-2 h-4 w-4" />
                    Export
                </button>
            @endif
        </div>
    @endif

    <div class="border rounded-md">
        <table class="w-full">
            <thead>
                <tr class="border-b transition-colors hover:bg-muted/50">
                    @foreach($columns as $column)
                        <th class="h-12 px-4 text-left align-middle font-medium">
                            {{ $column['header'] }}
                        </th>
                    @endforeach
                    <th class="h-12 px-4 text-left align-middle font-medium w-[80px]">Actions</th>
                </tr>
            </thead>
            <tbody>
                @if(count($data) === 0)
                    <tr>
                        <td colspan="{{ count($columns) + 1 }}" class="h-24 text-center">
                            No results found.
                        </td>
                    </tr>
                @else
                    @foreach($data as $row)
                        <tr class="border-b transition-colors hover:bg-muted/50">
                            @foreach($columns as $column)
                                <td class="p-4 align-middle">
                                    {{ $row[$column['accessorKey']] }}
                                </td>
                            @endforeach
                            <td class="p-4 align-middle">
                                <div x-data="{ open: false }" class="relative">
                                    <button @click="open = !open" class="p-2 rounded-md hover:bg-muted">
                                        <x-icon name="more-horizontal" class="h-4 w-4" />
                                    </button>
                                    <div x-show="open" 
                                         @click.away="open = false"
                                         x-transition
                                         class="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-card border border-border z-10">
                                        <a href="#" class="block px-4 py-2 text-sm hover:bg-muted">View details</a>
                                        <a href="#" class="block px-4 py-2 text-sm hover:bg-muted">Edit</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                @endif
            </tbody>
        </table>
    </div>
</div>