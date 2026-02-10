import { Camera, Link, Upload, Youtube } from "lucide-react";
import { motion } from "framer-motion";

const captureOptions = [
  {
    icon: Camera,
    title: "Scan Recipe",
    description: "Take a photo of a recipe book page",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Upload,
    title: "Upload Image",
    description: "Upload an image from your gallery",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Youtube,
    title: "YouTube Link",
    description: "Paste a YouTube cooking video URL",
    color: "bg-destructive/10 text-destructive",
  },
  {
    icon: Link,
    title: "Web Link",
    description: "Import from any recipe website",
    color: "bg-accent/20 text-accent-foreground",
  },
];

const CapturePage = () => {
  return (
    <div className="px-5 pt-6 pb-24">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl text-foreground mb-1">Capture</h1>
        <p className="text-muted-foreground text-sm mb-6">Add recipes from any source</p>
      </motion.div>

      <div className="space-y-3">
        {captureOptions.map((opt, i) => (
          <motion.button
            key={opt.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-card border border-border text-left active:scale-[0.98] transition-transform"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${opt.color}`}>
              <opt.icon size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{opt.title}</h3>
              <p className="text-xs text-muted-foreground">{opt.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-2xl border-2 border-dashed border-border flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <Camera size={28} className="text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Drag & drop an image here, or tap an option above
        </p>
      </div>
    </div>
  );
};

export default CapturePage;
