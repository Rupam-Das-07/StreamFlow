"use client";

import VideoCard from "@/components/VideoCard";
import Link from "next/link";

type Item = {
  id: string;
  title: string;
  channel?: string;
  channelTitle?: string;
  thumbnail: string;
  publishedAt?: string;
  viewCount?: string;
  duration?: string;
};

type Props = {
  items: Item[];
};

export default function SearchResults({ items }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((v) => (
        <Link key={v.id} href={`/watch/${v.id}`}>
          <VideoCard
            title={v.title}
            subtitle={v.channel || v.channelTitle}
            imageUrl={v.thumbnail}
          />
        </Link>
      ))}
    </div>
  );
}


