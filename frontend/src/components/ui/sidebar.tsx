"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

export const Sidebar = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <motion.div
        className={cn(
          "h-[calc(100vh-56px)] px-4 py-4 hidden md:flex md:flex-col bg-background shrink-0 border-r border-border overflow-hidden",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const [open, setOpen] = React.useState(false);
  
  return (
    <>
      <div
        className={cn(
          "h-14 px-4 py-2 flex flex-row md:hidden items-center justify-between bg-background border-b border-border w-full"
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-primary" />
          <span className="font-medium text-foreground">StreamFlow</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setOpen(!open)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed h-full w-full inset-0 bg-background border-r border-border p-6 z-[100] flex flex-col justify-between",
              className
            )}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-primary" />
                <span className="font-medium text-foreground">StreamFlow</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setOpen(!open)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  return (
    <motion.a
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-3 group/sidebar py-3 px-3 rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground relative overflow-hidden",
        className
      )}
      whileHover={{ 
        x: 4,
        scale: 1.02,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      {...props}
    >
      {/* Hover background effect */}
      <motion.div
        className="absolute inset-0 bg-accent/50 rounded-lg"
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 5, scale: 1.1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {link.icon}
        </motion.div>

        <motion.span
          className="text-sm font-medium whitespace-nowrap overflow-hidden"
        >
          {link.label}
        </motion.span>
      </div>
    </motion.a>
  );
};
