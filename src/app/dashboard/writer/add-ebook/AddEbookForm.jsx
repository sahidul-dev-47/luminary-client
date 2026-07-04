"use client";

// ─────────────────────────────────────────────────────────────────────────────
//
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookPlus,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  BookOpen,
  FileText,
  Tag,
  ImageIcon,
  Loader2,
  ImageIcon as _Unused,
  Clock,
  Info,
  ChevronDown,
} from "lucide-react";

import { createEbook } from "@/lib/actions/ebook";
import { authClient } from "@/lib/auth-client";
import { authFetch } from "@/lib/clientFetch";

const GENRES = [
  "Fiction",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Fantasy",
  "Horror",
  "Thriller",
  "Poetry",
  "Non-Fiction",
  "Biography",
  "Personal Development",
  "Science",
  "Marketing",
  "Design",
  "Technology",
  "History",
  "Medicine & Health",
  "Religion"
];

const ACCENT = "#F4C430";
const SUCCESS = "#4ADE80";
const ACCENT_RGB = "244,196,48";

// ── imgBB upload helper ──────────────────────────────────
async function uploadToImgBB(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await authFetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_API}`,
    { method: "POST", body: formData },
  );
  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return data.data.url; 
}

// ── Field wrapper ────────────────────────────────────────
function Field({ label, required, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[12px] font-semibold tracking-[0.1em] uppercase"
        style={{
          color: error ? "#EF4444" : "#475569",
          fontFamily: "'Inter',sans-serif",
        }}
      >
        {label} {required && <span style={{ color: ACCENT }}>*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-[11.5px]"
            style={{ color: "#EF4444", fontFamily: "'Inter',sans-serif" }}
          >
            <AlertCircle size={11} strokeWidth={2} />
            {error}
          </motion.p>
        )}
        {hint && !error && (
          <p
            className="text-[11px]"
            style={{ color: "#1E293B", fontFamily: "'Inter',sans-serif" }}
          >
            {hint}
          </p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Shared input style ───────────────────────────────────
const inputBase = {
  background: "rgba(255,255,255,0.03)",
  border: "0.5px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#CBD5E1",
  fontFamily: "'Inter',sans-serif",
  fontSize: "13.5px",
  outline: "none",
  width: "100%",
  padding: "11px 14px",
  transition: "border-color 0.2s",
};

const inputFocusStyle = `
  .fable-input:focus { border-color: rgba(244,196,48,0.4) !important; }
  .fable-input::placeholder { color: #1E293B; }
  .fable-select option { background: #0F0F1A; color: #CBD5E1; }
  .fable-textarea { resize: vertical; min-height: 120px; }
`;

export default function AddEbookFormPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  console.log("session.user:", session?.user);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    genre: "",
  });
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef(null);

  // ── Validation ────────────────────────────────────────
  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    else if (form.title.length > 120) e.title = "Max 120 characters";
    if (!form.description.trim()) e.description = "Description is required";
    else if (form.description.length < 30)
      e.description = "At least 30 characters";
    if (!form.genre) e.genre = "Please select a genre";
    if (form.price === "") e.price = "Price is required";
    else if (isNaN(form.price) || Number(form.price) < 0)
      e.price = "Enter a valid price (0 or more)";
    if (!imageFile) e.image = "Cover image is required";
    return e;
  }

  // ── Image pick ────────────────────────────────────────
  function handleImageChange(file) {
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return setErrors((p) => ({ ...p, image: "Only image files allowed" }));
    if (file.size > 5 * 1024 * 1024)
      return setErrors((p) => ({ ...p, image: "Image must be under 5 MB" }));
    setImageFile(file);
    setErrors((p) => ({ ...p, image: undefined }));
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    handleImageChange(e.dataTransfer.files[0]);
  }

  // ── Submit
  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }

    try {
      setUploading(true);
      const coverImage = await uploadToImgBB(imageFile);
      setUploading(false);

      setSubmitting(true);
      const writerId = session?.user?.id || session?.user?._id;
      const writerName =
        session?.user?.name || session?.session?.user?.name || "Unknown Author";
      const writerEmail =
        session?.user?.email ||
        session?.session?.user?.email ||
        "unknown@fable.com";

      if (!writerId) {
        setServerError("You must be logged in to add an ebook.");
        return;
      }

      const resData = await createEbook({
        title: form.title,
        writerId,
        writerName,
        writerEmail,
        description: form.description,
        fullContent: "Full content text goes here...",
        price: Number(form.price),
        genre: form.genre,
        coverImage,
        
      });

      if (resData && (resData.acknowledged || resData._id)) {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard/writer/my-ebooks"), 2200);
      } else {
        throw new Error(resData?.message || "Failed to add ebook");
      }
    } catch (err) {
      setServerError(err.message);
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  }

  const isLoading = uploading || submitting;

  // ── Success screen ────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#07070E] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 text-center px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(244,196,48,0.12)",
              border: "0.5px solid rgba(244,196,48,0.3)",
            }}
          >
            <CheckCircle2
              size={40}
              style={{ color: SUCCESS }}
              strokeWidth={1.5}
            />
          </motion.div>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "1.8rem",
              color: "#EDE9E0",
              fontWeight: 700,
            }}
          >
            Submitted for review
          </h2>
          <p
            style={{
              color: "#475569",
              fontFamily: "'Inter',sans-serif",
              fontSize: "14px",
              maxWidth: "320px",
            }}
          >
            Your ebook now sits in My Ebooks as a draft. Once an admin approves
            it, it'll appear in Browse Ebooks automatically.
          </p>
          <p
            style={{
              color: "#1E293B",
              fontFamily: "'Inter',sans-serif",
              fontSize: "12px",
            }}
          >
            Redirecting to your dashboard…
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#07070E] relative"
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.025) 1px,transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <style>{inputFocusStyle}</style>

      {/* Accent glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 40% at 50% 0%, rgba(${ACCENT_RGB},0.06) 0%, transparent 65%)`,
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: `rgba(${ACCENT_RGB},0.12)`,
                border: `0.5px solid rgba(${ACCENT_RGB},0.25)`,
              }}
            >
              <BookPlus size={18} style={{ color: SUCCESS }} strokeWidth={1.8} />
            </div>
            <span
              className="text-[11px] font-bold tracking-[0.18em] uppercase"
              style={{ color: SUCCESS, fontFamily: "'Inter',sans-serif" }}
            >
              Writer Dashboard
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(1.6rem,4vw,2.4rem)",
              fontWeight: 700,
              color: "#EDE9E0",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Add a new{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: SUCCESS }}>
              ebook
            </em>
          </h1>
          <p
            style={{
              color: "#334155",
              fontFamily: "'Inter',sans-serif",
              fontSize: "13.5px",
              marginTop: "6px",
            }}
          >
            Fill in the details below. Every new title starts as a draft
            awaiting review.
          </p>
        </motion.div>

      
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04, duration: 0.5 }}
          className="flex items-start gap-3 rounded-xl px-4 py-3.5 mb-6"
          style={{
            background: `rgba(${ACCENT_RGB},0.06)`,
            border: `0.5px solid rgba(${ACCENT_RGB},0.2)`,
          }}
        >
          <Info
            size={16}
            strokeWidth={1.8}
            style={{ color: ACCENT, flexShrink: 0, marginTop: "1px" }}
          />
          <p
            style={{
              color: "#94A3B8",
              fontFamily: "'Inter',sans-serif",
              fontSize: "12.5px",
              lineHeight: 1.5,
            }}
          >
            Ebooks aren't publish-ready the moment you save them. This one will
            sit in <span style={{ color: "#CBD5E1" }}>My Ebooks</span> as a
            draft until an admin reviews and approves it — only then does it
            appear in Browse Ebooks for readers.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl p-6 sm:p-8 flex flex-col gap-7"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
          }}
          noValidate
        >
          {/* ── Cover image upload ── */}
          <Field label="Cover Image" required error={errors.image}>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !imagePreview && fileRef.current?.click()}
              className="relative rounded-xl overflow-hidden transition-all duration-200 cursor-pointer"
              style={{
                border: `1px dashed ${isDragging ? ACCENT : errors.image ? "#EF4444" : "rgba(255,255,255,0.12)"}`,
                background: isDragging
                  ? `rgba(${ACCENT_RGB},0.05)`
                  : "rgba(255,255,255,0.02)",
                minHeight: imagePreview ? "auto" : "160px",
              }}
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-[320px] object-cover"
                  />
                  {/* Overlay controls */}
                  <div
                    className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "rgba(7,7,14,0.7)" }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileRef.current?.click();
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold"
                      style={{
                        background: ACCENT,
                        color: "#07070E",
                        fontFamily: "'Inter',sans-serif",
                      }}
                    >
                      <Upload size={13} strokeWidth={2.5} /> Change
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium"
                      style={{
                        background: "rgba(239,68,68,0.15)",
                        color: "#EF4444",
                        border: "0.5px solid rgba(239,68,68,0.3)",
                        fontFamily: "'Inter',sans-serif",
                      }}
                    >
                      <X size={13} strokeWidth={2.5} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-10 px-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `rgba(${ACCENT_RGB},0.1)`,
                      border: `0.5px solid rgba(${ACCENT_RGB},0.2)`,
                    }}
                  >
                    <ImageIcon
                      size={22}
                      style={{ color: ACCENT }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="text-center">
                    <p
                      className="text-[13px] font-medium"
                      style={{
                        color: "#94A3B8",
                        fontFamily: "'Inter',sans-serif",
                      }}
                    >
                      Drag & drop or{" "}
                      <span
                        style={{ color: ACCENT, textDecoration: "underline" }}
                      >
                        browse
                      </span>
                    </p>
                    <p
                      className="text-[11px] mt-1"
                      style={{
                        color: "#1E293B",
                        fontFamily: "'Inter',sans-serif",
                      }}
                    >
                      PNG, JPG, WEBP · Max 5 MB
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files[0])}
              />
            </div>
          </Field>

          {/* ── Title ── */}
          <Field
            label="Title"
            required
            error={errors.title}
            hint={`${form.title.length}/120`}
          >
            <div className="relative">
              <BookOpen
                size={14}
                strokeWidth={1.8}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#334155" }}
              />
              <input
                className="fable-input"
                style={{ ...inputBase, paddingLeft: "36px" }}
                placeholder="e.g. The Silent Archive"
                value={form.title}
                maxLength={120}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
              />
            </div>
          </Field>

          {/* ── Description ── */}
          <Field
            label="Description"
            required
            error={errors.description}
            hint="Write a compelling synopsis. Minimum 30 characters."
          >
            <div className="relative">
              <FileText
                size={14}
                strokeWidth={1.8}
                className="absolute left-3.5 top-3.5 pointer-events-none"
                style={{ color: "#334155" }}
              />
              <textarea
                className="fable-input fable-textarea"
                style={{ ...inputBase, paddingLeft: "36px" }}
                placeholder="Give readers a taste of your story…"
                value={form.description}
                rows={5}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>
          </Field>

          {/* ── Genre + Price row ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Genre */}
            <Field label="Genre" required error={errors.genre}>
              <div className="relative">
                <Tag
                  size={14}
                  strokeWidth={1.8}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#334155", zIndex: 1 }}
                />
                <ChevronDown
                  size={14}
                  strokeWidth={1.8}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#334155" }}
                />
                <select
                  className="fable-input fable-select"
                  style={{
                    ...inputBase,
                    paddingLeft: "36px",
                    appearance: "none",
                    cursor: "pointer",
                  }}
                  value={form.genre}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, genre: e.target.value }))
                  }
                >
                  <option value="">Select genre…</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </Field>

            {/* Price */}
            <Field
              label="Price (USD)"
              required
              error={errors.price}
              hint="Enter 0 for a free ebook"
            >
              <div className="relative">
                <DollarSign
                  size={14}
                  strokeWidth={1.8}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#334155" }}
                />
                <input
                  className="fable-input"
                  style={{ ...inputBase, paddingLeft: "36px" }}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="4.99"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                />
              </div>
            </Field>
          </div>

          {/* ── Server error ── */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "0.5px solid rgba(239,68,68,0.25)",
                  color: "#EF4444",
                  fontFamily: "'Inter',sans-serif",
                  fontSize: "13px",
                }}
              >
                <AlertCircle
                  size={15}
                  strokeWidth={2}
                  style={{ flexShrink: 0 }}
                />
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            style={{
              background: ACCENT,
              color: "#07070E",
              fontFamily: "'Inter',sans-serif",
              boxShadow: `0 4px 20px rgba(${ACCENT_RGB},0.25)`,
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" strokeWidth={2.5} />
                {uploading ? "Uploading image…" : "Submitting for review…"}
              </>
            ) : (
              <>
                <Clock size={16} strokeWidth={2.5} />
                Submit for review
              </>
            )}
          </button>

          {/* Bottom note */}
          <p
            className="text-center text-[11px]"
            style={{ color: "#1E293B", fontFamily: "'Inter',sans-serif" }}
          >
            Cover image is uploaded to imgBB · You can edit this ebook anytime
            from My Ebooks
          </p>
        </motion.form>
      </div>
    </div>
  );
}
