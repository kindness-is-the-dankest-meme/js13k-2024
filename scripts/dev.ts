import { format, parse } from "jsr:@std/path";
import { bundle } from "jsr:@deno/emit";
import { httpStatus, res, url } from "./utils.ts";

const readable = (path: URL) =>
  Deno.open(path, { read: true }).then(({ readable }) => readable);

const compiled = (path: URL) => bundle(path).then(({ code }) => code);

Deno.serve(async ({ url: href }: Request) => {
  const parsed = parse(decodeURIComponent(url(href).pathname));
  let { ext, name } = parsed;

  if (parsed.dir !== "/") {
    return res(httpStatus(403), { status: 403 });
  }

  switch (parsed.name) {
    case "":
    case "index": {
      name = "index";
      ext = ".html";
      break;
    }

    case "client": {
      ext = ".ts";
      break;
    }

    default: {
      return res(httpStatus(403), { status: 403 });
    }
  }

  const path = url(
    format({
      base: `${name}${ext}`,
      dir: "../src",
      ext,
      name,
      root: "/",
    }),
    import.meta.url
  );

  switch (ext) {
    case ".html": {
      return res(await readable(path), {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    case ".ts": {
      return res(await compiled(path), {
        headers: {
          "Content-Type": "text/javascript",
        },
      });
    }
  }

  return res(httpStatus(404), { status: 404 });
});
