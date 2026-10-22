import type { DemoId } from "@/content/projects";
import { CursorPaginationDemo } from "./CursorPaginationDemo";
import { DispatchFeedDemo } from "./DispatchFeedDemo";
import { GiftCardDemo } from "./GiftCardDemo";

export function Demo({ id }: { id: DemoId }) {
  if (id === "gift-card") return <GiftCardDemo />;
  if (id === "cursor-pagination") return <CursorPaginationDemo />;
  return <DispatchFeedDemo />;
}
