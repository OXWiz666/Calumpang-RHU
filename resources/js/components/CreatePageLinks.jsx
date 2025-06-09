import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./tempo/components/ui/button";
import { router } from "@inertiajs/react";
export default function CreatePageLinks({ links }) {
    return (
        <div className="flex ml-2 space-x-2">
            {links.map((link, index) => (
                <Button
                    key={index}
                    variant={link.active ? "default" : "outline"}
                    size="sm"
                    disabled={!link.url || link.active}
                    onClick={() => {
                        if (link.url) {
                            router.get(link.url);
                        }
                    }}
                >
                    {link.label.includes("Previous") ? (
                        <ChevronLeft className="h-4 w-4" />
                    ) : link.label.includes("Next") ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        link.label
                    )}
                </Button>
            ))}
        </div>
    );
}
