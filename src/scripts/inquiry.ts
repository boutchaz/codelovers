for (const form of document.querySelectorAll<HTMLFormElement>('[data-inquiry-form]')) {
  let requestId = crypto.randomUUID();
  let pending = false;
  let lastPayload = "";
  const fr = form.dataset.language === 'fr';
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const result = form.querySelector<HTMLElement>('[data-inquiry-result]')!;
    const values = Object.fromEntries(new FormData(form).entries());
    const query = new URLSearchParams(location.search);
    const fields = {...values, language: form.dataset.language, product: String(values.product || ""),
      page_path: location.pathname, consent: values.consent === 'on',
      utm_source: (query.get('utm_source') || '').slice(0,100), utm_medium: (query.get('utm_medium') || '').slice(0,100), utm_campaign: (query.get('utm_campaign') || '').slice(0,100)};
    const fingerprint = JSON.stringify(fields);
    if (lastPayload && lastPayload !== fingerprint) requestId = crypto.randomUUID();
    lastPayload = fingerprint;
    const payload = {...fields, request_id: requestId};
    pending = true; button.disabled = true;
    result.textContent = fr ? 'Envoi en cours…' : 'Sending…';
    try {
      const response = await fetch('/api/inquiry', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(30000)});
      if (!response.ok || (await response.json()).accepted !== true) throw Error();
      form.reset(); requestId = crypto.randomUUID(); lastPayload = "";
      result.textContent = fr ? 'Merci ! Votre demande a été enregistrée. Notre équipe vous répondra par email.' : 'Thank you! Your inquiry has been recorded. Our team will reply by email.';
      // No names, email addresses, message bodies or form values enter analytics.
      document.dispatchEvent(new CustomEvent('codelovers:inquiry-recorded', {detail:{language:payload.language,product:payload.product}}));
    } catch {
      result.textContent = fr ? 'Impossible de confirmer l’envoi. Réessayez ou écrivez à tech@wearecodelovers.com.' : 'We could not confirm delivery. Retry or email tech@wearecodelovers.com.';
      // Keep the same request ID so a timed-out but accepted submission is not duplicated.
    } finally { pending = false; button.disabled = false; }
  });
}
