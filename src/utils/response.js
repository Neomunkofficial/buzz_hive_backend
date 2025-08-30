// src/utils/response.js
export const ok = (res, data = {}, message = "OK") =>
  res.status(200).json({ success: true, message, data });

export const created = (res, data = {}, message = "Created") =>
  res.status(201).json({ success: true, message, data });

export const badRequest = (res, message = "Bad request") =>
  res.status(400).json({ success: false, message });

export const unauthorized = (res, message = "Unauthorized") =>
  res.status(401).json({ success: false, message });

export const serverError = (res, message = "Server error") =>
  res.status(500).json({ success: false, message });
