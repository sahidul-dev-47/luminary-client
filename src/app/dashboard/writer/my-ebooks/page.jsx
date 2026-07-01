"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import StatusBadge from "@/components/writer/StatusBadge";
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  BookX,
  PlusCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function MyEbooksPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const fetchEbooks = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/writer/ebooks?writerId=${user.email}`);
      const data = await res.json();
      if (data.success) setEbooks(data.ebooks);
    } catch (err) {
      console.error("Failed to load ebooks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const toggleStatus = async (id) => {
    setBusyId(id);
    try {
      const res = await fetch(`${API_URL}/api/v1/writer/ebooks/${id}/toggle-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ writerId: user.email }),
      });
      const data = await res.json();
      if (data.success) {
        setEbooks((prev) => prev.map((e) => (e._id === id ? { ...e, status: data.status } : e)));
      }
    } catch (err) {
      console.error("Failed to toggle status", err);
    } finally {
      setBusyId(null);
    }
  };

  const deleteEbook = async (id) => {
    if (!confirm("Delete this ebook permanently? This cannot be undone.")) return;
    setBusyId(id);
    try {
    const res = await fetch(`${API_URL}/api/v1/writer/ebooks?writerId=${user.email}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) setEbooks((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Failed to delete ebook", err);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-7 flex-wrap gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#F4C430]/80 font-semibold mb-1">
            Manage
          </p>
          <h1 className="font-serif text-2xl text-[#F8FAFC]">My ebooks</h1>
        </div>
        <Link
          href="/dashboard/writer/add-ebook"
          className="flex items-center gap-2 px-4 py-[10px] rounded-xl text-[13px] font-semibold text-[#0D0D1A] bg-[#F4C430] hover:opacity-90 transition-all"
        >
          <PlusCircle size={15} /> Add new ebook
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[#94A3B8] text-[13.5px] py-16 justify-center">
          <Loader2 size={16} className="animate-spin" /> Loading your ebooks…
        </div>
      ) : ebooks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center rounded-2xl border border-dashed border-white/10">
          <BookX size={26} className="text-[#4B5563]" strokeWidth={1.5} />
          <p className="text-[#94A3B8] text-[13.5px]">You haven't published anything yet.</p>
          <Link
            href="/dashboard/writer/add-ebook"
            className="text-[13px] font-semibold text-[#F4C430] hover:underline"
          >
            Add your first ebook
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#12121F] text-[11px] uppercase tracking-wider text-[#64748B]">
                  <th className="px-5 py-3.5 font-medium">Ebook</th>
                  <th className="px-5 py-3.5 font-medium">Genre</th>
                  <th className="px-5 py-3.5 font-medium">Price</th>
                  <th className="px-5 py-3.5 font-medium">Sold</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ebooks.map((book) => (
                  <tr key={book._id} className="border-t border-white/6 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-12 rounded-md bg-[#1A1A2A] overflow-hidden shrink-0 relative">
                          {book.coverImage && (
                            <Image src={book.coverImage} alt={book.title} fill className="object-cover" />
                          )}
                        </div>
                        <span className="text-[13.5px] text-[#F8FAFC] font-medium line-clamp-1">
                          {book.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[12.5px] text-[#94A3B8]">{book.genre}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#F8FAFC]">${Number(book.price).toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#94A3B8]">{book.soldCount || 0}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={book.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => toggleStatus(book._id)}
                          disabled={busyId === book._id}
                          title={book.status === "Published" ? "Unpublish" : "Publish"}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#F4C430] hover:bg-[#F4C430]/10 transition-colors disabled:opacity-40"
                        >
                          {book.status === "Published" ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <Link
                          href={`/dashboard/writer/edit-ebook/${book._id}`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#818CF8] hover:bg-[#818CF8]/10 transition-colors"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => deleteEbook(book._id)}
                          disabled={busyId === book._id}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#F87171] hover:bg-[#F87171]/10 transition-colors disabled:opacity-40"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}