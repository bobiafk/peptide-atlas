"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

export function FAQAccordion({
  items,
}: {
  items: { q: string; a: string }[];
}): JSX.Element {
  if (items.length === 0) {
    return <p className="text-sm text-muted">No FAQ entries available.</p>;
  }

  return (
    <Accordion.Root type="single" collapsible className="space-y-3">
      {items.map((item, index) => (
        <Accordion.Item
          value={`faq-${index}`}
          key={item.q}
          className="group overflow-hidden rounded-2xl border border-hairline bg-panel-muted/40 transition-colors data-[state=open]:border-accent-blue/40 data-[state=open]:bg-panel"
        >
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-text">
              <span>{item.q}</span>
              <Plus className="h-4 w-4 shrink-0 text-muted transition-transform duration-200 group-data-[state=open]:rotate-45 group-data-[state=open]:text-accent-blue" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-5 pb-5 text-sm leading-relaxed text-muted">
            {item.a}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
