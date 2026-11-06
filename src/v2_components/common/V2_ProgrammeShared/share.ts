import { toast } from "sonner";

/** Native share sheet on phones, clipboard on desktop. The link reopens this session. */
export const shareSession = async (s: Programme) => {
  const url = new URL(window.location.href);
  url.searchParams.set("day", s.start_date);
  url.searchParams.set("session", s.id);
  const link = url.toString();
  try {
    if (navigator.share) {
      await navigator.share({ title: s.title, url: link });
      return;
    }
    await navigator.clipboard.writeText(link);
    toast.success("Link copied", { description: "Anyone with the link opens this session." });
  } catch (e) {
    if ((e as Error).name !== "AbortError") toast.error("Couldn't share this session");
  }
};
