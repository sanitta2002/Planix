import React from "react";
import { Button } from "./Button";


interface PaginationProps {
    total: number;
    start: number;
    end: number;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    canGoPrev: boolean;
    canGoNext: boolean;
    label?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    total,
    start,
    end,
    setPage,
    canGoPrev,
    canGoNext,
    label = "items",
}) => {
    return (
        <div className="border-t border-gray-800/50 p-4 flex items-center justify-between text-xs text-gray-500">
            <span>
                {total === 0
                    ? `Showing 0 ${label}`
                    : `Showing ${start}-${end} of ${total} ${label}`}
            </span>

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    className="h-8 px-3 text-xs bg-transparent border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                    disabled={!canGoPrev}
                    onClick={() => setPage((p) => p - 1)}
                >
                    Previous
                </Button>

                <Button
                    variant="outline"
                    className="h-8 px-3 text-xs bg-transparent border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                    disabled={!canGoNext}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Pagination;