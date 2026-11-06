import { useSearchParams } from "react-router";

type Patch = Record<string, string | string[] | null | undefined>;

/**
 * View state lives in the URL so refresh keeps it and links can be shared.
 * `set` applies several keys in one navigation; separate setSearchParams calls
 * in the same tick would overwrite each other.
 */
export function useQueryParams() {
  const [params, setParams] = useSearchParams();

  const get = (key: string) => params.get(key);
  const getList = (key: string) =>
    (params.get(key) ?? "").split(",").filter(Boolean).map(decodeURIComponent);

  const set = (patch: Patch) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(patch).forEach(([key, value]) => {
          const encoded = Array.isArray(value)
            ? value.map(encodeURIComponent).join(",")
            : value;
          if (encoded) next.set(key, encoded);
          else next.delete(key);
        });
        return next;
      },
      { replace: true },
    );

  return { get, getList, set };
}
