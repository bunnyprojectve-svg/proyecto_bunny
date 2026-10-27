export default function StarRating({ rating }: { rating: number }) {
  const safeRating = rating || 0;
  return (
    <div className="flex items-center gap-1">
      <div className="flex text-yellow-400 text-sm">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= Math.round(safeRating) ? "text-yellow-400" : "text-zinc-600"}>
            ★
          </span>
        ))}
      </div>
      <span className="text-xs text-zinc-400 font-semibold ml-1">
        {safeRating.toFixed(1)}
      </span>
    </div>
  );
}
