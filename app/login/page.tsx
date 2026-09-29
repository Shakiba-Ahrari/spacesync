"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginSchema, type LoginValues } from "@/schemas";
import { login } from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    try {
      const { user, token } = await login(values);
      setAuth(user, token);
      toast.success(`خوش آمدید، ${user.fullName}`);
      router.push(user.role === "admin" ? "/admin" : "/spaces");
    } catch {
      toast.error("شماره موبایل یا رمز عبور درست نیست");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">ورود به SpaceSync</h1>
      <p className="mt-2 text-muted-foreground">
        برای رزرو جا و ورود به صف، وارد حساب خود شوید.
      </p>

      <Card className="mt-8 rule-top">
        <CardContent className="pt-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="phone">شماره موبایل</Label>
              <Input
                id="phone"
                dir="ltr"
                placeholder="09123456789"
                className="mt-2 text-start"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                className="mt-2"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal hover:bg-teal-dark"
            >
              {isSubmitting ? "در حال ورود…" : "ورود"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            حساب ندارید؟{" "}
            <Link href="/register" className="font-medium text-teal-dark">
              ثبت‌نام کنید
            </Link>
          </p>
        </CardContent>
      </Card>

      <p className="mt-5 rounded-lg bg-secondary p-4 text-xs leading-6 text-muted-foreground">
        حالت نمایشی: هر شماره و رمز ۶ کاراکتری کار می‌کند. برای دیدن پنل مدیریت، شماره‌ای
        که با ۰۹۱۱ شروع شود وارد کنید.
      </p>
    </div>
  );
}