import { Head, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import InputError from '@/components/input-error'
import AuthLayout from '@/layouts/auth-layout'

export default function Login() {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  })
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/login', {
      onSuccess: () => reset('password'),
    })
  }

  return (
    <AuthLayout title="Log in" description="Enter your details to log in">
      <Head title="Log in" />

      <form onSubmit={submit} className="flex flex-col gap-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              required
              autoFocus
              tabIndex={1}
              autoComplete="email"
              placeholder="email@example.com"
            />
            <InputError message={errors.email} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              required
              tabIndex={2}
              autoComplete="current-password"
              placeholder="Password"
            />
            <InputError message={errors.password} />
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="remember"
              name="remember"
              checked={data.remember}
              onCheckedChange={(checked) =>
                setData('remember', Boolean(checked))
              }
              tabIndex={3}
            />
            <Label htmlFor="remember">Remember me</Label>
          </div>

          <Button
            type="submit"
            className="mt-4 w-full"
            tabIndex={4}
            disabled={processing}
            data-test="login-button"
          >
            {processing && <Spinner />}
            Log in
          </Button>
        </div>
      </form>
      </AuthLayout>
  )
}
