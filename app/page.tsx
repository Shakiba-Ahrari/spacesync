import Link from "next/link";
import { QrCode, Timer, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LiveCapacityPreview from "@/app/components/home/LiveCapacityPreview";

const PROBLEMS = [
  {
    icon: Users,
    title: "رفتن حضوری",
    body: "دانشجو مجبور بود فیزیکی تا سالن برود فقط برای اینکه ببیند جای خالی هست یا نه.",
    rule: "rule-top-bad",
  },
  {
    icon: Timer,
    title: "اتلاف وقت",
    body: "رفت‌وآمد بی‌نتیجه در سرما و گرما، وقتی که می‌شد صرف مطالعه شود.",
    rule: "rule-top-warn",
  },
  {
    icon: QrCode,
    title: "اختلال تمرکز",
    body: "ورود مکرر افراد برای چک‌کردن وضعیت جا، تمرکز کسانی را که مشغول بودند به هم می‌زد.",
    rule: "rule-top-warn",
  },
];

const STEPS = [
  "روی هر صندلی و میز یک QR نصب می‌شود.",
  "کاربر هنگام نشستن، QR را اسکن می‌کند.",
  "سیستم آن صندلی را اشغال‌شده نشان می‌دهد.",
  "بعد از بلند شدن یا پایان تایمر، صندلی آزاد می‌شود.",
];

export default function HomePage() {
  return (
    <>
      {/* ------------------------ Hero ------------------------ */}
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.1fr_1fr] md:items-center md:py-24">
          <div>
            <h1 className="text-4xl font-extrabold leading-[1.15] md:text-5xl">
              قبل از راه‌افتادن،
              <br />
              ببینید جا هست یا نه.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-white/75">
              SpaceSync ظرفیت لحظه‌ای کتابخانه‌ها، سالن‌های مطالعه و سالن‌های ورزشی را
              نشان می‌دهد. جای خود را آنلاین رزرو کنید و با اسکن QR وارد شوید.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-teal hover:bg-teal-dark">
                <Link href="/spaces">دیدن سالن‌ها</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/register">ساخت حساب</Link>
              </Button>
            </div>
          </div>

          {/* نمایش زنده‌ی ظرفیت — شاخص‌ترین چیز محصول */}
          <LiveCapacityPreview />
        </div>
      </section>

      {/* ------------------------ مسئله ------------------------ */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold">چه مشکلی را حل می‌کنیم</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <Card key={p.title} className={p.rule}>
              <CardContent className="pt-1">
                <p.icon className="size-6 text-ink-soft" />
                <h3 className="mt-4 text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{p.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 rounded-xl bg-teal px-6 py-5 text-center font-semibold text-white">
          راه‌حل: رزرو هوشمند از طریق وب‌اپلیکیشن + نمایش آنلاین ظرفیت لحظه‌ای
        </div>
      </section>

      {/* ------------------------ روش کار ------------------------ */}
      <section className="border-y border-border bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">تکنولوژی انتخابی: QR Code</h2>
            <ol className="mt-6 space-y-4">
              {STEPS.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-teal-wash text-sm font-bold text-teal-dark">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-7">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 font-semibold text-teal-dark">
              هزینه پایین، نصب آسان، بدون نیاز به دوربین یا سنسور.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">مسیر کاربر در سایت</h2>
            <ol className="mt-6 space-y-2">
              {[
                "ورود به سایت",
                "انتخاب سالن مطالعه یا ورزشی",
                "مشاهده ظرفیت لحظه‌ای",
                "رزرو صندلی یا زمین",
                "اگر پر بود: قرار گرفتن در صف هوشمند",
              ].map((s, i) => (
                <li
                  key={s}
                  className="rounded-lg bg-paper px-4 py-3 text-sm"
                  style={{ opacity: 1 - i * 0.06 }}
                >
                  {i + 1}. {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ------------------------ CTA ------------------------ */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">سالن خود را به SpaceSync وصل کنید</h2>
        <p className="mx-auto mt-3 max-w-md leading-7 text-muted-foreground">
          مدیر سالن هستید؟ با یک داشبورد ساده ظرفیت، صف و ساعات پیک سالن‌تان را ببینید.
        </p>
        <Button asChild size="lg" className="mt-6 bg-teal hover:bg-teal-dark">
          <Link href="/admin">ورود مدیران</Link>
        </Button>
      </section>
    </>
  );
}