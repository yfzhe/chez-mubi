export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function takef<T>(array: T[], pred: (v: T) => boolean): T[] {
  const idx = array.findIndex(pred);
  if (idx === -1) {
    return [];
  } else {
    return array.slice(idx);
  }
}
