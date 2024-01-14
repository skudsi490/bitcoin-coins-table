import { useEffect, useState } from "react";
import AmountInput from "./AmountInput";
import ResultRow from "./ResultRow";
import axios from "axios";
import { sortBy } from "lodash";
import useDebouncedEffect from "use-debounced-effect";

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
      if(amount === defaultAmount){
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
          });
      }
    },
    300,
    [amount]
  );

  function safeParseFloat(value: string | undefined): number {
    if (value === undefined) return 0;
    const number = parseFloat(value.replace(/,/g, '.'));
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
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="uppercase text-6xl text-center font-bold bg-gradient-to-br from-purple-600 to-sky-400 bg-clip-text text-transparent from-30%">
        Find Cheapest BTC
      </h1>
      <div className="flex justify-center mt-6">
        <AmountInput
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="mt-6">
        {loading && (
          <>
            <ResultRow loading={true} />
            <ResultRow loading={true} />
            <ResultRow loading={true} />
            <ResultRow loading={true} />
          </>
        )}
        {!loading &&
          showCached &&
          sortedCache.map((result) => (
            <ResultRow
              key={result.provider}
              providerName={result.provider}
              btc={safeParseFloat(result.btc).toFixed(8)}
            />
          ))}
        {!loading &&
          !showCached &&
          sortedResults.map((result) => (
            <ResultRow
              key={result.provider}
              providerName={result.provider}
              btc={safeParseFloat(result.btc).toFixed(8)}
            />
          ))}
      </div>
    </main>
  );
}

export default App;
