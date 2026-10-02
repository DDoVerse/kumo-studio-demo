/**
 * JSON-LD injection. The five types used are Organization, WebSite,
 * Service, BreadcrumbList and VideoObject. Person is deliberately omitted.
 */
export default function JsonLd({ data }: { data: object[] }) {
  return (
    <>
      {data.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          // All of this is our own content; only </script> needs escaping.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(d).replace(/</g, "\u003c"),
          }}
        />
      ))}
    </>
  );
}
