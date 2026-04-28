export { auth as proxy } from "@/auth";

export const config = {
  matcher: [
    "/home/:path*",
    "/eventos/:path*",
    "/fale-conosco/:path*",
    "/agendar-visita/:path*",
    "/admin/:path*",
  ],
};
