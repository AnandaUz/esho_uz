import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import Guest from '../models/Guest.js';

// 1. Ограничиваем создание сессий: 10 штук в час с одного IP
export const idCreateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 10,
  message: "Too many sessions created from this IP",
  standardHeaders: true,
  legacyHeaders: false,
});

export const idCreate = async (req:Request, res:Response) => {
  const origin = req.headers.origin;
  const allowedOrigin = process.env.CLIENT_URL;

  // 2. Проверка Origin
  if (process.env.NODE_ENV === 'production' && origin !== allowedOrigin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const newGuest = new Guest({      
    });

    const savedGuest = await newGuest.save();
    res.status(201).json({ _id: savedGuest._id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};