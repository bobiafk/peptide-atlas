import { ImageResponse } from "next/og";

import { getPeptideBySlug } from "@/lib/data";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<ImageResponse> {
  const { slug } = await params;
  const peptide = await getPeptideBySlug(slug);
  const title = peptide?.name ?? "Peptide";
  const description = peptide?.shortDescription ?? "Research profile";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(140deg, #EAF3FF 0%, #F7FBFF 55%, #EEFBF7 100%)",
          color: "#0A1B2A",
          padding: "56px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 28, color: "#0A84FF" }}>Peptide Atlas</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: 30, color: "#5F6F85" }}>{description.slice(0, 140)}</div>
        </div>
      </div>
    ),
    size,
  );
}
