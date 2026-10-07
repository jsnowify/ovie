"use client";

import { useState, type FormEvent } from "react";
import { services } from "@/data/services";

const inputClass = "mt-3 w-full rounded-none border-b border-ink/30 bg-transparent py-3 text-base text-ink placeholder:text-ink/40 focus:border-clay focus:outline-none";

export default function InquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form onSubmit={submit} onChange={() => setSubmitted(false)} aria-describedby="inquiry-demo-note" className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
      <label className="text-sm">Name<input name="name" required autoComplete="name" maxLength={120} placeholder="Your name" className={inputClass} /></label>
      <label className="text-sm">Email<input name="email" type="email" required autoComplete="email" maxLength={254} placeholder="Your email address" className={inputClass} /></label>
      <label className="text-sm">Project type<select name="type" required defaultValue="" className={inputClass}><option value="" disabled>Select a project type</option>{services.map((service) => <option key={service.id} value={service.title}>{service.title.charAt(0) + service.title.slice(1).toLowerCase()}</option>)}</select></label>
      <label className="text-sm">Project location<input name="location" required autoComplete="off" maxLength={200} placeholder="City / province / country" className={inputClass} /></label>
      <label className="text-sm">Estimated area<input name="area" type="number" required min="1" step="any" placeholder="sqm" className={inputClass} /></label>
      <label className="text-sm">Estimated budget <span className="text-ink/50">(optional)</span><input name="budget" maxLength={120} placeholder="Amount and currency" className={inputClass} /></label>
      <label className="text-sm sm:col-span-2">Target timeline <span className="text-ink/50">(optional)</span><input name="timeline" maxLength={200} placeholder="When would you like to begin?" className={inputClass} /></label>
      <label className="text-sm sm:col-span-2">Project details<textarea name="details" required maxLength={4000} rows={5} placeholder="Tell us about the site, scope, goals, and anything we should know." className={`${inputClass} resize-y`} /></label>
      <div className="sm:col-span-2">
        <button type="submit" className="min-h-14 border border-clay bg-clay px-8 py-4 text-sm text-cream transition-colors hover:bg-ink hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-clay">Send inquiry <span aria-hidden="true" className="ml-6">↗</span></button>
        <p id="inquiry-demo-note" className="mt-4 max-w-[50ch] text-xs leading-relaxed text-ink/60">Ovie is a portfolio concept, not an operating architecture studio. This demo form does not send or store inquiries.</p>
        {submitted && <p role="status" className="mt-4 border-l-2 border-clay pl-4 text-sm leading-relaxed">Demo complete. Your inquiry has not been sent or stored. Thank you for exploring Ovie.</p>}
      </div>
    </form>
  );
}
