'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, Mail, Link as LinkIcon } from 'lucide-react';

interface ShareButtonProps {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
}

export default function ShareButton({ url, title = 'Check this out!', description = '', image }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const socialLinks = [
    {
      name: 'Facebook',
      icon: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Twitter',
      icon: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'bg-black hover:bg-gray-800',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: 'LinkedIn',
      icon: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      color: 'bg-blue-700 hover:bg-blue-800',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + '\n\n' + shareUrl)}`,
    },
  ];

  return (
    <>
      {/* Share Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 rounded-full flex items-center font-bold transition-colors shadow-none bg-[#DCCCAC] text-black border border-[#546B41] hover:bg-[#FFF8EC]"
      >
        <Share2 size={20} className="mr-2" />
        Share
      </button>

      {/* Share Modal Portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#FFF8EC] border-2 border-[#546B41] rounded-3xl overflow-hidden shadow-2xl relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-[#DCCCAC] border border-[#546B41] rounded-full text-black hover:bg-[#99AD7A] z-10 transition-colors cursor-pointer"
              >
                ✕
              </button>

              {/* Header Image */}
              {image && (
                <div className="h-48 w-full relative border-b-2 border-[#546B41]">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 flex items-end p-6">
                    <h3 className="text-2xl font-black text-white leading-tight">
                      {title.replace(' - Bihar Tourism', '').replace('Visit ', '')}
                    </h3>
                  </div>
                </div>
              )}

              <div className="p-6">
                {!image && (
                  <h3 className="text-2xl font-black text-black mb-2">Share this destination</h3>
                )}

                {/* Brief description */}
                {description && (
                  <p className="text-black font-medium mb-6 line-clamp-2 text-sm italic bg-[#DCCCAC]/30 p-3 rounded-xl border border-[#546B41]/20">
                    "{description}"
                  </p>
                )}

                {/* Native Share (Mobile) */}
                {'share' in navigator && (
                  <button
                    onClick={handleNativeShare}
                    className="w-full flex items-center justify-center gap-3 p-3 mb-4 bg-[#99AD7A] border border-[#546B41] text-black font-bold rounded-xl hover:bg-[#DCCCAC] transition-colors"
                  >
                    <Share2 size={20} />
                    Share directly via device
                  </button>
                )}

                <div className="text-xs font-bold text-[#546B41] uppercase tracking-wider mb-3">Share to</div>

                {/* Social Links */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsOpen(false)}
                        className="flex flex-col items-center justify-center gap-2 p-3 bg-[#DCCCAC] border border-[#546B41] text-black rounded-xl hover:bg-[#99AD7A] hover:-translate-y-1 transition-all"
                        title={social.name}
                      >
                        <Icon size={24} />
                      </a>
                    );
                  })}
                </div>

                <div className="text-xs font-bold text-[#546B41] uppercase tracking-wider mb-2">Or copy link</div>
                {/* Copy Link */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white border border-[#546B41] rounded-xl px-3 py-3 text-sm text-black truncate font-medium">
                    {shareUrl}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-[#DCCCAC] border border-[#546B41] hover:bg-[#99AD7A] rounded-xl transition-colors"
                  >
                    {copied ? (
                      <Check size={20} className="text-black" />
                    ) : (
                      <Copy size={20} className="text-black" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  );
}
