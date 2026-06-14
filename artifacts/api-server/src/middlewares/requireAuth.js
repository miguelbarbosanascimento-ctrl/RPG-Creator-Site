import { getAuth } from "@clerk/express";
export function requireAuth(req, res, next) {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (!userId) {
    res.status(401).json({
      error: "Não autenticado"
    });
    return;
  }
  req.userId = userId;
  next();
}
