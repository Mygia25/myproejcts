#!/usr/bin/env python3
"""Genera HTML con las 105 historias de Ingrid Núñez (1080×1920 por slide)."""

from pathlib import Path

OUTPUT = Path(__file__).parent / "HISTORIAS-MES.html"

# ─── datos de las 105 historias ──────────────────────────────────────────────
STORIES = [
    # (fecha_corta, fecha_iso, tipo_dia, contenido_feed, h1, h2, h3)
    ("Sáb 14 Mar","2026-03-14","C1 Presentación",
     "Presentación de perfil",
     "Llevas tanto tiempo criando en modo supervivencia. Hoy empieza algo diferente. ✨\n[Encuesta] ¿Cuántos hijos tienes? · 1 · 2 · 3+",
     "DATO: El cerebro de un niño no termina de desarrollarse hasta los 25 años. La impulsividad NO es capricho. Es biología. 🧠\n→ Ve el post de hoy.",
     "¿Cuál es tu mayor reto en la crianza hoy?\nEscríbeme por DM. Te leo personalmente. 💙\n[Caja de preguntas]"),

    ("Dom 15 Mar","2026-03-15","C2 Nadie te dijo",
     "C2 \"Nadie te dijo\"",
     "¿Cómo llegaste a este domingo?\n[Encuesta] ☀️ Con energía · 😴 Necesito dormir 100 horas",
     "Los domingos son para conectar. ¿Cuándo fue la última vez que le preguntaste a tu hijo/a: \"¿qué fue lo mejor de esta semana?\" 🌿\n→ Nuevo carrusel en el feed.",
     "Guarda el post de hoy para cuando lo necesites.\nEsas palabras son para ti. 💜\n[Compartir historia]"),

    ("Lun 16 Mar","2026-03-16","C3 Rabietas",
     "C3 Rabietas",
     "Lunes. Nuevo comienzo. ¿Tu hijo/a cómo llegó hoy?\n[Encuesta] ⚡ Con pilas · 😅 Fue batalla",
     "Las rabietas NO son manipulación. Son el sistema nervioso de tu hijo/a buscando regularse. 🧠\nMás en el feed hoy.",
     "Si hoy perdiste la calma con tu hijo/a...\nno eres mal padre/madre. Eres humano/a.\nY eso también se repara. 🫂\n[Sticker corazón]"),

    ("Mar 17 Mar","2026-03-17","C4 Pantallas+LM2",
     "C4 Pantallas",
     "¿Ya pensaste cuánto amor le das hoy a ti mismo/a?\n[Encuesta] Mucho 💙 · Cero, lo olvidé",
     "El aburrimiento no es el enemigo. Es la puerta a la creatividad y la autorregulación.\n→ El carrusel de hoy te explica por qué. 📱",
     "🎁 Comenta CALMA aquí o en el post de hoy y te mando gratis:\n\"Tu Calma, Su Refugio\"\n5 claves para sobrevivir las crisis sin perder la tuya."),

    ("Mié 18 Mar","2026-03-18","C5 Felicidad",
     "C5 Día Mundial Felicidad",
     "HOY es el Día Mundial de la Felicidad 🌍\n[Caja] ¿Qué hace feliz a tu hijo/a? Cuéntame.",
     "La felicidad real no es no tener emociones difíciles.\nEs saber que no estás solo/a cuando las tienes. 🌱\n→ Feed de hoy.",
     "Comparte esta historia con una mamá que necesite escuchar esto hoy. 💜\n[Botón compartir]"),

    ("Jue 19 Mar","2026-03-19","C6 Down+LM1",
     "C6 Día Síndrome Down",
     "Viernes se acerca. ¿Cómo va la semana?\n[Slider] 1 = en el piso · 10 = imparable 💪",
     "Todos nuestros hijos, con o sin diagnóstico, necesitan lo mismo:\nser vistos tal como son. 💙\nPost de hoy.",
     "🎧 Escríbeme PAUSA por DM y te mando un audio guiado de 10 minutos para regularte ANTES de que empiece la tormenta.\nGratis. 🎁"),

    ("Vie 20 Mar","2026-03-20","C7 Papá agotado",
     "C7 Para el papá/mamá agotado",
     "Viernes. ¿Cómo llegamos?\n[Encuesta] 💪 Sobreviví · 😂 Necesito el fin de semana YA",
     "El carrusel de hoy es para el papá/mamá que ama con todo\npero que hoy simplemente no puede más. 💙 Para ti.",
     "Este fin de semana: 10 minutos solo para ti. Sin culpa.\n¿Puedes hacer eso?\n[Encuesta] Sí, lo intento · Me cuesta mucho"),

    ("Sáb 21 Mar","2026-03-21","Solo historias",
     "Sin publicación en feed",
     "Sábado. Respira. ¿Cuántas veces esta semana te felicitaste a ti mismo/a?\n[Encuesta] Ninguna 😅 · Una o dos veces 💙",
     "La crianza perfecta no existe.\nLa crianza suficientemente buena sí.\nY ya la estás haciendo. 🌿",
     "Mañana comparto algo especial en el feed.\nSolo para los domingos. 💌\n¿Ya me sigues para no perdértelo?\n[Sticker seguir]"),

    ("Dom 22 Mar","2026-03-22","C8 Teaser",
     "C8 Teaser del curso",
     "Domingo de reflexión.\n[Caja] ¿Qué fue lo más difícil esta semana en la crianza?",
     "Esta semana te presento algo que creé para el momento en que todo se desborda.\n→ Ve el carrusel de hoy. 🌿",
     "¿Cuál de estas frases te representa más?\nA: \"Entiendo la teoría pero no puedo en el momento\"\nB: \"Luego me siento culpable\"\nC: \"No sé cómo reparar\"\n[Caja] Comenta A, B o C."),

    ("Lun 23 Mar","2026-03-23","C9 Termostato+LM3",
     "C9 Tú eres el termostato emocional",
     "¿Sabías que tu calma LITERALMENTE calma a tu hijo/a?\nLa neurociencia lo confirma. 🧠\n[Encuesta] Lo sabía · No, cuéntame más",
     "🗺️ Comenta MAPA en el post de hoy y te mando gratis:\nel mapa visual de las emociones detrás de las rabietas.\nNiños de 2 a 8 años.",
     "Esta semana se viene algo grande para ti.\nQuédate cerca. 🌙\n[Countdown: 3 días]"),

    ("Mar 24 Mar","2026-03-24","C10 ¿Te reconoces?",
     "C10 5 señales que el curso es para ti",
     "¿Qué módulo del curso te llama más?\n[Encuesta] 🧠 Entender la rabieta · 🫁 Mi propia regulación · 🗺️ El protocolo paso a paso",
     "Ve el carrusel de hoy: ¿te reconoces en alguna de estas situaciones?\nSi dices sí a 3 o más, el curso es para ti. 💙",
     "PASADO MAÑANA. El link estará en mi bio.\n$29 USD · Acceso de por vida. 🌿\n[Countdown: 2 días]"),

    ("Mié 25 Mar","2026-03-25","C11 Preview módulos",
     "C11 Preview completo del curso",
     "MAÑANA llega. ¿Estás lista/o?\n[Encuesta] ¡Sí! Ya lo esperaba · Tengo dudas, cuéntame",
     "3 módulos. Videos HD. Meditaciones guiadas. Cuaderno digital.\nTodo por $29 una sola vez.\n→ Ve el preview en el feed.",
     "¿Tienes preguntas sobre el curso antes de que salga?\nEscríbeme aquí. Te respondo personalmente. 💙\n[Caja de preguntas]\n[Countdown: 1 día]"),

    ("Jue 26 Mar","2026-03-26","🚀 LANZAMIENTO C12",
     "C12 LANZAMIENTO $29",
     "HOY ES EL DÍA. ✨\n\"De la frustración a la calma\"\nya está disponible.\n→ Link en bio · $29 USD · Acceso de por vida",
     "3 módulos. Videos HD. Meditaciones. Cuaderno digital.\nSoporte WhatsApp. Garantía 7 días.\nTodo por $29 una sola vez. 🎯\n→ Link en bio.",
     "¿Ya lo tienes? Cuéntame.\n¿Tienes preguntas? Escríbeme.\nGarantía de 7 días si no te transforma:\nte devuelvo el dinero completo. 💙\n[Link al curso]"),

    ("Vie 27 Mar","2026-03-27","C13 Post-lanzamiento",
     "C13 Post-lanzamiento FAQ",
     "Gracias a los que ya entraron al curso ayer. 💙\n¿Cómo te fue con el primer módulo?\n[Caja de preguntas]",
     "RECUERDA: el curso tiene garantía de 7 días.\nSi no te cambia la dinámica con tu hijo/a → te devuelvo el dinero.\nSin preguntas. → Link en bio.",
     "Este fin de semana es tu momento.\n$29 una sola vez. → Link en bio. 🌿\n[Sticker link]"),

    ("Sáb 28 Mar","2026-03-28","Solo historias",
     "Sin publicación en feed",
     "Sábado de descanso. ¿Lograste conectar con tu hijo/a esta semana?\n[Encuesta] Sí, bastante 💙 · Fue una semana difícil",
     "¿Ya tienes la guía gratuita?\nComenta CALMA o escríbeme por DM y te la mando ahora. 🎁",
     "Mañana regresamos con algo que te va a hacer reír. 😅\n¿Qué tema de crianza quieres que hable próximamente?\n[Caja de preguntas]"),

    ("Dom 29 Mar","2026-03-29","R1 Reel cotidiano",
     "R1 Situaciones cotidianas",
     "Domingo. El reel de hoy es para que te rías y te reconozcas. 😂\n[Caja] ¿Cuántas situaciones de las que nombro viviste esta semana?",
     "El humor también es crianza consciente.\n→ Ve el reel de hoy y comenta cuál fue la tuya. 😅",
     "Comparte este reel con esa mamá que lo necesita.\nSabes quién es. 💜\n[Botón compartir]"),

    ("Lun 30 Mar","2026-03-30","C14 Etapas+LM4",
     "C14 Lo normal a los 3, 5 y 7 años",
     "¿Cuántos años tiene tu hijo/a?\n[Encuesta] 0–3 años · 4–6 años · 7–10 años · Más de uno 😅",
     "Comenta la edad de tu hijo/a en el post de hoy\ny te mando el recurso de frases para esa etapa. 🎁\nEl LM4 te espera.",
     "DATO: A los 3 años los \"no quiero\" son desarrollo cognitivo normal.\nLas mentiritas a los 5 también.\nNo es mala crianza. Es evolución. 🧠"),

    ("Mar 31 Mar","2026-03-31","R2 Reel Semana Santa",
     "R2 3 actividades Semana Santa",
     "Semana Santa se acerca. ¿Qué planes tienen con los niños?\n[Encuesta] 🏖️ Viaje · 🏠 Casa · Todavía sin plan",
     "El reel de hoy: 3 actividades que conectan,\nno cuestan nada y funcionan de verdad.\nGuárdalo. 🌿",
     "Toma nota: cocinar juntos, la hora sin pantallas,\ndecirse algo que admiran del otro.\nSimple. Poderoso. 💙"),

    ("Mié 1 Abr","2026-04-01","C15 Autismo",
     "C15 Día Mundial Autismo",
     "💙 Día Mundial del Autismo.\n¿Alguien en tu entorno tiene autismo?\n[Encuesta] Sí · No · No sé",
     "\"¿Portarse mal o procesar diferente?\"\nEs la pregunta que todos los padres deberían hacerse.\n→ Feed de hoy. 🌱",
     "Si tienes un hijo/a con TEA o sospechas una diferencia neurológica\ny quieres orientación, escríbeme.\nPuedo ayudarte. 💙\n[Link DM]"),

    ("Jue 2 Abr","2026-04-02","R3 Reel FAQ",
     "R3 ¿Para qué sirve ir a psicología?",
     "¿Alguna vez dudaste si tu hijo/a necesitaba psicología?\n[Encuesta] Sí, lo pensé · No, no lo había considerado",
     "El reel de hoy: respondo una de las preguntas que más me hacen.\n→ Ve y cuéntame qué opinas. 🎬",
     "¿Tienes preguntas sobre cuándo buscar ayuda psicológica para tu familia?\nEscríbeme. Aquí estoy. 💙\n[Caja de preguntas]"),

    ("Vie 3 Abr","2026-04-03","C16 Semana Santa",
     "C16 Esta semana, permítete estar",
     "Mañana empieza Semana Santa. ¿Cómo se sienten?\n[Encuesta] Con ganas de descansar 🙌 · Ya con los niños encima 😅",
     "Un recordatorio para esta semana:\nno necesitas llenarla de actividades.\nSolo necesitas ESTAR.\n→ El carrusel de hoy.",
     "Me tomo un pequeño descanso del feed esta semana.\nPero las historias siguen 💙\n¿Qué quieres que hablemos cuando regrese?\n[Caja]"),

    ("Sáb 4 Abr","2026-04-04","Solo historias",
     "Sábado Santo",
     "Sábado Santo. ¿Ya están en modo vacaciones?\n[Encuesta] 🏖️ Sí · 🏠 Descansando en casa",
     "Semana Santa es perfecta para el juego libre.\nSin pantallas, sin agenda.\nObserva a tu hijo/a jugar solo/a. Es magia. 🌿",
     "Este fin de semana: desconéctalos de todo.\nY reconéctalos con ustedes. 💙"),

    ("Dom 5 Abr","2026-04-05","R4 Reel paradoja",
     "R4 La peor madre del mundo",
     "Feliz Domingo de Ramos 🌿\n¿Cómo van las vacaciones?\n[Encuesta] Genial 😍 · Es trabajo con otro nombre 😂",
     "El reel de hoy: el descanso que MÁS necesitan tus hijos\nno es el que crees. 👀\n→ Feed.",
     "Un niño que se sintió VISTO esta semana regresa al colegio más tranquilo.\n¿Lo lograron?\n[Caja] Cuéntame. 💙"),

    ("Lun 6 Abr","2026-04-06","C17 Salud",
     "C17 Día Mundial Salud emocional",
     "💚 HOY: Día Mundial de la Salud.\n¿Con qué frecuencia revisas la salud EMOCIONAL de tu hijo/a?\n[Encuesta] Seguido · Nunca · No sé cómo",
     "La salud emocional no aparece en un examen.\nPero se nota en cómo duerme, come y se relaciona.\n→ Post de hoy. ↗️",
     "HOY: Pregúntale a tu hijo/a: \"¿Cómo estás TÚ, de verdad?\"\nY escucha sin interrumpir.\nCuéntame qué te dijo. 🫂\n[Caja]"),

    ("Mar 7 Abr","2026-04-07","R5 Reel llanto",
     "R5 Cuando tu hijo llora",
     "¿Qué haces cuando tu hijo/a llora y no sabes qué hacer?\n[Encuesta] Me congelo 😶 · Intento hablarle · Quiero que pare ya",
     "El reel de hoy es un espejo.\nEs posible que te reconozcas. Eso está bien.\n→ Feed. ↗️",
     "Querer hacer mejor las cosas NO es fracasar.\nEs exactamente la señal de que eres el padre/madre\nque tu hijo/a necesita. 💙"),

    ("Mié 8 Abr","2026-04-08","C18 Límites",
     "C18 Poner límites no es hacer sufrir",
     "¿Te cuesta poner límites a tus hijos?\n[Encuesta] Mucho 😔 · A veces · Soy buena en eso 💪",
     "Un límite desde el amor NO daña el vínculo. Lo fortalece.\n→ El carrusel de hoy te explica cómo. 🌿",
     "Frase para el fin de semana:\n\"Primero conecta. Luego redirige. Siempre desde la calma.\"\n💙 Guarda esto.\n[Sticker guardar]"),

    ("Jue 9 Abr","2026-04-09","Jueves Santo",
     "Descanso del feed",
     "Jueves Santo. Hoy el feed descansa. ✨\nPero yo sigo aquí. ¿Cómo están?\n[Caja]",
     "Reflexión de hoy:\n¿qué cosa pequeña hiciste esta semana que se te olvidó celebrar?\nCuéntame.\n[Caja]",
     "Mañana regresamos.\nMientras tanto: ve, abraza a tu hijo/a.\nSin motivo. Solo porque sí. 💙"),

    ("Vie 10 Abr","2026-04-10","R6 Reel descanso",
     "R6 Viernes Santo — descanso real",
     "Viernes Santo. ¿Lograron desconectarse esta semana?\n[Encuesta] Sí, fue bonito 🌸 · Fue intensa la semana 😅",
     "El reel de hoy: una reflexión para cerrar Semana Santa.\nSobre el descanso real. → Feed. 🌿",
     "¿Qué momento de esta Semana Santa vas a recordar?\nCuéntame el más pequeño y más bonito. 💜\n[Caja]"),

    ("Sáb 11 Abr","2026-04-11","Solo historias",
     "Sin publicación en feed",
     "Sábado. ¿Cómo cerramos la semana?\n[Encuesta] Mejor de lo esperado 💪 · Más o menos · Fue dura 💙",
     "Recuerda: los $29 que inviertes en el curso\nson la inversión más directa que puedes hacer en tu familia. 🌿\n→ Link en bio.",
     "¿Cuál fue el momento de conexión más pequeño pero más bonito\nque tuviste con tu hijo/a esta semana?\nCuéntame. 💜\n[Caja]"),

    ("Dom 12 Abr","2026-04-12","R7 Reel Inside Out",
     "R7 Domingo Pascua — Inside Out",
     "🌸 Feliz Domingo de Pascua.\nHoy comparto algo en el feed que va desde el corazón.\nNo te lo pierdas.",
     "El reel de hoy: Inside Out, la película más honesta\nsobre emociones que jamás se ha hecho.\n→ Feed. 🎬",
     "¿Con qué personaje de Inside Out te identificas más como papá/mamá?\n[Caja] Te leo. 💙"),

    ("Lun 13 Abr","2026-04-13","R8 Reel confesiones",
     "R8 Soy psicóloga y...",
     "Lunes post-vacaciones. ¿Cómo amaneciste hoy?\n[Encuesta] Lista para empezar 💪 · Necesito otro día 😅",
     "\"Soy psicóloga y...\" — El reel de hoy.\nConfeiones que pocas veces se dicen en voz alta.\n→ Feed. 🎬",
     "Ahora tú: completa la frase.\n\"Soy mamá/papá y...\"\n→ Comenta en el post. Te leo. 💙"),

    ("Mar 14 Abr","2026-04-14","C19 Heridas infancia",
     "C19 La rabia que no tiene que ver con él/ella",
     "¿Alguna vez reaccionaste de forma exagerada a algo pequeño\ny luego no entendiste por qué?\n[Encuesta] Sí, me ha pasado · No creo",
     "Muchas veces la rabia que sentimos con nuestros hijos\nno viene del presente. Viene del pasado.\n→ Post de hoy. 🌱",
     "Sanar tu historia es el acto de crianza más poderoso que puedes hacer.\n💙 ¿Quieres acompañamiento?\n→ Link en bio."),

    ("Mié 15 Abr","2026-04-15","R9 Reel actividad",
     "R9 Actividad de 10 minutos",
     "¿Le dedicas 10 minutos de presencia TOTAL a tu hijo/a cada día?\n[Encuesta] Sí, a diario 🌟 · Intento · Casi nunca 😔",
     "El reel de hoy: una actividad de 10 minutos para esta noche.\nFácil. Gratis. Funciona.\n→ Feed. ↗️",
     "Hazla esta noche y cuéntame cómo les fue. 💙\nQuiero saber.\n[Caja de respuesta]"),

    ("Jue 16 Abr","2026-04-16","C20 Presencia",
     "C20 No necesitas más tiempo, necesitas mejor presencia",
     "¿Cuándo fue la última vez que estuviste 100% presente\ncon tu hijo/a, sin teléfono?\n[Encuesta] Hoy 🌟 · Hace días · No recuerdo 😔",
     "20 minutos de presencia real valen más que 3 horas\nen la misma habitación mirando el teléfono.\n→ Post de hoy. ↗️",
     "HOY: 15 minutos. Solo tú y él/ella.\nSin teléfono. Sin agenda.\n¿Lo intentas?\n[Encuesta] Sí, hoy lo hago · Voy a intentarlo 💙"),

    ("Vie 17 Abr","2026-04-17","✨ R10 Cierre",
     "R10 Lo que aprendí siendo psicóloga Y mamá",
     "Un mes. 💙\n¿Aprendiste algo nuevo sobre la crianza\no sobre ti mismo/a en estas semanas?\n[Caja] Cuéntame.",
     "Hoy cierra el primer mes de este espacio.\nEl reel de cierre ya está en el feed. 🌿\nNo te lo pierdas.",
     "Gracias por estar aquí.\nPor leer. Por querer criar mejor. 💙\n¿Ya tienes el curso?\n→ Link en bio: $29 · Acceso de por vida.\n[Sticker link]"),
]

# ─── paleta Ingrid ────────────────────────────────────────────────────────────
DARK   = "#3D2B24"
BEIGE  = "#F8F2EC"
LAVAN  = "#D9C9E3"
MARRN  = "#806357"
GRIS   = "#B0AEB0"

# emojis de fondo por tipo
BG_H1 = ["🌅","☀️","🌸","🌿","💙","✨","🌱"]
BG_H2 = ["🧠","💡","📖","🌟","🔑","💫","🌍"]
BG_H3 = ["💜","🎁","💙","🌙","🔗","🫂","🌿"]

def nl2br(txt):
    return txt.replace("\n","<br>")

def slide_h1(fecha, feed_label, content, idx):
    bg_emoji = BG_H1[idx % len(BG_H1)]
    lines = content.split("\n")
    main = nl2br("\n".join(lines[:2]))
    rest = nl2br("\n".join(lines[2:])) if len(lines)>2 else ""
    return f"""
<div class="slide h1-slide" data-fecha="{fecha}">
  <div class="h1-bg-emoji">{bg_emoji}</div>
  <div class="h1-inner">
    <div class="slot-badge h1-badge">H1 · 8–9am · Buenos días</div>
    <div class="h1-fecha">{fecha}</div>
    <div class="h1-feed-label">{feed_label}</div>
    <div class="h1-main">{main}</div>
    {"<div class='h1-rest'>"+rest+"</div>" if rest else ""}
    <div class="h1-footer">
      <span class="handle">@ingridnunezpsi</span>
    </div>
  </div>
</div>"""

def slide_h2(fecha, feed_label, content, idx):
    bg_emoji = BG_H2[idx % len(BG_H2)]
    return f"""
<div class="slide h2-slide" data-fecha="{fecha}">
  <div class="h2-top">
    <div class="h2-bg-emoji">{bg_emoji}</div>
    <div class="slot-badge h2-badge">H2 · 12–1pm · Dato + Recordatorio</div>
    <div class="h2-fecha">{fecha}</div>
    <div class="h2-feed">{feed_label}</div>
  </div>
  <div class="h2-bottom">
    <div class="h2-content">{nl2br(content)}</div>
    <div class="h2-footer"><span class="handle">@ingridnunezpsi</span></div>
  </div>
</div>"""

def slide_h3(fecha, feed_label, content, idx):
    bg_emoji = BG_H3[idx % len(BG_H3)]
    return f"""
<div class="slide h3-slide" data-fecha="{fecha}">
  <div class="h3-bg-emoji">{bg_emoji}</div>
  <div class="h3-inner">
    <div class="slot-badge h3-badge">H3 · 6–8pm · CTA + Comunidad</div>
    <div class="h3-fecha">{fecha}</div>
    <div class="h3-feed">{feed_label}</div>
    <div class="h3-content">{nl2br(content)}</div>
    <div class="h3-footer">
      <span class="handle">@ingridnunezpsi</span>
      <span class="h3-web">psicolaingridnunez.lovable.app</span>
    </div>
  </div>
</div>"""

css = f"""
* {{ margin:0; padding:0; box-sizing:border-box; }}
body {{
  background:#1a1a2e;
  font-family:'Montserrat',sans-serif;
}}
.slide {{
  width:1080px; height:1920px;
  position:relative;
  overflow:hidden;
  display:block;
}}

/* ── H1: Morning — beige cálido ── */
.h1-slide {{ background:{BEIGE}; }}
.h1-bg-emoji {{
  position:absolute; font-size:420px;
  top:-60px; right:-80px;
  opacity:.06; line-height:1;
  pointer-events:none; user-select:none;
}}
.h1-inner {{
  position:relative; z-index:2;
  padding:120px 90px;
  height:100%; display:flex; flex-direction:column; justify-content:space-between;
}}
.slot-badge {{
  display:inline-block;
  padding:10px 28px;
  border-radius:100px;
  font-size:20px; font-weight:600;
  letter-spacing:2px; text-transform:uppercase;
  margin-bottom:32px;
}}
.h1-badge {{ background:{LAVAN}; color:{DARK}; }}
.h1-fecha {{
  font-family:'Playfair Display',serif;
  font-size:38px; color:{MARRN};
  letter-spacing:1px; margin-bottom:8px;
}}
.h1-feed-label {{
  font-size:22px; font-weight:500;
  color:{GRIS}; letter-spacing:3px;
  text-transform:uppercase; margin-bottom:60px;
  border-left:4px solid {LAVAN}; padding-left:20px;
}}
.h1-main {{
  font-family:'Playfair Display',serif;
  font-size:68px; line-height:1.15;
  color:{DARK}; margin-bottom:40px;
  font-style:italic;
}}
.h1-rest {{
  font-size:32px; font-weight:300;
  color:{MARRN}; line-height:1.7;
}}
.h1-footer {{ display:flex; justify-content:flex-start; }}

/* ── H2: Midday — split dark/beige ── */
.h2-slide {{ background:{BEIGE}; }}
.h2-top {{
  height:780px; position:relative;
  background:{DARK};
  display:flex; flex-direction:column;
  justify-content:flex-end; padding:70px 90px 60px;
}}
.h2-bg-emoji {{
  position:absolute; font-size:380px;
  top:40px; right:40px; opacity:.08;
  pointer-events:none; user-select:none;
}}
.h2-badge {{ background:{LAVAN}; color:{DARK}; margin-bottom:28px; }}
.h2-fecha {{
  font-family:'Playfair Display',serif;
  font-size:52px; color:{BEIGE}; line-height:1.1;
}}
.h2-feed {{
  font-size:22px; font-weight:300;
  color:rgba(217,201,227,.6);
  letter-spacing:1px; margin-top:12px;
}}
.h2-bottom {{
  padding:70px 90px 80px;
  display:flex; flex-direction:column; justify-content:space-between;
  flex:1;
}}
.h2-content {{
  font-family:'Playfair Display',serif;
  font-size:54px; line-height:1.4;
  color:{DARK}; flex:1; display:flex; align-items:center;
}}
.h2-footer {{ display:flex; justify-content:flex-start; }}

/* ── H3: Evening — dark + lavanda ── */
.h3-slide {{
  background: linear-gradient(135deg,{DARK} 0%,#4a3028 50%,#2d1f1a 100%);
}}
.h3-bg-emoji {{
  position:absolute; font-size:480px;
  bottom:-80px; left:-80px; opacity:.07;
  pointer-events:none; user-select:none;
}}
.h3-inner {{
  position:relative; z-index:2;
  padding:120px 90px;
  height:100%; display:flex; flex-direction:column; justify-content:space-between;
}}
.h3-badge {{ background:rgba(217,201,227,.25); color:{LAVAN}; border:1px solid rgba(217,201,227,.3); }}
.h3-fecha {{
  font-family:'Playfair Display',serif;
  font-size:38px; color:{LAVAN};
  opacity:.7; margin-bottom:8px;
}}
.h3-feed {{
  font-size:22px; font-weight:300;
  color:rgba(217,201,227,.4);
  letter-spacing:2px; margin-bottom:60px;
}}
.h3-content {{
  font-family:'Playfair Display',serif;
  font-size:62px; line-height:1.3;
  color:{BEIGE}; flex:1; display:flex; align-items:center;
  font-style:italic;
}}
.h3-footer {{
  display:flex; justify-content:space-between; align-items:center;
}}
.h3-web {{
  font-size:20px; color:rgba(217,201,227,.3);
  letter-spacing:1px;
}}

/* común */
.handle {{
  font-family:'Montserrat',sans-serif;
  font-size:22px; letter-spacing:3px;
  color:{GRIS}; text-transform:lowercase;
}}
"""

slides_html = ""
for i, row in enumerate(STORIES):
    fecha_corta, fecha_iso, tipo_dia, feed_label, h1, h2, h3 = row
    slides_html += slide_h1(fecha_corta, feed_label, h1, i)
    slides_html += slide_h2(fecha_corta, feed_label, h2, i)
    slides_html += slide_h3(fecha_corta, feed_label, h3, i)

html = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Historias — Ingrid Núñez · Mar–Abr 2026</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
{css}
</style>
</head>
<body>
{slides_html}
</body>
</html>
"""

OUTPUT.write_text(html, encoding="utf-8")
print(f"✓ Generado: {OUTPUT}")
print(f"  {len(STORIES) * 3} slides totales ({len(STORIES)} días × 3 historias)")
