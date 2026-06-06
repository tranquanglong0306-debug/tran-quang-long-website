import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface ContactInfoProps {
  info: {
    email: string;
    social: string[];
  };
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ info }) => {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await response.json();
      if (data.success) {
        setContactStatus("success");
        setContactForm({ name: "", email: "", message: "" });
      } else {
        setContactStatus("error");
      }
    } catch (err) {
      setContactStatus("error");
    }
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      <div className="border border-white/5 p-4 bg-white/[0.01] space-y-2 mb-4">
        <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-sans block">Direct Contact</span>
        <a
          href={`mailto:${info.email}`}
          className="text-sm font-medium text-white hover:text-accent transition-colors block"
        >
          {info.email}
        </a>
        <div className="flex gap-3 pt-2 text-[10px] text-neutral-400 font-sans uppercase tracking-widest">
          {info.social.map((socialItem) => (
            <span key={socialItem} className="hover:text-white transition-colors cursor-pointer">
              {socialItem}
            </span>
          ))}
        </div>
      </div>

      {contactStatus === "success" ? (
        <div className="border border-white/5 p-5 text-center space-y-3 bg-white/[0.01]">
          <h3 className="text-sm font-semibold text-white">Tin nhắn đã được gửi đi!</h3>
          <p className="text-xs text-neutral-400">
            Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi qua email của bạn sớm nhất.
          </p>
          <button
            onClick={() => setContactStatus("idle")}
            className="text-xs uppercase tracking-widest text-neutral-500 hover:text-white underline mt-2"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleContactSubmit} className="space-y-3">
          <div>
            <label className="block text-neutral-500 uppercase tracking-widest text-[9px] mb-1">Name</label>
            <input
              type="text"
              required
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              placeholder="Nguyễn Văn A"
              className="w-full bg-neutral-950 border border-white/5 p-2.5 text-white outline-none focus:border-accent transition-colors rounded-none"
            />
          </div>
          <div>
            <label className="block text-neutral-500 uppercase tracking-widest text-[9px] mb-1">Email</label>
            <input
              type="email"
              required
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              placeholder="name@school.edu.vn"
              className="w-full bg-neutral-950 border border-white/5 p-2.5 text-white outline-none focus:border-accent transition-colors rounded-none"
            />
          </div>
          <div>
            <label className="block text-neutral-500 uppercase tracking-widest text-[9px] mb-1">Message</label>
            <textarea
              required
              rows={4}
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              placeholder="Nội dung thảo luận của bạn..."
              className="w-full bg-neutral-950 border border-white/5 p-2.5 text-white outline-none focus:border-accent transition-colors rounded-none resize-none"
            />
          </div>

          {contactStatus === "error" && (
            <p className="text-xs text-red-500">Đã xảy ra lỗi khi gửi. Vui lòng thử lại sau.</p>
          )}

          <button
            type="submit"
            disabled={contactStatus === "sending"}
            className="w-full bg-white text-black py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex justify-center items-center gap-1.5 disabled:opacity-50"
          >
            {contactStatus === "sending" ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="w-3 h-3" /> Submit Message
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactInfo;
