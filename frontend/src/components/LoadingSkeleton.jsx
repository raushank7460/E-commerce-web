import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse flex flex-col h-full">
    <div className="aspect-square bg-slate-200 rounded-xl mb-3"></div>
    <div className="h-3 bg-slate-200 rounded w-1/3 mb-2"></div>
    <div className="h-4 bg-slate-200 rounded w-4/5 mb-3"></div>
    <div className="h-3 bg-slate-200 rounded w-1/4 mb-4"></div>
    <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between">
      <div className="h-5 bg-slate-200 rounded w-1/3"></div>
      <div className="h-8 bg-slate-200 rounded-xl w-16"></div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);
