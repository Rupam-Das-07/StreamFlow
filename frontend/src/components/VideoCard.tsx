"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle?: string;
  imageUrl: string;
  onClick?: () => void;
};

export default function VideoCard({ title, subtitle, imageUrl, onClick }: Props) {
  return (
    <motion.div whileHover={{ scale: 1.03, y: -4 }} transition={{ type: "spring", stiffness: 250, damping: 20 }}>
      <Card onClick={onClick} className="cursor-pointer">
        <CardContent className="p-3">
          <AspectRatio ratio={16 / 9}>
            <Image 
              src={imageUrl} 
              alt={title} 
              fill
              className="rounded object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </AspectRatio>
          <CardHeader className="p-0 pt-3">
            <CardTitle className="line-clamp-2 text-sm transition-colors hover:text-primary">{title}</CardTitle>
            {subtitle ? <CardDescription className="text-xs transition-colors group-hover:text-foreground/80">{subtitle}</CardDescription> : null}
          </CardHeader>
        </CardContent>
      </Card>
    </motion.div>
  );
}


