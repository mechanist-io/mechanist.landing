import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Bot, SendHorizontal, Sparkles } from "lucide-react";
import { MockupView, SectionView } from "@/components/site/AnalyticsRuntime";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

const conversation = [
  {
    user: "میخوام لاستیک برای ماشینم بگیرم، چی پیشنهاد میدی؟",
    assistant:
      "برای ۲۰۶ تیپ ۲ مدل ۱۳۹۹؟\nاگه بودجه و سایز فعلی رو بگی، دقیق‌تر پیشنهاد می‌دم.",
    readingTime: 4200,
  },
  {
    user: "اره، تا ۵۰ تومن. سایز رو نمی‌دونم.",
    assistant: "رینگ اسپورت داره ماشین؟",
    readingTime: 3200,
  },
  {
    user: "نه لاستیک فابریک روی ماشینه",
    assistant:
      "پس سایز استاندارد معمولاً 185/65 R14 هست — قبل از خرید روی دیواره لاستیک چک کن.\n\nپیشنهاد من:\nHankook Kinergy Eco2 K435\nحدود ۲۰ تا ۲۴ میلیون برای ۴ حلقه\n\nبعضی فروشنده‌ها قیمت رو برای ۱ حلقه می‌نویسن؛ حتماً بپرس برای چند حلقه‌ست.",
    readingTime: 9000,
  },
  {
    user: "موقع خرید چی چک کنم که کلاه سرم نره؟",
    assistant:
      "چک‌لیست سریع:\n☐ سایز 185/65R14\n☐ هر ۴ حلقه یک برند و مدل\n☐ تاریخ تولید ۲۰۲۵ یا ۲۰۲۶\n☐ قیمت شفاف: ۴ حلقه یا تک؟\n☐ گارانتی اصالت + فاکتور رسمی\n☐ بعد از نصب، بالانس\n\nبرندهای پیشنهادی: هانکوک، میشلن، بارز، یزد تایر",
    readingTime: 8500,
  },
] as const;

function StatusBar() {
  return (
    <div className="flex h-8 items-center justify-between px-5 pt-1 text-[9px] font-semibold text-black">
      <span>۹:۴۱</span>
      <span>●●●●●</span>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      data-message-id={message.id}
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-end gap-1.5 ${isUser ? "justify-start" : "justify-end"}`}
    >
      {!isUser && (
        <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-black text-white">
          <Bot size={12} />
        </div>
      )}
      <div
        dir="rtl"
        className={`max-w-[84%] whitespace-pre-line rounded-2xl px-3 py-2 text-start text-[10px] leading-[1.75] ${
          isUser
            ? "rounded-br-md bg-[color:var(--brand-orange)] text-white"
            : "rounded-bl-md border border-gray-100 bg-gray-50 text-gray-700"
        }`}
      >
        {message.text}
      </div>
    </motion.div>
  );
}

function AiChatPhone() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.45 });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion) {
      setMessages([
        { id: 1, role: "user", text: conversation[0].user },
        { id: 2, role: "assistant", text: conversation[0].assistant },
      ]);
      return;
    }

    if (!inView) {
      setMessages([]);
      setDraft("");
      setIsThinking(false);
      messagesRef.current?.scrollTo({ top: 0 });
      return;
    }

    let cancelled = false;
    let nextId = 0;
    const timers = new Set<number>();
    let rafId = 0;
    const wait = (duration: number) =>
      new Promise<void>((resolve) => {
        const timer = window.setTimeout(() => {
          timers.delete(timer);
          resolve();
        }, duration);
        timers.add(timer);
      });

    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
      const viewport = messagesRef.current;
      if (viewport) viewport.scrollTo({ top: viewport.scrollHeight, behavior });
    };

    const animateScroll = (viewport: HTMLElement, to: number, duration: number) =>
      new Promise<void>((resolve) => {
        const from = viewport.scrollTop;
        const distance = to - from;
        if (Math.abs(distance) < 1 || duration <= 0) {
          viewport.scrollTop = to;
          const timer = window.setTimeout(() => {
            timers.delete(timer);
            resolve();
          }, Math.max(0, duration));
          timers.add(timer);
          return;
        }

        const start = performance.now();
        // Near-linear ease so the read-scroll stays continuous and natural.
        const ease = (t: number) => 1 - Math.pow(1 - t, 1.35);

        const tick = (now: number) => {
          if (cancelled) {
            resolve();
            return;
          }
          const progress = Math.min(1, (now - start) / duration);
          viewport.scrollTop = from + distance * ease(progress);
          if (progress < 1) {
            rafId = window.requestAnimationFrame(tick);
          } else {
            resolve();
          }
        };

        rafId = window.requestAnimationFrame(tick);
      });

    const typeMessage = async (text: string) => {
      setDraft("");
      for (let index = 0; index < text.length; index += 1) {
        if (cancelled) return false;
        setDraft(text.slice(0, index + 1));
        await wait(text[index] === "\n" ? 180 : 34 + Math.random() * 34);
      }
      await wait(450);
      return !cancelled;
    };

    const readAndScroll = async (duration: number, messageId: number) => {
      const viewport = messagesRef.current;
      if (!viewport) {
        await wait(duration);
        return;
      }

      const bubble = viewport.querySelector<HTMLElement>(`[data-message-id="${messageId}"]`);
      if (!bubble) {
        await wait(duration);
        return;
      }

      // Start at the beginning of the new answer instead of jumping to its end.
      const viewportRect = viewport.getBoundingClientRect();
      const bubbleRect = bubble.getBoundingClientRect();
      const bubbleTop = viewport.scrollTop + bubbleRect.top - viewportRect.top;
      viewport.scrollTop = Math.max(0, bubbleTop - 8);
      await wait(900);
      if (cancelled) return;

      const start = viewport.scrollTop;
      const updatedViewportRect = viewport.getBoundingClientRect();
      const updatedBubbleRect = bubble.getBoundingClientRect();
      const target = Math.min(
        viewport.scrollHeight - viewport.clientHeight,
        start + Math.max(0, updatedBubbleRect.bottom - updatedViewportRect.bottom + 8),
      );

      await animateScroll(viewport, target, duration);
    };

    const run = async () => {
      while (!cancelled) {
        setMessages([]);
        setDraft("");
        setIsThinking(false);
        messagesRef.current?.scrollTo({ top: 0 });
        await wait(1100);

        for (const exchange of conversation) {
          const completed = await typeMessage(exchange.user);
          if (!completed || cancelled) return;

          setMessages((current) => [
            ...current,
            { id: ++nextId, role: "user", text: exchange.user },
          ]);
          setDraft("");
          await wait(150);
          scrollToBottom();
          setIsThinking(true);
          await wait(1000);
          if (cancelled) return;

          setIsThinking(false);
          const assistantId = ++nextId;
          setMessages((current) => [
            ...current,
            { id: assistantId, role: "assistant", text: exchange.assistant },
          ]);
          await wait(350);
          await readAndScroll(exchange.readingTime, assistantId);
          await wait(500);
        }

        scrollToBottom();
        await wait(3000);
      }
    };

    void run();
    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
      window.cancelAnimationFrame(rafId);
    };
  }, [inView, reduceMotion]);

  return (
    <div
      ref={rootRef}
      className="relative mx-auto flex w-full max-w-[340px] justify-center [perspective:1400px]"
    >
      <div className="pointer-events-none absolute bottom-2 h-8 w-[70%] rounded-[100%] bg-black/20 blur-xl" />
      <motion.div
        className="relative origin-center"
        animate={
          reduceMotion || !inView
            ? undefined
            : {
                // Opposite yaw from CustomizeParts so the two mockups feel distinct.
                rotateY: [10, 14, 10],
                rotateX: [4, 6, 4],
                rotateZ: [-1.5, -0.5, -1.5],
                y: [0, -8, 0],
              }
        }
        transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative w-[260px] shrink-0 rounded-[2.5rem] border-[10px] border-black bg-black p-1 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.45)]">
          <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-black" />
          <div className="relative flex h-[540px] w-full flex-col overflow-hidden rounded-[2rem] bg-white">
            <StatusBar />
            <div className="flex items-center gap-2 border-b border-gray-100 px-3 pb-2 pt-1">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-black text-white">
                <Sparkles size={14} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-black">دستیار هوشمند مکانیست</p>
                <p className="text-[8px] text-gray-400">آنلاین · آماده پاسخ‌گویی</p>
              </div>
            </div>

            <div
              ref={messagesRef}
              className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="mx-auto w-fit rounded-full bg-gray-100 px-2.5 py-1 text-[8px] text-gray-400">
                امروز
              </div>
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
              {isThinking && (
                <div className="flex items-end justify-end gap-1.5">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-black text-white">
                    <Bot size={12} />
                  </div>
                  <div className="flex gap-1 rounded-2xl rounded-bl-md bg-gray-100 px-3 py-2.5">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        className="h-1 w-1 rounded-full bg-gray-400"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.65, repeat: Infinity, delay: dot * 0.13 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 bg-white px-2.5 py-2">
              <div className="flex min-h-10 items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-1.5 ps-2.5">
                <p
                  dir="rtl"
                  className={`max-h-[66px] min-h-6 flex-1 overflow-hidden whitespace-pre-wrap pt-1 text-start text-[9px] leading-4 ${
                    draft ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  {draft || "پیامت رو بنویس..."}
                  {draft && (
                    <motion.span
                      className="ms-0.5 inline-block h-3 w-px bg-gray-700 align-middle"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.55, repeat: Infinity }}
                    />
                  )}
                </p>
                <div
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors ${
                    draft ? "bg-[color:var(--brand-orange)] text-white" : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <SendHorizontal size={12} className="rotate-180" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function AiAssistantShowcase() {
  return (
    <SectionView
      id="ai-assistant"
      as="section"
      className="overflow-hidden border-y border-gray-100 bg-gray-50 py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:gap-16 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-3 text-sm font-semibold text-[color:var(--brand-orange)]">
            دستیار هوش مصنوعی
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            قبل از خرید و تعمیر، با مکانیست مشورت کن
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-gray-600">
            سوالت رو با زبان ساده بپرس. دستیار هوشمند مکانیست با توجه به مدل و سال خودروت،
            پیشنهادهای دقیق‌تر، بازه قیمت و نکته‌هایی که باید موقع خرید یا تعمیر بررسی کنی رو بهت
            می‌گه.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "پیشنهاد قطعه متناسب با خودرو و بودجه شما",
              "مقایسه قیمت و توضیح نکات مهم قبل از خرید",
              "چک‌لیست تشخیص اصالت و جلوگیری از هزینه اضافه",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--brand-orange)]" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <MockupView id="ai-assistant">
            <AiChatPhone />
          </MockupView>
        </motion.div>
      </div>
    </SectionView>
  );
}
