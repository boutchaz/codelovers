import {currentCampaign} from '@/scripts/attribution';
currentCampaign();
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
    const fields = {...values, language: form.dataset.language, product: String(values.product || ""),
      page_path: location.pathname, consent: values.consent === 'on',
      ...currentCampaign()};
    const fingerprint = JSON.stringify(fields);
    if (lastPayload && lastPayload !== fingerprint) requestId = crypto.randomUUID();
    lastPayload = fingerprint;
    const payload = {...fields, request_id: requestId};
    pending = true; button.disabled = true;
    result.textContent = fr ? 'Envoi en cours…' : 'Sending…';
    try {
      const response = await fetch('/api/inquiry', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(30000)});
      const receipt=await response.json();
      if (!response.ok || receipt.accepted !== true) throw Error();
      form.reset(); requestId = crypto.randomUUID(); lastPayload = "";
      result.textContent = fr ? 'Merci ! Votre demande a été enregistrée. Notre équipe vous répondra par email.' : 'Thank you! Your inquiry has been recorded. Our team will reply by email.';
      // No names, email addresses, message bodies or form values enter analytics.
      if(receipt.recorded===true)document.dispatchEvent(new CustomEvent('codelovers:inquiry-recorded', {detail:{language:payload.language,product:payload.product}}));
    } catch {
      result.textContent = fr ? 'Impossible de confirmer l’envoi. Réessayez ou écrivez à tech@wearecodelovers.com.' : 'We could not confirm delivery. Retry or email tech@wearecodelovers.com.';
      // Keep the same request ID so a timed-out but accepted submission is not duplicated.
    } finally { pending = false; button.disabled = false; }
  });
}
