import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center w-full bg-cream-bg">
      <div className="relative">
        {/* Subtle decorative ring */}
        <div className="absolute inset-0 border-4 border-gold-accent/20 rounded-full animate-ping"></div>
        {/* Spinner */}
        <div className="bg-white p-4 rounded-full shadow-sm border border-outline-variant/10 relative z-10">
          <Loader2 className="w-8 h-8 text-forest-deep animate-spin" />
        </div>
      </div>
      <p className="mt-6 font-label-lg text-forest-deep tracking-widest uppercase text-sm animate-pulse">
        Loading...
      </p>
    </div>
  );
}
