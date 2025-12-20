import * as React from "react";
import { cn } from "@/lib/utils";

const AlertDialog = ({ children, ...props }) => {
  const [open, setOpen] = React.useState(false);
  
  return (
    <div {...props}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { open, setOpen })
          : child
      )}
    </div>
  );
};

const AlertDialogTrigger = ({ children, open, setOpen, asChild, ...props }) => {
  const handleClick = () => setOpen?.(true);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        handleClick();
        children.props.onClick?.(e);
      },
    });
  }
  
  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

const AlertDialogContent = ({ className, children, open, setOpen, ...props }) => {
  if (!open) return null;
  
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen?.(false)} />
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-lg duration-200 rounded-lg">
        <div className={cn("flex flex-col space-y-2", className)} {...props}>
          {children}
        </div>
      </div>
    </>
  );
};

const AlertDialogTitle = ({ className, ...props }) => (
  <h2 className={cn("text-lg font-semibold", className)} {...props} />
);

const AlertDialogDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-gray-500", className)} {...props} />
);

const AlertDialogAction = ({ className, open, setOpen, onClick, ...props }) => (
  <button
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    onClick={(e) => {
      onClick?.(e);
      setOpen?.(false);
    }}
    {...props}
  />
);

const AlertDialogCancel = ({ className, open, setOpen, ...props }) => (
  <button
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    onClick={() => setOpen?.(false)}
    {...props}
  />
);

AlertDialogTrigger.displayName = "AlertDialogTrigger";
AlertDialogContent.displayName = "AlertDialogContent";
AlertDialogTitle.displayName = "AlertDialogTitle";
AlertDialogDescription.displayName = "AlertDialogDescription";
AlertDialogAction.displayName = "AlertDialogAction";
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};

