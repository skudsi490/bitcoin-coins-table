import { useEffect, useState } from "react";
import AmountInput from "./AmountInput";
import ResultRow from "./ResultRow";
import axios from "axios";
import { sortBy } from "lodash";
import useDebouncedEffect from "use-debounced-effect";
import githubLogo from "./assets/github-11-128.png";
import linkedinLogo from "./assets/linkedin-6-128.png";
import sideImage from './assets/hero-img.png';

type CachedResult = {
  provider: string;
  btc: string;
};

type OfferResults = { [key: string]: string };

const defaultAmount = "100";

function App() {
  const [prevAmount, setPrevAmount] = useState(defaultAmount);
  const [amount, setAmount] = useState(defaultAmount);
  const [cachedResults, setCachedResults] = useState<CachedResult[]>([]);
  const [offerResults, setOfferResults] = useState<OfferResults>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://4jzrf4a39y.us.aircode.run/cachedValues")
      .then((res) => {
        if (Array.isArray(res.data.results)) {
          setCachedResults(res.data.results);
        } else {
          console.error("Unexpected data structure:", res.data);
          setCachedResults([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, []);

  useDebouncedEffect(
    () => {
      if (amount === defaultAmount) {
        return;
      }
      if (amount !== prevAmount) {
        setLoading(true);
        axios
          .get(`https://4jzrf4a39y.us.aircode.run/offers?amount=${amount}`)
          .then((res) => {
            setLoading(false);
            setOfferResults(res.data);
            setPrevAmount(amount);
          })
          .catch((error) => {
            console.error("Error fetching offer results:", error);
            setLoading(false);
          });
      }
    },
    300,
    [amount]
  );

  function safeParseFloat(value: string | undefined): number {
    if (value === undefined) return 0;
    const number = parseFloat(value.replace(/,/g, "."));
    return isNaN(number) ? 0 : number;
  }

  const sortedCache = sortBy(
    cachedResults
      .filter((result): result is CachedResult => result != null)
      .map((result) => ({
        ...result,
        btc: safeParseFloat(result.btc).toString(),
      })),
    (result) => safeParseFloat(result.btc)
  ).reverse();

  const sortedResults: CachedResult[] = sortBy(
    Object.keys(offerResults)
      .map(
        (provider): CachedResult => ({
          provider,
          btc: offerResults[provider] ?? "0",
        })
      )
      .map((result) => ({
        ...result,
        btc: safeParseFloat(result.btc).toString(),
      })),
    (result) => safeParseFloat(result.btc)
  ).reverse();

  const showCached = amount === defaultAmount;

  return (
    <main className="main-container"> 
      <img src={sideImage} alt="Side" className="side-image" />
      <section className="content">
        <h1 className="title">Find the best Bitcoin Price</h1>
        <h2 className="subtitle">Compare different Providers</h2>
        <AmountInput
          value={amount}
          onChange={(e) => setAmount(e.target.value)} 
        />
        <div className="results-container">
          {loading ? (
            <>
              <ResultRow loading={true} />
              <ResultRow loading={true} />
              <ResultRow loading={true} />
              <ResultRow loading={true} />
            </>
          ) : showCached ? (
            sortedCache.map((result) => (
              <ResultRow
                key={result.provider}
                providerName={result.provider}
                btc={safeParseFloat(result.btc).toFixed(8)}
              />
            ))
          ) : (
            sortedResults.map((result) => (
              <ResultRow
                key={result.provider}
                providerName={result.provider}
                btc={safeParseFloat(result.btc).toFixed(8)}
              />
            ))
          )}
        </div>
      </section>
      <footer className="footer">
  <p className="footer-text">Built with <span className="heart">❤️</span> by Sami Kudsi</p>
  <div className="social-links">
    <a href="https://www.linkedin.com/in/sami-kudsi-0b1010164/" target="_blank" rel="noopener noreferrer" className="flex items-center">
      <img src={linkedinLogo} alt="LinkedIn" className="social-icon" />
    </a>
    <a href="https://github.com/skudsi490" target="_blank" rel="noopener noreferrer" className="flex items-center">
      <img src={githubLogo} alt="GitHub" className="social-icon" />
    </a>
  </div>
</footer>

    </main> 
  );
}

export default App;
