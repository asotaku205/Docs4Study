const Completed = () => {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow group overflow-hidden border-border hover:shadow-sm transition-all">
      <div className="flex p-4 gap-4">
        <div className="h-20 w-20 rounded-lg overflow-hidden shrink-0 border border-border">
          <img
            className="w-full h-full object-cover grayscale opacity-60"
            src="library.png"
            alt="Course thumbnail"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-foreground line-clamp-1 mb-1">
            UI/UX Design Fundamentals
          </h4>
          <p className="text-[10px] text-muted-foreground mb-3 flex items-center gap-1">
            Completed Dec 15, 2025
          </p>
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-transparent min-h-8 rounded-md h-7 px-3 text-[10px] bg-primary/5 text-primary hover:bg-primary/10">
            View Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
export default Completed;