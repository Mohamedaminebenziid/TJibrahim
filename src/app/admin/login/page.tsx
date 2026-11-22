import { login } from "./actions";

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const sp = await searchParams;
  const error = typeof sp?.error === "string" ? sp.error : undefined;
  const next = typeof sp?.next === "string" ? sp.next : "/admin";
  const configured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-black text-white">
      <div className="w-full max-w-sm">
        <div className="font-display text-4xl tracking-tight mb-2">Admin</div>
        <p className="text-sm text-white/60 mb-10">Sign in to manage the portfolio.</p>
        {!configured && (
          <div className="mb-6 border hairline p-4 text-xs text-white/70">
            Supabase is not configured yet. Set <code className="text-white">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="text-white">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your environment, then restart.
          </div>
        )}
        <form action={login} className="space-y-5">
          <input type="hidden" name="next" value={next} />
          <div>
            <label className="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Email</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full bg-transparent border-b hairline focus:border-white outline-none py-2 text-base"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Password</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-transparent border-b hairline focus:border-white outline-none py-2 text-base"
            />
          </div>
          {error && <div className="text-xs text-red-400">{error}</div>}
          <button
            type="submit"
            className="w-full mt-4 border hairline py-3 text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
