/* Inventory.tsx - Digital Inventory Manager */
import { useState } from "react";
import {
    Package,
    ShoppingCart,
    RotateCcw,
    AlertTriangle,
    Search,
    Filter,
    Plus,
    Shirt,
    Footprints,
    Droplets
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Mock Data
const MOCK_INVENTORY = [
    { id: '1', name: 'Nivia Pro Football', category: 'Equipment', stock: 12, total: 15, rentPrice: 50, type: 'rentable', image: '⚽' },
    { id: '2', name: 'Identify Bibs (Green)', category: 'Apparel', stock: 45, total: 50, rentPrice: 20, type: 'rentable', image: <Shirt className="w-6 h-6 text-green-500" /> },
    { id: '3', name: 'Identify Bibs (Red)', category: 'Apparel', stock: 48, total: 50, rentPrice: 20, type: 'rentable', image: <Shirt className="w-6 h-6 text-red-500" /> },
    { id: '4', name: 'Nike Mercurial Studs (Size 8)', category: 'Footwear', stock: 2, total: 5, rentPrice: 100, type: 'rentable', image: <Footprints className="w-6 h-6 text-orange-500" /> },
    { id: '5', name: 'Nike Mercurial Studs (Size 9)', category: 'Footwear', stock: 4, total: 5, rentPrice: 100, type: 'rentable', image: <Footprints className="w-6 h-6 text-orange-500" /> },
    { id: '6', name: 'Bisleri Water (500ml)', category: 'Consumable', stock: 8, total: 100, sellPrice: 20, type: 'sellable', image: <Droplets className="w-6 h-6 text-blue-400" /> },
    { id: '7', name: 'Gatorade (Blue)', category: 'Consumable', stock: 24, total: 50, sellPrice: 50, type: 'sellable', image: '⚡' },
];

export default function Inventory() {
    const [items, setItems] = useState(MOCK_INVENTORY);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const handleAction = (id: string, action: 'rent' | 'return' | 'sell') => {
        setItems(prev => prev.map(item => {
            if (item.id !== id) return item;

            if (action === 'rent' || action === 'sell') {
                if (item.stock > 0) {
                    toast({
                        title: action === 'sell' ? "Item Sold" : "Item Rented",
                        description: `${item.name} - ₹${action === 'sell' ? item.sellPrice : item.rentPrice} added to bill.`
                    });
                    return { ...item, stock: item.stock - 1 };
                } else {
                    toast({ title: "Out of Stock", variant: "destructive" });
                    return item;
                }
            }

            if (action === 'return') {
                if (item.stock < item.total) {
                    toast({ title: "Item Returned", description: "Stock updated." });
                    return { ...item, stock: item.stock + 1 };
                }
            }
            return item;
        }));
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filter === 'all' || item.type === filter)
    );

    return (
        <div className="p-4 md:p-8 space-y-8 animate-fade-in fade-in-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Package className="w-8 h-8 text-primary" /> Inventory & Cafe
                    </h1>
                    <p className="text-muted-foreground mt-1">Track equipment rentals and cafe sales.</p>
                </div>
                <Button className="gap-2 shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" /> Add Item
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search items..."
                        className="pl-9 bg-card border-none shadow-sm"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex bg-muted p-1 rounded-lg">
                    <button
                        onClick={() => setFilter('all')}
                        className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors", filter === 'all' ? "bg-card shadow-sm" : "hover:text-foreground text-muted-foreground")}
                    >All</button>
                    <button
                        onClick={() => setFilter('rentable')}
                        className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors", filter === 'rentable' ? "bg-card shadow-sm" : "hover:text-foreground text-muted-foreground")}
                    >Rentals</button>
                    <button
                        onClick={() => setFilter('sellable')}
                        className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors", filter === 'sellable' ? "bg-card shadow-sm" : "hover:text-foreground text-muted-foreground")}
                    >Cafe</button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                    <div key={item.id} className="group bg-card border rounded-xl p-4 transition-all hover:shadow-md hover:border-primary/50 relative overflow-hidden">

                        {/* Status Badge */}
                        <div className="absolute top-4 right-4 z-10">
                            {item.stock === 0 ? (
                                <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold border border-red-200">Out of Stock</span>
                            ) : item.stock < 5 ? (
                                <span className="px-2 py-1 rounded bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Low Stock
                                </span>
                            ) : (
                                <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold border border-green-200">
                                    {item.stock} Available
                                </span>
                            )}
                        </div>

                        <div className="h-40 bg-muted/30 rounded-lg mb-4 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
                            {typeof item.image === 'string' ? item.image : item.image}
                        </div>

                        <div className="space-y-1 mb-4">
                            <h3 className="font-bold truncate" title={item.name}>{item.name}</h3>
                            <p className="text-xs text-muted-foreground uppercase font-bold">{item.category}</p>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-bold">₹{item.rentPrice || item.sellPrice}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                Total: {item.total}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {item.type === 'rentable' ? (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                        onClick={() => handleAction(item.id, 'rent')}
                                        disabled={item.stock === 0}
                                    >
                                        Rent
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-foreground hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                                        onClick={() => handleAction(item.id, 'return')}
                                        disabled={item.stock >= item.total}
                                    >
                                        Return
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    className="w-full col-span-2"
                                    size="sm"
                                    onClick={() => handleAction(item.id, 'sell')}
                                    disabled={item.stock === 0}
                                >
                                    <ShoppingCart className="w-3 h-3 mr-2" /> Sell
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
