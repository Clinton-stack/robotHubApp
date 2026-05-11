import { useNavigate } from 'react-router-dom'
import { LogoMark } from '../components/LogoMark'
import { LoginSlideshow } from '../components/LoginSlideshow'
import { loginSlides } from '../data/loginSlides'
import { inputClassName, primaryButtonClassName } from '../styles/ui'
import { useCurrentUser } from '../users/UserProvider'

export function LoginPage() {
  const navigate = useNavigate()
  const { currentUser, setCurrentUserId, users } = useCurrentUser()

  return (
    <main className="grid min-h-svh bg-white text-slate-950 lg:grid-cols-2">
      <section className="flex min-h-svh items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-4">
            <LogoMark />
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">
                Photon Laser Manufacturing Company
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-normal text-slate-950">Photon Robot Hub</h1>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-2xl shadow-slate-200/80 sm:p-8">
            <div className="mb-8">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                Operator login
              </p>
              <h2 className="text-2xl font-extrabold tracking-normal text-slate-950">
                Sign in to continue
              </h2>
            </div>

            <form className="grid gap-5">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Demo user
                <select
                  className={inputClassName}
                  value={currentUser.id}
                  onChange={(event) => setCurrentUserId(event.target.value)}
                >
                  {users.map((user) => (
                    <option value={user.id} key={user.id}>
                      {user.name} / {user.role}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Username
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  value={currentUser.name}
                  readOnly
                  className={inputClassName}
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Password
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Demo mode - any password"
                  className={inputClassName}
                />
              </label>

              <button type="button" className={`mt-3 ${primaryButtonClassName}`} onClick={() => navigate('/robots')}>
                Login
              </button>
            </form>

            <p className="mt-8 text-sm leading-6 text-slate-500">
              Access is restricted to authorized operators, supervisors, and administrators.
            </p>
          </div>
        </div>
      </section>

      <LoginSlideshow slides={loginSlides} />
    </main>
  )
}
