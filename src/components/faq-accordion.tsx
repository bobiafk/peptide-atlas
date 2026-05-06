"use client";

import * as Accordion from "@radix-ui/react-accordion";

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
          className="overflow-hidden rounded-2xl border border-hairline bg-panel"
        >
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-text">
              {item.q}
              <span className="text-muted">+</span>
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
