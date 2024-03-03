import { useEffect, useState } from "react";
import AmountInput from "./AmountInput";
import ResultRow from "./ResultRow";
import axios from "axios"; // Using axios for simplicity
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
  const [amount, setAmount] = useState(defaultAmount);
  const [cachedResults, setCachedResults] = useState<CachedResult[]>([]);
  const [offerResults, setOfferResults] = useState<OfferResults>({});
  const [loading, setLoading] = useState(true);

  // Fetch cached values
  useEffect(() => {
    axios.get('/api/cachedValues')
      .then((res) => {
        setCachedResults(res.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cached values:", error);
        setLoading(false);
      });
  }, []);

  // Fetch offers based on the amount
  useDebouncedEffect(() => {
    if (amount === defaultAmount) return;

    setLoading(true);
    axios.get(`/api/offers?amount=${amount}`)
      .then((res) => {
        setOfferResults(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching offers:", error);
        setLoading(false);
      });
  }, 500, [amount]);

  function safeParseFloat(value: string | undefined): number {
    if (value === undefined) return 0;
    const number = parseFloat(value.replace(/,/g, "."));
    return isNaN(number) ? 0 : number;
  }

  const sortedCache = sortBy(cachedResults, (result) => -safeParseFloat(result.btc));
  const sortedResults = sortBy(Object.entries(offerResults).map(([provider, btc]) => ({ provider, btc })), (result) => -safeParseFloat(result.btc));
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
