import { create } from "jsr:@quentinadam/zip";
import { bundle } from "jsr:@deno/emit";
import { res, url } from "./utils.ts";

const rel = (input: string) => url(input, import.meta.url);

const decoded = ((d?: TextDecoder) => (
  (d = new TextDecoder("utf8")),
  async (input: AllowSharedBufferSource | Promise<AllowSharedBufferSource>) =>
    d.decode(await input)
))();

const encode = ((e?: TextEncoder) => (
  (e = new TextEncoder()), (input: string) => e.encode(input)
))();

const minified = (path: URL) =>
  bundle(path, { minify: true }).then(({ code }) => code);

const [html, zip] = await Promise.all([
  decoded(Deno.readFile(rel("../src/index.html"))),
  minified(rel("../src/client.ts")),
]).then(([html, code]) => {
  const data = encode(html.replace(" src=client.js>", `>${code}`));
  return Promise.all([data, create([{ name: "index.html", data }])]);
});

Deno.mkdir(rel("../dist"), { recursive: true }).then(() =>
  Promise.all([
    Deno.writeFile(rel("../dist/index.html"), html),
    Deno.writeFile(rel("../dist/js13k.zip"), zip),
  ])
);

if (Deno.args.includes("serve")) {
  Deno.serve(async () =>
    res(await (await Deno.open(rel("../dist/index.html"))).readable, {
      headers: { "Content-Type": "text/html" },
    })
  );
}
