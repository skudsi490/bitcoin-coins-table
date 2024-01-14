import PaybisLogo from "../src/assets/paybis_logo.svg"
import GuardarianLogo from "../src/assets/main-logo-dark.5f4d2bf1.svg"

type ResultRowProps = {
    loading?: boolean;
    providerName?:string;
    btc?:string;
};

type Logo = {
    source:string, 
    invert?:boolean
};

const logos:{[keys:string]:Logo} = {
    'paybis': {source:PaybisLogo, invert:true},
    'guardarian': {source:GuardarianLogo, invert:true},
    'moonpay': {source:'https://www.moonpay.com/assets/logo-full-white.svg'},
    'transak': {source:'https://assets.transak.com/images/website/transak-logo.svg'},
};

export default function ResultRow({loading, providerName, btc}: ResultRowProps) {
    return (
        <a 
        href={`https://${providerName}.com`}
        target="_blank"
        className="block relative border h-[64px] border-white/10 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-4 my-2 overflow-hidden">
            <div className="flex gap-4">
            {providerName && (

                <div className="grow items-center flex">
                    <img 
                    src={logos[providerName].source} 
                    className={`h-8 ${logos[providerName]?.invert ? 'filter invert' : ''}`}
                    alt="" />
                </div>
            )}
               
                {btc && (
                <div className="flex gap-2">
                    <span className="text-xl text-purple-200/80">
                        {new Intl.NumberFormat('en-US', {maximumFractionDigits:8}).format(parseFloat(btc))}
                        </span>
                    <span className="text-xl text-purple-200/50">BTC</span>
                </div>

                )}
            </div>
            {loading && (
                <div className="absolute top-0 right-0 bottom-0 left-0 z-10 inset-0 bg-gradient-to-r from-transparent via-blue-800/50 to-transparent skeleton-animation border-t border-white/25"/>
            )}
        </a>
    );
}
