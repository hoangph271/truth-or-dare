import { useEffect, useState } from "react";
import "./App.css";
import MarkdownIt from "markdown-it";

const useTruthOrDate = () => {
  const [truths, setTruths] = useState<string[]>([]);
  const [dares, setDares] = useState<string[]>([]);
  const [bullshit, setBullshit] = useState("");

  useEffect(() => {
    const abortController = new AbortController();

    fetch(
      "https://raw.githubusercontent.com/hoangph271/truth-or-dare/main/README.md",
      { signal: abortController.signal }
    ).then(async (res) => {
      const markdown = await res.text();

      const trimmer = (val: string) => val.trim();

      const [bullshit, otherparts] = markdown.split("---").map(trimmer);

      const [truthsStr, daresStr] = otherparts
        .split(/^## .+$/gm)
        .filter(Boolean)
        .map(trimmer);

      setBullshit(new MarkdownIt().render(bullshit));
      setTruths(truthsStr.split("\n").map(val => val.substring('- '.length)));
      setDares(daresStr.split("\n").map(val => val.substring('- '.length)));
    });

    return () => {
      abortController.abort();
    };
  }, []);

  return {
    bullshit,
    truths,
    dares
  };
};

export default function App () {
  const { truths, dares, bullshit } = useTruthOrDate();

  return (
    <div className="App">
      <code className="App" dangerouslySetInnerHTML={{ __html: bullshit }} />
      <div>
        {truths.map((truth) => (
          <code key={truth}>{truth}</code>
        ))}
      </div>
      <div>
        {dares.map((dare) => (
          <code key={dare}>{dare}</code>
        ))}
      </div>
    </div>
  );
}
