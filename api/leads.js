const MAX_LENGTH = {
  nombre: 120,
  empresa: 160,
  correo: 160,
  telefono: 40,
  tipo: 120,
  mensaje: 3000,
  source: 40,
  pageUrl: 500,
  userAgent: 500
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+\s()\-]{7,25}$/;

const json = (res, status, payload) => {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

const sanitizeText = (value, maxLength) => {
  const text = (value || "").toString().replace(/\u0000/g, "").trim();
  if (!maxLength) return text;
  return text.slice(0, maxLength);
};

const normalizeLeadPayload = (body) => {
  return {
    nombre: sanitizeText(body.nombre, MAX_LENGTH.nombre),
    empresa: sanitizeText(body.empresa, MAX_LENGTH.empresa),
    correo: sanitizeText(body.correo, MAX_LENGTH.correo).toLowerCase(),
    telefono: sanitizeText(body.telefono, MAX_LENGTH.telefono),
    tipo: sanitizeText(body.tipo, MAX_LENGTH.tipo),
    mensaje: sanitizeText(body.mensaje, MAX_LENGTH.mensaje),
    source: sanitizeText(body.source || "web_form", MAX_LENGTH.source),
    website: sanitizeText(body.website, 120),
    pageUrl: sanitizeText(body.pageUrl, MAX_LENGTH.pageUrl),
    userAgent: sanitizeText(body.userAgent, MAX_LENGTH.userAgent)
  };
};

const getIpAddress = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim().slice(0, 80);
  }
  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp.length > 0) {
    return realIp.trim().slice(0, 80);
  }
  return "";
};

const validateLead = (lead) => {
  if (!lead.nombre || !lead.correo || !lead.telefono || !lead.tipo || !lead.mensaje) {
    return "Faltan campos obligatorios.";
  }

  if (!EMAIL_PATTERN.test(lead.correo)) {
    return "El correo electronico no es valido.";
  }

  if (!PHONE_PATTERN.test(lead.telefono)) {
    return "El telefono no es valido.";
  }

  if (lead.mensaje.length < 8) {
    return "El mensaje debe tener al menos 8 caracteres.";
  }

  return "";
};

const sendLeadNotification = async (lead) => {
  const resendApiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.LEADS_NOTIFY_EMAIL;
  if (!resendApiKey || !notifyEmail) return;

  const fromEmail = process.env.RESEND_FROM_EMAIL || "NexgenFlows <onboarding@resend.dev>";
  const subject = `Nuevo lead web: ${lead.tipo} - ${lead.nombre}`;

  const text = [
    "Nuevo contacto desde nexgenflows.cl",
    "",
    `Nombre: ${lead.nombre}`,
    `Empresa: ${lead.empresa || "No informa"}`,
    `Correo: ${lead.correo}`,
    `Telefono: ${lead.telefono}`,
    `Tipo: ${lead.tipo}`,
    `Canal: ${lead.source}`,
    "",
    "Mensaje:",
    lead.mensaje,
    "",
    `URL: ${lead.page_url || "No informada"}`
  ].join("\n");

  try {
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [notifyEmail],
        subject,
        text
      })
    });

    if (!emailResponse.ok) {
      const details = await emailResponse.text();
      console.error("No se pudo enviar notificacion Resend:", details);
    }
  } catch (error) {
    console.error("Error enviando notificacion Resend:", error);
  }
};

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    res.status(204).setHeader("Allow", "POST, OPTIONS");
    return res.end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return json(res, 405, { ok: false, message: "Metodo no permitido." });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return json(res, 500, {
      ok: false,
      message: "El servidor no esta configurado para guardar contactos."
    });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (_error) {
      return json(res, 400, { ok: false, message: "JSON invalido." });
    }
  }

  if (!body || typeof body !== "object") {
    return json(res, 400, { ok: false, message: "Solicitud invalida." });
  }

  const lead = normalizeLeadPayload(body);

  // Honeypot field: si viene lleno, aceptamos sin guardar para frenar bots.
  if (lead.website) {
    return json(res, 202, { ok: true });
  }

  const validationError = validateLead(lead);
  if (validationError) {
    return json(res, 400, { ok: false, message: validationError });
  }

  const ipAddress = getIpAddress(req);
  const leadRecord = {
    nombre: lead.nombre,
    empresa: lead.empresa || null,
    correo: lead.correo,
    telefono: lead.telefono,
    tipo: lead.tipo,
    mensaje: lead.mensaje,
    source: lead.source || "web_form",
    page_url: lead.pageUrl || null,
    user_agent: lead.userAgent || req.headers["user-agent"] || null,
    ip_address: ipAddress || null
  };

  const endpoint = `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/leads`;

  try {
    const dbResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify([leadRecord])
    });

    if (!dbResponse.ok) {
      const details = await dbResponse.text();
      console.error("Error guardando lead en Supabase:", details);
      return json(res, 502, {
        ok: false,
        message: "No se pudo guardar la solicitud. Intenta nuevamente."
      });
    }

    const inserted = await dbResponse.json();
    const insertedLead = Array.isArray(inserted) ? inserted[0] : null;

    await sendLeadNotification(leadRecord);

    return json(res, 201, {
      ok: true,
      id: insertedLead && insertedLead.id ? insertedLead.id : null
    });
  } catch (error) {
    console.error("Error en /api/leads:", error);
    return json(res, 500, {
      ok: false,
      message: "Error interno. Intenta nuevamente en unos minutos."
    });
  }
};
