"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { registerSchema, type RegisterValues } from "@/schemas";
import { register as registerApi } from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterValues) {
    try {
      const { user, token } = await registerApi(values);
      setAuth(user, token);
      toast.success("حساب شما ساخته شد");
      router.push("/spaces");
    } catch {
      toast.error("ساخت حساب ناموفق بود. دوباره تلاش کنید.");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">ساخت حساب</h1>
      <p className="mt-2 text-muted-foreground">
        یک بار ثبت‌نام کنید و در همه‌ی سالن‌ها جا رزرو کنید.
      </p>

      <Card className="mt-8 rule-top">
        <CardContent className="pt-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="fullName">نام و نام خانوادگی</Label>
              <Input id="fullName" className="mt-2" {...register("fullName")} />
              {errors.fullName && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.fullName.message}
                </p>
              )}
            </div>

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

            <div>
              <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
              <Input
                id="confirmPassword"
                type="password"
                className="mt-2"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal hover:bg-teal-dark"
            >
              {isSubmitting ? "در حال ساخت حساب…" : "ساخت حساب"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link href="/login" className="font-medium text-teal-dark">
              وارد شوید
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}