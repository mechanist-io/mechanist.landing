import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 md:px-8">
        <div>
          <div className="text-white">
            <Logo />
          </div>
          <p className="mt-3 max-w-xs text-sm text-gray-400">
            دستیار هوشمند سرویس خودرو
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">لینک‌ها</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link to="/" className="hover:text-white">
                صفحه اصلی
              </Link>
            </li>
            <li>
              <Link to="/download" className="hover:text-white">
                دانلود اپلیکیشن
              </Link>
            </li>
            <li>
              <a href="/#faq" className="hover:text-white">
                سوالات متداول
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">قوانین</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-white">
                حریم خصوصی
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                شرایط استفاده
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-6 text-center text-xs text-gray-400 md:px-8">
          © ۱۴۰۴ مکانیست. تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
