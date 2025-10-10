import React, { createContext, useContext, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';

// Mock users for authentication
const mockUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'admin@company.com',
    role: 'admin',
    permissions: ['manage_users', 'manage_tasks', 'manage_clients', 'view_billing', 'manage_billing', 'view_reports']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'manager@company.com',
    role: 'manager',
    permissions: ['manage_tasks', 'manage_clients', 'view_billing', 'view_reports']
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'employee@company.com',
    role: 'employee',
    permissions: ['view_reports']
  }
];

// Create Auth Context
const AuthContext = createContext<{
  user: any;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{} | null>({});


  const login = (email: string, password: string) => {
    // Simple mock authentication
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission: string) => {
    return user?.permissions?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Forgot Password Component
function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock validation - check if email exists
    const userExists = mockUsers.some(u => u.email === email);
    if (!userExists) {
      setError('No account found with this email address');
      return;
    }

    // Simulate sending reset email
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
            <CardDescription className="text-center">
              We've sent password reset instructions to
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-md">
                <Mail className="h-4 w-4" />
                <span className="font-medium">{email}</span>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                Click the link in the email to reset your password. The link will expire in 24 hours.
              </AlertDescription>
            </Alert>

            <div className="text-sm text-muted-foreground text-center space-y-2">
              <p>Didn't receive the email? Check your spam folder.</p>
            </div>

            <Button
              variant="outline"
              onClick={onBack}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </form>

          <Button
            variant="ghost"
            onClick={onBack}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>

          <div className="text-xs text-muted-foreground text-center">
            <p>For demo purposes, use one of these emails:</p>
            <div className="mt-2 space-y-1">
              <div>• admin@company.com</div>
              <div>• manager@company.com</div>
              <div>• employee@company.com</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Reset Password Component (for when user clicks email link)
function ResetPasswordForm({ onBack }: { onBack: () => void }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isReset, setIsReset] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Simulate password reset
    setIsReset(true);
  };

  if (isReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Password Reset Successful</CardTitle>
            <CardDescription className="text-center">
              Your password has been successfully reset
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                You can now sign in with your new password.
              </AlertDescription>
            </Alert>

            <Button onClick={onBack} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Set New Password</CardTitle>
          <CardDescription className="text-center">
            Please enter your new password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="text-xs text-muted-foreground">
              Password must be at least 6 characters long
            </div>

            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </form>

          <Button
            variant="ghost"
            onClick={onBack}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDemo, setSelectedDemo] = useState('admin@company.com');
  const [error, setError] = useState('');
  const [view, setView] = useState<'login' | 'forgot' | 'reset'>('login');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(email, password);
    if (!success) {
      setError('Invalid email or password');
    }
  };

  const handleDemoLogin = () => {
    setEmail(selectedDemo);
    setPassword('password');
    login(selectedDemo, 'password');
  };

  const handleBackToLogin = () => {
    setView('login');
    setError('');
  };

  if (view === 'forgot') {
    return <ForgotPasswordForm onBack={handleBackToLogin} />;
  }

  if (view === 'reset') {
    return <ResetPasswordForm onBack={handleBackToLogin} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">BPM Dashboard</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => setView('forgot')}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or try demo accounts
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Select value={selectedDemo} onValueChange={setSelectedDemo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin@company.com">Admin Account</SelectItem>
                <SelectItem value="manager@company.com">Manager Account</SelectItem>
                <SelectItem value="employee@company.com">Employee Account</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleDemoLogin} className="w-full">
              Login as Demo User
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <div>Demo credentials:</div>
            <div>• Admin: admin@company.com / password</div>
            <div>• Manager: manager@company.com / password</div>
            <div>• Employee: employee@company.com / password</div>
          </div>

          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={() => setView('reset')}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Simulate password reset flow
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
