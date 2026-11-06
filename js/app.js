(function(){
  var C=window.SITE_CONFIG||{};
  document.querySelectorAll('[data-marca]').forEach(function(e){e.textContent=C.marca||e.textContent});
  var btn=document.querySelector('.menu-btn'),ul=document.getElementById('menu');
  if(btn)btn.addEventListener('click',function(){var o=ul.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
  var wa=C.whatsapp&&/^\d{8,15}$/.test(C.whatsapp);
  var base="Olá! Gostaria de falar sobre um projeto (agentes, aplicações, sites ou automatismos com IA).";
  document.querySelectorAll('[data-wa]').forEach(function(a){
    if(wa){a.href="https://wa.me/"+C.whatsapp+"?text="+encodeURIComponent(base);a.target="_blank";a.rel="noopener"}
    else a.addEventListener('click',function(e){e.preventDefault();alert("O contacto por WhatsApp ainda não está configurado. Use o formulário de orçamento.")});
  });
  document.querySelectorAll('[data-buy]').forEach(function(a){
    if(C.linkCompra){a.href=C.linkCompra;a.rel="noopener"}
    else a.addEventListener('click',function(e){e.preventDefault();alert("A compra direta ainda não está ativa. Peça um orçamento e responderemos com a proposta.");location.href="contacto.html"});
  });
  if(wa&&C.email&&C.true)document.querySelectorAll('[data-pend]').forEach(function(n){n.hidden=true});
  var f=document.getElementById('f');if(!f)return;
  var st=document.getElementById('st');
  function show(k,t){st.className='status '+k;st.textContent=t}
  var msgs={nome:"Indique o seu nome.",contacto:"Indique um e-mail ou telemóvel válido.",servico:"Escolha um serviço.",msg:"Descreva brevemente o que precisa."};
  function valid(){var ok=true,first=null;
    ['nome','contacto','servico','msg'].forEach(function(n){
      var el=f.elements[n],v=el.value.trim(),bad=!v;
      if(n==='contacto'&&v)bad=!(/^\S+@\S+\.\S+$/.test(v)||/^[+\d][\d\s().-]{6,}$/.test(v));
      document.getElementById('e-'+n).textContent=bad?msgs[n]:'';
      el.setAttribute('aria-invalid',bad);
      if(bad){ok=false;first=first||el}});
    if(first)first.focus();return ok}
  f.addEventListener('submit',function(e){
    e.preventDefault();st.className='status';
    if(f.elements.site.value)return; // anti-spam
    if(!valid())return;
    var d={nome:f.nome.value.trim(),contacto:f.contacto.value.trim(),servico:f.servico.value,mensagem:f.msg.value.trim()};
    var texto="Pedido de orçamento\nNome: "+d.nome+"\nContacto: "+d.contacto+"\nServiço: "+d.servico+"\n\n"+d.mensagem;
    if(C.formEndpoint){
      show('ok','A enviar…');
      fetch(C.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)})
        .then(function(r){if(!r.ok)throw 0;show('ok','Pedido enviado com sucesso. Entraremos em contacto.');f.reset()})
        .catch(function(){show('bad','Não foi possível enviar. Tente novamente ou fale connosco por WhatsApp.')});
    }else if(wa){
      window.open("https://wa.me/"+C.whatsapp+"?text="+encodeURIComponent(texto),"_blank","noopener");
      show('ok','Abrimos o WhatsApp com a sua mensagem pronta. O pedido só fica enviado quando carregar em "Enviar" no WhatsApp.');
    }else if(C.email){
      location.href="mailto:"+C.email+"?subject="+encodeURIComponent("Pedido de orçamento")+"&body="+encodeURIComponent(texto);
      show('ok','Abrimos a sua aplicação de e-mail com a mensagem pronta. O pedido só fica enviado quando o enviar por lá.');
    }else{
      show('bad','O envio ainda não está configurado (falta WhatsApp, e-mail ou serviço de formulários). O seu pedido NÃO foi enviado.');
    }
  });
})();
