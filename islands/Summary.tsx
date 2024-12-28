import { pipeline } from "@huggingface/transformers";
import { useState } from "preact/hooks";

export default function Summary() {
  const [input, setInput] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const getSummary = async (input: string) => {
    setLoading(true);
    try {
      const summarizer = await pipeline("summarization");
      const result = (await summarizer(input)) as { summary_text: string }[];
      setSummary(result[0].summary_text);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during summarization:", error);
        setSummary(`Error during summarization: ${error.message}`);
      }
    }
    setLoading(false);
  };

  const copyToClipboard = async () => {
    if (summary) {
      try {
        await navigator.clipboard.writeText(summary);
        alert("Copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  return (
    <div class="p-4">
      <h1 class="text-2xl text-center">Summarize Your Text</h1>
      <div>
        <label
          htmlFor="summary_input"
          className="block text-lg font-medium text-gray-900 pt-4">
          Enter some text below, and we'll generate a concise summary for you!
          It's a quick way to get to the key points. 😊
        </label>
        <div className="mt-2">
          <textarea
            id="summary_input"
            name="summary_input"
            value={input}
            onChange={(ev) =>
              setInput((ev.target as HTMLTextAreaElement).value)
            }
            rows={6}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            defaultValue={""}
          />
        </div>
      </div>
      {summary && (
        <div class="relative">
          <p className="mt-6 p-4 block w-full rounded-md bg-white text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 pr-10">
            {summary}
          </p>
          <button
            aria-labelledby="Copy to clipboard"
            onClick={copyToClipboard}
            class="absolute top-1 right-2 p-1 rounded-md hover:bg-gray-300 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
              />
            </svg>
          </button>
        </div>
      )}
      <button
        onClick={() => getSummary(input)}
        disabled={!input}
        class="bg-blue-500 text-white px-4 py-2 rounded mt-10 disabled:bg-gray-600">
        {loading ? "Summarizing..." : "Summarize"}
      </button>
    </div>
  );
}
