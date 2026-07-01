export default function StatusBadge({ status }) {
  const isPublished = status === "Published";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
        isPublished
          ? "text-[#4ADE80] bg-[#4ADE80]/10 border border-[#4ADE80]/25"
          : "text-[#94A3B8] bg-white/5 border border-white/10"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isPublished ? "bg-[#4ADE80]" : "bg-[#94A3B8]"}`}
      />
      {status}
    </span>
  );
}