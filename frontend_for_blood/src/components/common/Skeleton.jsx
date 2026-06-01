import React from 'react';

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
            {...props}
        />
    );
};

export const CardSkeleton = () => (
    <div className="glass rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
            <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-14 w-14 rounded-xl" />
        </div>
    </div>
);

export const TableRowSkeleton = () => (
    <div className="flex items-center gap-4 p-4 border-b border-gray-100">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
);

export const ChartSkeleton = () => (
    <div className="glass rounded-2xl p-6 h-[400px] flex items-center justify-center">
        <div className="w-full h-full flex items-end gap-4 px-8 pb-8">
            <Skeleton className="h-[40%] w-full rounded-t-lg" />
            <Skeleton className="h-[70%] w-full rounded-t-lg" />
            <Skeleton className="h-[50%] w-full rounded-t-lg" />
            <Skeleton className="h-[80%] w-full rounded-t-lg" />
            <Skeleton className="h-[30%] w-full rounded-t-lg" />
        </div>
    </div>
);

export default Skeleton;
