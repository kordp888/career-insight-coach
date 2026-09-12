export const dynamic = "force-dynamic";
export function GET() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  return Response.json({commit:sha && /^[a-f0-9]{40}$/i.test(sha) ? sha.slice(0,12) : "unknown",environment:process.env.VERCEL_ENV ?? "unknown"},{headers:{"Cache-Control":"no-store"}});
}
