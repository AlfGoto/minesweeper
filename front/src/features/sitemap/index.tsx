import { getPages } from "@/app/sitemap";

export default function Sitemap() {
  const pages = getPages();
  return (
    <main className="min-h-screen py-4 px-12">
      <a
        href="/how-to-play"
        className="text-sm text-gray-700 italic underline hover:text-green-900"
      >
        Go back
      </a>
      <h1 className="text-2xl font-bold text-green-900">Sitemap</h1>
      <h2 className="text-lg font-bold text-green-900">
        All the pages of the website
      </h2>
      <ul>
        {pages.map((page) => (
          <li key={page.url}>
            <a href={page.url}>{page.url}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
