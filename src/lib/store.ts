"use client";

import { FormDoc, SubmissionDoc } from "./types";

const FORMS_KEY = "docuticks.forms.v1";
const SUBS_KEY = "docuticks.submissions.v1";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const formStore = {
  list(): FormDoc[] {
    return read<FormDoc>(FORMS_KEY).sort((a, b) => b.updatedAt - a.updatedAt);
  },
  get(id: string): FormDoc | undefined {
    return read<FormDoc>(FORMS_KEY).find((f) => f.id === id);
  },
  upsert(doc: FormDoc) {
    const all = read<FormDoc>(FORMS_KEY);
    const i = all.findIndex((f) => f.id === doc.id);
    const next = { ...doc, updatedAt: Date.now() };
    if (i >= 0) all[i] = next;
    else all.push(next);
    write(FORMS_KEY, all);
  },
  remove(id: string) {
    write(
      FORMS_KEY,
      read<FormDoc>(FORMS_KEY).filter((f) => f.id !== id),
    );
  },
};

export const submissionStore = {
  list(): SubmissionDoc[] {
    return read<SubmissionDoc>(SUBS_KEY).sort(
      (a, b) => b.submittedAt - a.submittedAt,
    );
  },
  add(doc: SubmissionDoc) {
    const all = read<SubmissionDoc>(SUBS_KEY);
    all.push(doc);
    write(SUBS_KEY, all);
  },
};
