import { createSignal, createResource } from "solid-js";
import { fetchSearchUsersByUsername } from "../../api/user.api";
import { debounce } from "@solid-primitives/scheduled";

export default function useSearchMembers() {
  const [rawQuery, setRawQuery] = createSignal("");
  const [query, setQuery] = createSignal("");
  const [members, setMembers] = createSignal<string[]>([]);

  const clearSearch = () => {
    setRawQuery("");
    setQuery("");
  };

  const debounced = debounce((value: string) => {
    setQuery(value);
  }, 400);

  const [matchedUsers] = createResource<User[], string>(query, async (q) => {
    if (!q.trim()) return [];

    const res = await fetchSearchUsersByUsername(q);

    if (res.type === "success") {
      return res.data;
    }

    return [];
  });


  return {
    setRawQuery,
    debounced,
    members,
    matchedUsers,
    setMembers,
    clearSearch,
    rawQuery,
  };
}
