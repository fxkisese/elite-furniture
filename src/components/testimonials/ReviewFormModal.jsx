import React, { useState } from "react";
import { X, Star, Send, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import "./testimonials.css";

export default function ReviewFormModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    author_name: "",
    role: "",
    rating: 0,
    text: "",
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.author_name.trim()) return setError("Please enter your name.");
    if (form.rating === 0) return setError("Please select a star rating.");
    if (!form.text.trim()) return setError("Please write your review.");
    if (form.text.trim().length < 10) return setError("Review must be at least 10 characters.");

    setSubmitting(true);
    setError("");

    try {
      const { error: dbError } = await supabase.from("reviews").insert([
        {
          author_name: form.author_name.trim(),
          role: form.role.trim() || null,
          rating: form.rating,
          text: form.text.trim(),
          source: "manual",
          approved: false,
        },
      ]);

      if (dbError) throw dbError;

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({ author_name: "", role: "", rating: 0, text: "" });
    setHoverRating(0);
    setSubmitted(false);
    setError("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm sc-fade-in" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-[#111111] border border-[#1E1E1E] rounded-xl shadow-2xl overflow-hidden sc-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 text-[#555] hover:text-[#D4AF37] transition-colors p-1"
        >
          <X size={20} />
        </button>

        <div style={{ padding: "2.5rem 2rem" }}>
          {submitted ? (
            /* ── Success State ── */
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div
                style={{
                  width: 64, height: 64, borderRadius: "50%",
                  backgroundColor: "rgba(212,175,55,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  border: "2px solid #D4AF37",
                }}
              >
                <Star size={28} fill="#D4AF37" color="#D4AF37" />
              </div>
              <h3
                className="tm-body-font"
                style={{
                  color: "#FFFFFF", fontSize: 20, fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                Thank You!
              </h3>
              <p
                className="tm-body-font"
                style={{ color: "#888", fontSize: 14, lineHeight: 1.6 }}
              >
                Your review has been submitted and will appear once approved by our team.
              </p>
              <button
                onClick={handleClose}
                style={{
                  marginTop: "1.5rem",
                  padding: "12px 32px",
                  backgroundColor: "#D4AF37",
                  color: "#0A0A0A",
                  border: "none",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  borderRadius: 4,
                }}
              >
                Done
              </button>
            </div>
          ) : (
            /* ── Form State ── */
            <>
              <div style={{ marginBottom: "1.5rem" }}>
                <span
                  className="tm-body-font"
                  style={{
                    fontSize: 10, letterSpacing: "0.25em",
                    color: "#D4AF37", textTransform: "uppercase", fontWeight: 600,
                  }}
                >
                  Share Your Experience
                </span>
                <h3
                  className="tm-body-font"
                  style={{
                    color: "#FFFFFF", fontSize: 22, fontWeight: 700,
                    marginTop: 6,
                  }}
                >
                  Write a Review
                </h3>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Star Rating */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    className="tm-body-font"
                    style={{
                      display: "block", fontSize: 11, fontWeight: 600,
                      color: "#888", letterSpacing: "0.1em",
                      textTransform: "uppercase", marginBottom: 8,
                    }}
                  >
                    Your Rating *
                  </label>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, rating: star }))}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          padding: 4, transition: "transform 0.15s ease",
                          transform: (hoverRating || form.rating) >= star ? "scale(1.15)" : "scale(1)",
                        }}
                      >
                        <Star
                          size={28}
                          fill={(hoverRating || form.rating) >= star ? "#D4AF37" : "transparent"}
                          color={(hoverRating || form.rating) >= star ? "#D4AF37" : "#333"}
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    className="tm-body-font"
                    style={{
                      display: "block", fontSize: 11, fontWeight: 600,
                      color: "#888", letterSpacing: "0.1em",
                      textTransform: "uppercase", marginBottom: 6,
                    }}
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="author_name"
                    value={form.author_name}
                    onChange={handleChange}
                    placeholder="e.g. John K."
                    maxLength={60}
                    style={{
                      width: "100%", padding: "12px 14px",
                      backgroundColor: "#0A0A0A",
                      border: "1px solid #1E1E1E",
                      borderRadius: 6,
                      color: "#FFFFFF",
                      fontSize: 14,
                      fontFamily: "Inter, sans-serif",
                      outline: "none",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
                    onBlur={(e) => (e.target.style.borderColor = "#1E1E1E")}
                  />
                </div>

                {/* Role (optional) */}
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    className="tm-body-font"
                    style={{
                      display: "block", fontSize: 11, fontWeight: 600,
                      color: "#888", letterSpacing: "0.1em",
                      textTransform: "uppercase", marginBottom: 6,
                    }}
                  >
                    Title / Location{" "}
                    <span style={{ color: "#444", fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="e.g. Homeowner, Nairobi"
                    maxLength={80}
                    style={{
                      width: "100%", padding: "12px 14px",
                      backgroundColor: "#0A0A0A",
                      border: "1px solid #1E1E1E",
                      borderRadius: 6,
                      color: "#FFFFFF",
                      fontSize: 14,
                      fontFamily: "Inter, sans-serif",
                      outline: "none",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
                    onBlur={(e) => (e.target.style.borderColor = "#1E1E1E")}
                  />
                </div>

                {/* Review text */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    className="tm-body-font"
                    style={{
                      display: "block", fontSize: 11, fontWeight: 600,
                      color: "#888", letterSpacing: "0.1em",
                      textTransform: "uppercase", marginBottom: 6,
                    }}
                  >
                    Your Review *
                  </label>
                  <textarea
                    name="text"
                    value={form.text}
                    onChange={handleChange}
                    placeholder="Tell us about your experience with Furniture Elite Space..."
                    rows={4}
                    maxLength={500}
                    style={{
                      width: "100%", padding: "12px 14px",
                      backgroundColor: "#0A0A0A",
                      border: "1px solid #1E1E1E",
                      borderRadius: 6,
                      color: "#FFFFFF",
                      fontSize: 14,
                      fontFamily: "Inter, sans-serif",
                      outline: "none",
                      resize: "vertical",
                      minHeight: 100,
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
                    onBlur={(e) => (e.target.style.borderColor = "#1E1E1E")}
                  />
                  <div
                    style={{
                      textAlign: "right", fontSize: 10, color: "#444",
                      marginTop: 4,
                    }}
                  >
                    {form.text.length}/500
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div
                    style={{
                      padding: "10px 14px",
                      backgroundColor: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      borderRadius: 6,
                      color: "#EF4444",
                      fontSize: 13,
                      marginBottom: "1rem",
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "14px",
                    backgroundColor: submitting ? "#333" : "#D4AF37",
                    color: submitting ? "#888" : "#0A0A0A",
                    border: "none",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: submitting ? "not-allowed" : "pointer",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "background-color 0.2s ease",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Submit Review
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
