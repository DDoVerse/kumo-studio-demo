/**
 * JSON-LD 주입. 공고 요건은 Organization / WebSite / Service /
 * BreadcrumbList / VideoObject 5종이며 Person 은 넣지 않는다.
 */
export default function JsonLd({ data }: { data: object[] }) {
  return (
    <>
      {data.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          // 콘텐츠는 전부 우리가 만든 것이라 신뢰 가능. </script> 만 막는다.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(d).replace(/</g, "\u003c"),
          }}
        />
      ))}
    </>
  );
}
