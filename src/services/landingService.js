const db = require('../data/db')
const templateService = require('./templateService')
const { normalizeStatus } = require('../constants/landingStatus')

function getAllLandings() {
  return db.landings.map(landing => ({
    ...landing,
    leadCount: 0
  }))
}

function getLandingById(id) {
  const landing = db.landings.find(l => l.id === Number(id))
  if (!landing) {
    const err = new Error(`Landing not found: ${id}`)
    err.statusCode = 404
    throw err
  }
  return landing
}

function createLanding(data) {
  const template = templateService.getTemplateById(data.templateId)

  const landing = {
    id: db.nextLandingId++,
    templateId: template.id,
    name: data.name,
    client: data.client,
    status: 'borrador',
    fields: data.fields || {},
    createdAt: new Date().toISOString()
  }

  db.landings.push(landing)
  return landing
}

function getLandingPreview(id) {
  const landing = getLandingById(id)
  const template = templateService.getTemplateById(landing.templateId)

  let html = template.html

  Object.keys(landing.fields).forEach(key => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
    html = html.replace(regex, landing.fields[key] || '')
  })

  html = html.replace(/\{\{clientName\}\}/g, landing.client || '')

  return html
}

function getLeadsByLanding(landingId) {
  getLandingById(landingId)
  return db.leads.filter(l => l.landingId === Number(landingId))
}

const MAX_FIELD_LENGTH = 255;

function validateLeadData(data) {
  const name = data.name?.trim();
  const email = data.email?.trim();
  const phone = data.phone?.trim();

  if (!name || !email) {
    const err = new Error('Name and email are required');
    err.statusCode = 400;
    throw err;
  }

  if (name.length > MAX_FIELD_LENGTH) {
    const err = new Error('Name cannot exceed 255 characters');
    err.statusCode = 400;
    throw err;
  }

  if (email.length > MAX_FIELD_LENGTH) {
    const err = new Error('Email cannot exceed 255 characters');
    err.statusCode = 400;
    throw err;
  }

  if (phone && phone.length > MAX_FIELD_LENGTH) {
    const err = new Error('Phone cannot exceed 255 characters');
    err.statusCode = 400;
    throw err;
  }

  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s]+$/.test(name)) {
    const err = new Error('Name cannot contain symbols');
    err.statusCode = 400;
    throw err;
  }

  if (phone && !/^\d+$/.test(phone)) {
    const err = new Error('Phone can only contain numbers');
    err.statusCode = 400;
    throw err;
  }

  return {
    name,
    email,
    phone: phone || null,
  };
}

function createLead(landingId, data) {
  getLandingById(landingId);

  const validatedLead = validateLeadData(data);

  const lead = {
    id: db.nextLeadId++,
    landingId: Number(landingId),
    name: validatedLead.name,
    email: validatedLead.email,
    phone: validatedLead.phone,
    message: data.message || null,
    createdAt: new Date().toISOString()
  };

  db.leads.push(lead);
  return lead;
}

function updateLandingStatus(id, status) {
  const landing = getLandingById(id)

  const normalizedStatus = normalizeStatus(status)

  if (!normalizedStatus) {
    const err = new Error(`Invalid status: ${status}`)
    err.statusCode = 400
    throw err
  }

  landing.status = normalizedStatus

  return landing
}



module.exports = { getAllLandings, getLandingById, createLanding, getLandingPreview, getLeadsByLanding, createLead, updateLandingStatus }
