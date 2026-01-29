"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Contact } from "@/types/contact"
import { trackEvent } from "@/lib/analytics"
import { X } from "lucide-react"

export default function Contact() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  /* -----------------------------
   * Analytics placeholders
   * ----------------------------- */
  function trackModalOpened() {
    trackEvent("Contact Modal Opened")
  }

  function trackFormSubmitted(contact?: Contact) {
    trackEvent("Contact Form Submitted", contact ? { ...contact } : undefined)
  }

  function trackFormAbandoned() {
    trackEvent("Contact Form Abandoned")
  }

  function trackFormError(errorMessage: string, contact?: Contact) {
    trackEvent("Contact Form Error", { error: String(errorMessage), ...(contact ? { ...contact } : {}) })
  }

  function trackFormSuccess(contact?: Contact) {
    trackEvent("Contact Form Success", contact ? { ...contact } : undefined)
  }

  /* -----------------------------
   * Handlers
   * ----------------------------- */
  function openModal() {
    setErrorMsg("")
    setSuccessMsg("")
    trackModalOpened()
    setIsOpen(true)
  }

  function closeModal() {
    trackFormAbandoned()
    setIsOpen(false)
    setLoading(false)
    setErrorMsg("")
    setSuccessMsg("")
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")
    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    const contact: Contact = {
      first_name: formData.get("first-name") as string,
      last_name: formData.get("last-name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from("contacts").insert([contact])
      if (error) {
        console.error("Supabase insert error:", error)
        setErrorMsg("There was an error sending your message. Please try again.")
        trackFormError(error.message, contact)
        setLoading(false)
        return
      }
      trackFormSubmitted(contact)
      trackFormSuccess(contact)
      setSuccessMsg("Message sent successfully! 🦉")
      setLoading(false)
      form.reset()
    } catch (err) {
      console.error("Unexpected submit error:", err)
      setErrorMsg("There was an error sending your message. Please try again.")
      trackFormError("Unexpected error", contact)
      setLoading(false)
    }
  }

  return (
    <>
      {/* CTA */}
      <section
        id="contact"
        className="flex flex-col m-3.5 p-3.5 items-center justify-center rounded-2xl gap-3"
        style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
      >
        <h3 className="text-3xl text-center font-bold lowercase font-heading" style={{ color: '#d4af37' }}>
          <span className="font-heading" style={{ color: '#f5f1de' }}>The Hogwarts School of Magic</span> at your services
        </h3>
        <p className="max-w-160 text-center">
          We have the best wizards. Summoning fresh air and Braze simultaneously, backed by an Amplitude of knowledge.
          Trust me… I&apos;ve seen the dashbo... I mean, the magic book.
        </p>
        <button
          onClick={openModal}
          className="rounded-2xl px-6 py-3 font-extrabold transition cursor-pointer"
          style={{ backgroundColor: '#d4af37', color: '#0f0f0f' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#740001'; e.currentTarget.style.color = '#d4af37'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#d4af37'; e.currentTarget.style.color = '#0f0f0f'; }}
        >
          Contact Hogwarts 🦉
        </button>
      </section>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-2">
          <div
            className="relative w-full max-w-xl rounded-2xl p-4 sm:p-6"
            style={{
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
              border: '1.5px solid var(--accent-gray)',
              maxWidth: '100%',
              minWidth: 0,
              boxSizing: 'border-box',
              overflowY: 'auto',
              maxHeight: '90vh',
            }}
          >

            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 transition"
              style={{ color: 'var(--primary-gold)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#f5f1de'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--primary-gold)'; }}
              aria-label="Close modal"
            >
              <X />
            </button>

            {/* Title */}
            <h3 className="text-3xl font-bold mb-2 font-heading" style={{ color: 'var(--primary-gold)' }}>
              Contact Hogwarts
            </h3>

            {/* Acid disclaimer */}
            <p className="text-xs my-6 leading-relaxed" style={{ color: 'var(--primary-gold)', opacity: 0.85 }}>
              Well… we don&apos;t actually <em>need</em> your data.
              <br />
              We&apos;re wizards. We already know why you&apos;re here.
              <br />
              But if it makes you feel important, go ahead and fill the form.
              Leaving halfway is allowed too.
              <br />
              <br />
              <span className="italic text-gray-700">
                {" "}I wouldn&apos;t do it if I were you.
              </span>
            </p>

            {/* FORM */}
            <form
              id="contact-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full max-w-md mx-auto"
            >
              {errorMsg && (
                <div className="w-full text-center py-2 rounded-lg font-semibold" style={{ background: 'rgba(116,0,1,0.12)', color: 'var(--primary-burgundy)' }}>
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="w-full text-center py-2 rounded-lg font-semibold" style={{ background: 'rgba(212,175,55,0.12)', color: 'var(--primary-gold)' }}>
                  {successMsg}
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label htmlFor="first-name" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>First name<span className="text-red-500">*</span></label>
                <input
                  id="first-name"
                  name="first-name"
                  placeholder="First name"
                  required
                  className="rounded-lg border px-3 py-2 text-base focus:outline-none focus:ring-2 transition placeholder-gray-500"
                  style={{
                    backgroundColor: 'var(--accent-gray)',
                    color: 'var(--foreground)',
                    borderColor: 'var(--primary-gold)',
                  }}
                  autoComplete="given-name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="last-name" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Last name</label>
                <input
                  id="last-name"
                  name="last-name"
                  placeholder="Last name"
                  className="rounded-lg border px-3 py-2 text-base focus:outline-none focus:ring-2 transition placeholder-gray-500"
                  style={{
                    backgroundColor: 'var(--accent-gray)',
                    color: 'var(--foreground)',
                    borderColor: 'var(--primary-gold)',
                  }}
                  autoComplete="family-name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Email<span className="text-red-500">*</span></label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your best e-mail"
                  required
                  className="rounded-lg border px-3 py-2 text-base focus:outline-none focus:ring-2 transition placeholder-gray-500"
                  style={{
                    backgroundColor: 'var(--accent-gray)',
                    color: 'var(--foreground)',
                    borderColor: 'var(--primary-gold)',
                  }}
                  autoComplete="email"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="message" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Message<span className="text-red-500">*</span></label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Say what you must. The castle is listening."
                  required
                  rows={4}
                  className="rounded-lg border px-3 py-2 text-base focus:outline-none focus:ring-2 transition placeholder-gray-500 resize-none"
                  style={{
                    backgroundColor: 'var(--accent-gray)',
                    color: 'var(--foreground)',
                    borderColor: 'var(--primary-gold)',
                  }}
                />
              </div>
              <button
                type="submit"
                className="mt-2 rounded-lg font-bold transition-colors w-full flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--primary-gold)',
                  color: 'var(--background)',
                  border: '1.5px solid var(--primary-gold)',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
                disabled={loading}
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5 text-inherit" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
                {loading ? 'Sending...' : 'Send message'}
              </button>
            </form>

            {/* Footer sarcasm */}
            <p className="mt-4 text-xs italic text-center" style={{ color: 'var(--primary-gold)', opacity: 0.7 }}>
              By submitting this form you agree that Hogwarts will absolutely do
              whatever it wants with this information.
            </p>
          </div>
        </div>
      )}

      {/* Remove old .input style, now using Tailwind classes for all fields */}
    </>
  )
}
