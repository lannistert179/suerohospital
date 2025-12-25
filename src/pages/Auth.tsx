import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRateLimiter } from '@/hooks/useRateLimiter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Loader2, Shield, AlertTriangle, Lock } from 'lucide-react';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Rate limiter: 5 attempts per minute, 5 minute lockout
  const rateLimiter = useRateLimiter({
    maxAttempts: 5,
    windowMs: 60 * 1000,
    lockoutMs: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!loading && user) {
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }
    
    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limit before attempting
    if (!rateLimiter.checkRateLimit()) {
      toast({
        variant: 'destructive',
        title: 'Too many attempts',
        description: `Please wait ${rateLimiter.formatRemainingTime(rateLimiter.remainingTime)} before trying again.`,
      });
      return;
    }
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      setIsLoading(false);
      rateLimiter.recordAttempt(false);
      
      const remainingAttempts = rateLimiter.getRemainingAttempts() - 1;
      const attemptsWarning = remainingAttempts > 0 && remainingAttempts <= 2
        ? ` ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.`
        : '';
      
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: (error.message === 'Invalid login credentials' 
          ? 'Invalid email or password. Please try again.'
          : error.message) + attemptsWarning,
      });
    } else {
      rateLimiter.recordAttempt(true);
      toast({
        title: 'Welcome back!',
        description: 'You have been signed in successfully.',
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limit before attempting
    if (!rateLimiter.checkRateLimit()) {
      toast({
        variant: 'destructive',
        title: 'Too many attempts',
        description: `Please wait ${rateLimiter.formatRemainingTime(rateLimiter.remainingTime)} before trying again.`,
      });
      return;
    }
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      setIsLoading(false);
      rateLimiter.recordAttempt(false);
      
      let message = error.message;
      if (error.message.includes('already registered')) {
        message = 'This email is already registered. Please sign in instead.';
      }
      toast({
        variant: 'destructive',
        title: 'Sign up failed',
        description: message,
      });
    } else {
      rateLimiter.recordAttempt(true);
      toast({
        title: 'Account created!',
        description: 'You have been signed up successfully.',
      });
    }
  };

  const isFormDisabled = isLoading || rateLimiter.isLocked;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">Admin Portal</CardTitle>
          <CardDescription>
            Sign in to access the administration panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rateLimiter.isLocked && (
            <Alert variant="destructive" className="mb-4">
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Too many failed attempts. Please wait{' '}
                <span className="font-semibold">
                  {rateLimiter.formatRemainingTime(rateLimiter.remainingTime)}
                </span>{' '}
                before trying again.
              </AlertDescription>
            </Alert>
          )}
          
          {!rateLimiter.isLocked && rateLimiter.attempts > 0 && rateLimiter.attempts < rateLimiter.maxAttempts && (
            <Alert className="mb-4 border-amber-500/50 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                {rateLimiter.getRemainingAttempts()} attempt{rateLimiter.getRemainingAttempts() === 1 ? '' : 's'} remaining before temporary lockout.
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin" disabled={isFormDisabled}>Sign In</TabsTrigger>
              <TabsTrigger value="signup" disabled={isFormDisabled}>Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="admin@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isFormDisabled}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isFormDisabled}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isFormDisabled}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {rateLimiter.isLocked ? 'Temporarily Locked' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Dr. John Smith"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isFormDisabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="admin@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isFormDisabled}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isFormDisabled}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isFormDisabled}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {rateLimiter.isLocked ? 'Temporarily Locked' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
