for(const form of document.querySelectorAll<HTMLFormElement>('[data-newsletter-form]')) {
  let pending=false;
  form.addEventListener('submit',async event=>{
    event.preventDefault(); if(pending || !form.reportValidity()) return;
    const button=form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const result=form.querySelector<HTMLElement>('[data-newsletter-result]')!;
    const values=Object.fromEntries(new FormData(form).entries());
    const fr=values.language==='fr';
    pending=true; button.disabled=true;
    result.textContent=fr ? 'Envoi de la confirmation…' : 'Requesting confirmation…';
    try {
      const response=await fetch('/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({...values,consent:values.consent==='on'}),signal:AbortSignal.timeout(25000)});
      if(!response.ok || (await response.json()).accepted!==true) throw Error();
      form.reset();
      result.textContent=fr ? 'Consultez votre boîte mail et confirmez votre inscription si nécessaire. Vérifiez aussi les indésirables.' : 'Check your inbox and confirm your subscription if needed. Please check spam too.';
    } catch {
      result.textContent=fr ? 'Inscription non confirmée. Réessayez plus tard.' : 'Signup could not be confirmed. Please try again later.';
    } finally {pending=false; button.disabled=false;}
  });
}
