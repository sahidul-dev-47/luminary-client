"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { Loader2, Bookmark, Heart } from "lucide-react";
import { authFetch } from "@/lib/clientFetch";



export default function WriterBookmarksPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchBookmarks = async () => {
      try {
        const res = await authFetch(`/api/v1/users/bookmarks?email=${user.email}`);
        const data = await res.json();
        if (data.success) setBookmarks(data.bookmarks);
      } catch (err) {
        console.error("Failed to load bookmarks", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user?.email]);

  // Remove Bookmark Function
  const removeBookmark = async (ebookId) => {
    if (!user?.email) return;

    try {
      const res = await authFetch(`/api/v1/users/bookmark`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.session?.token}`
        },
        body: JSON.stringify({
          email: user.email,
          ebookId: ebookId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Remove from UI
        setBookmarks(prev => prev.filter(book => book.ebookId !== ebookId));
      } else {
        alert(data.message || "Failed to remove");
      }
    } catch (err) {
      console.error("Remove Bookmark Error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.16em] text-[#F4C430]/80 font-semibold mb-1">
        Saved
      </p>
      <h1 className="font-serif text-2xl text-[#F8FAFC] mb-8">Bookmarked ebooks</h1>

      {loading ? (
        <div className="flex items-center gap-2 text-[#94A3B8] text-[13.5px] py-16 justify-center">
          <Loader2 size={16} className="animate-spin" /> Loading bookmarks…
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center rounded-2xl border border-dashed border-white/10">
          <Bookmark size={26} className="text-[#4B5563]" strokeWidth={1.5} />
          <p className="text-[#94A3B8] text-[13.5px]">
            Nothing saved yet. Bookmark ebooks from Browse to find them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-5">
          {bookmarks.map((book) => (
            <div
              key={book.ebookId}
              className="group rounded-2xl overflow-hidden bg-[#12121F] border border-white/6 hover:border-[#F4C430]/30 transition-colors relative"
            >
              <Link href={`/ebooks/${book.ebookId}`} className="block">
                <div className="relative aspect-[3/4] bg-[#1A1A2A]">
                  {book.ebookCover && (
                    <Image
                      src={book.ebookCover}
                      alt={book.ebookTitle}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[13px] text-[#F8FAFC] font-medium line-clamp-1">{book.ebookTitle}</p>
                  <p className="text-[11.5px] text-[#64748B] mt-0.5">{book.writerName}</p>
                  <p className="text-[12.5px] text-[#F4C430] font-semibold mt-1.5">
                    ${Number(book.price).toFixed(2)}
                  </p>
                </div>
              </Link>

              {/* Love / Remove Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeBookmark(book.ebookId);
                }}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-all hover:scale-110"
              >
                <Heart 
                  size={18} 
                  fill="#ef4444" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}