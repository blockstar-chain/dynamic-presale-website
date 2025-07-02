import React, { useEffect, useRef, useState } from 'react'
import ErrorPage from './ErrorPage';
import presaleAbi from '../abi/presale.json';
import tokenAbi from '../abi/token.json';
import { ethers } from 'ethers';
import { useEthersSigner } from 'src/stats/useEthersProvider';
import { useAccountStats, useCommonStats } from 'src/stats/useCommon';
import toast from 'react-hot-toast';
import ConnectButton from '@components/ConnectButton';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { calculateAmount, getContract, getWeb3 } from '@utils/contractHelper';
import { formatPrice } from '@utils/helper';

export default function PresaleWebsite({ presale_address, website, header, hero, about, team, info, tokenomics, howToBuy, dex, presale, roadmap, social, cta, footer, chaininfo }) {
    if (!website || !header || !hero || !about || !team || !info || !tokenomics || !howToBuy || !dex || !presale || !roadmap || !social || !cta || !footer || !chaininfo) {
        return (<ErrorPage />);
    }
    const { address, isConnected } = useAppKitAccount();
    const { chainId } = useAppKitNetwork();
    const allSocialLinks = social && social.defaultLinks || social.customLinks ? [...social.defaultLinks, ...social.customLinks] : [];
    const [selectedCurrency, setSelectedCurrency] = useState(0);
    const [fromAmount, setFromAmount] = useState(0);
    const [toAmount, setToAmount] = useState(0);
    const [doller, setDoller] = useState(0);
    const timeoutRef = useRef(null);
    const [updater, setUpdater] = useState(1);
    const stats = useCommonStats(updater, presale_address, chaininfo?.chainId);
    const accStats = useAccountStats(presale_address, chaininfo.chainId, chaininfo.selectedCurrencies?.[selectedCurrency])
    const [showApprove, setShowApprove] = useState(false);
    const [insufficientBalance, setInsufficientBalance] = useState(false);
    const [txLoading, setTxloading] = useState(false);
    const signer = useEthersSigner(chaininfo?.chainId)


    const handleChangeAmount = async (amount) => {
        if (amount && amount.startsWith('.') && amount.length > 1) {
            amount = '0' + amount;
        }
        const patt = /^\d+\.{0,1}\d{0,6}$/;
        if (amount === '.') {
            setFromAmount(amount);
            setToAmount(0);
            setDoller(0);
            return false
        }
        else if (amount === '' || amount === 0) {
            setFromAmount(amount);
            setToAmount(0);
            setDoller(0);
            return false
        } else if (patt.test(amount)) {
            setFromAmount(amount);
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            if (patt.test(amount)) {
                let currencyInfo = chaininfo.selectedCurrencies[selectedCurrency]
                let output = await calculateAmount(amount, currencyInfo?.address, presale_address, chaininfo?.chainId, currencyInfo?.decimals);
                setToAmount(output[0]);
                setDoller(output[1]);
            }
        }, 1000);
    };

    useEffect(() => {
        handleChangeAmount(fromAmount)
    }, [selectedCurrency])


    const handleSubmit = async (type = 1) => {
        try {
            setTxloading(true);

            if (!address || !isConnected) {
                toast.error('Please connect wallet!');
                return setTxloading(false);
            }

            if (!presale_address) {
                toast.error('presale address not found!');
                return setTxloading(false);
            }

            if (!chaininfo || !chaininfo.chainId) {
                toast.error('presale chain infomation not found!');
                return setTxloading(false);
            }


            if (parseInt(chainId) !== parseInt(chaininfo.chainId)) {
                toast.error('Please switch to a supported network.');
                return setTxloading(false);
            }

            let currencyInfo = chaininfo.selectedCurrencies[selectedCurrency]
            if (!currencyInfo) {
                toast.error('currency info not found.');
                return setTxloading(false);
            }


            let tx;
            let contractConnect;
            if (type === 1) {
                contractConnect = getContract(tokenAbi, currencyInfo.address, signer);
                tx = await contractConnect.approve(presale_address, ethers.utils.parseEther('100000000000000'), { from: address });
            }
            else if (type === 2) {

                contractConnect = getContract(presaleAbi, presale_address, signer);
                const isNative = currencyInfo.address === "0x0000000000000000000000000000000000000000" ? 1 : 2;
                const value = isNative ? ethers.utils.parseEther(fromAmount.toString()) : undefined;

                tx = await contractConnect.buyToken(
                    currencyInfo.address,
                    ethers.utils.parseEther(fromAmount.toString()),
                    value ? { value, from: address } : { from: address });

            }
            else {
                contractConnect = getContract(presaleAbi, chainInfo.PRESALE_ADDRESS, signer);
                tx = await contractConnect.claim({ from: address });
            }

            toast.loading('Waiting for confirmation.');
            let web3 = getWeb3(chaininfo.chainId);
            var interval = setInterval(async function () {
                var response = await web3.eth.getTransactionReceipt(tx.hash);
                if (response != null) {
                    toast.dismiss();
                    clearInterval(interval);
                    if (response.status === true) {
                        toast.success('Success! Your last transaction is successful 👍');
                        setTxloading(false);
                    } else {
                        toast.error('Error! Your last transaction failed.');
                        setTxloading(false);
                    }

                    setUpdater(Math.random());
                }
            }, 5000);
        }
        catch (err) {
            console.log(err)
            toast.dismiss();
            toast.error(err.reason ? err.reason : err.message);
            setTxloading(false);
        }
    }


    useEffect(() => {
        const amount = parseFloat(fromAmount || 0);

        // Check if balance is enough
        if (accStats.balance < amount) {
            setInsufficientBalance(true);
        } else {
            setInsufficientBalance(false);
        }

        // If allowance is less than amount, need approval
        if (accStats.allowance < amount) {
            setShowApprove(true);
        } else {
            setShowApprove(false);
        }

    }, [fromAmount, accStats]);

    return (
        <>
            <header className="bg-black/70 backdrop-blur-lg sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
                    <div className="flex items-center gap-3">
                        {website.logoUrl
                            ? <img src={website.logoUrl} alt="Logo" className="h-10 w-auto" />
                            : <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: website.primary_color }}></div>}
                        <span className="text-xl font-bold text-white">{hero.title}</span>
                    </div>
                    <nav className="hidden md:flex items-center">
                        {header.navLinks && header.navLinks.map((link, index) => (
                            <a key={index} href={link.href} className="px-4 py-2 text-sm font-semibold hover:text-amber-400 transition-colors">{link.name}</a>
                        ))}
                    </nav>
                    <div className="hidden md:flex items-center gap-2">
                        <a href={dex.url} target="_blank" className="px-4 py-2 text-sm font-semibold bg-gray-800 rounded-lg hover:bg-gray-700 transition-all">{header.dexButtonText}</a>
                        <ConnectButton
                            className="px-4 py-2 text-sm font-semibold rounded-lg text-white transform hover:scale-105 transition-transform"
                            style={{ backgroundColor: website.primary_color }}
                            text={header.ctaButtonText}
                        />
                    </div>
                </div>
            </header>
            <main>
                <section id="hero" className="text-center py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-5xl font-extrabold" style={{ color: website.primary_color }}>
                            {hero.short_title}
                        </h2>
                        <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-300">{hero.description}</p>
                        <a href="#presale" className="mt-8 inline-block text-white px-8 py-3 rounded-lg transition-transform transform hover:scale-105" style={{ backgroundColor: website.primary_color }}>
                            Join Presale
                        </a>
                    </div>
                </section>
                <section id="info" className="py-20">
                    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <h3 className="text-4xl font-bold">{info.title}</h3>
                            <p className="mt-4 text-gray-300">{info.description}</p>
                        </div>
                        <div>
                            {info.infoImageUrl
                                ? <img src={info.infoImageUrl} alt="Info Section Image" className="rounded-xl shadow-2xl w-full h-auto object-cover border-2 border-slate-700 hover:border-sky-500 transition-all duration-300" />
                                : <p className="text-gray-500">Info Image Area</p>}
                        </div>
                    </div>
                </section>
                <section id="about" className="py-20 bg-black/50">
                    <div className="container mx-auto px-4 text-center max-w-3xl">
                        <h3 className="text-4xl font-bold">{about.title}</h3>
                        <div className="inline-block border-b-2 mt-2" style={{ borderColor: website.primary_color, width: '80px' }}></div>
                        <p className="mt-4 text-gray-300 leading-relaxed">{about.description}</p>
                    </div>
                </section>
                <section id="team" className="py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h3 className="text-4xl font-bold">{team.title}</h3>
                        <div className="inline-block border-b-2 mt-2" style={{ borderColor: website.primary_color, width: '80px' }}></div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-12">
                            {team && team.members && team.members.map((member, index) => (
                                <div key={index} className="text-center transition-transform transform hover:-translate-y-2">
                                    <div className="w-32 h-32 mx-auto rounded-full bg-gray-800 overflow-hidden flex items-center justify-center border-2 border-gray-700">
                                        {member.imageUrl ? <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" /> : <span className="text-gray-500 text-xs">No Image</span>}
                                    </div>
                                    <h4 className="mt-4 text-lg font-bold text-white">{member.name}</h4>
                                    <p className="text-sm" style={{ color: website.primary_color }}>{member.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <section id="tokenomics" className="py-20 bg-black/50">
                    <div className="container mx-auto px-4 text-center">
                        <h3 className="text-4xl font-bold">{tokenomics.title}</h3>
                        <div className="inline-block border-b-2 mt-2" style={{ borderColor: website.primary_color, width: '80px' }}></div>
                        <p className="mt-4 text-gray-400">
                            Total Supply: {parseFloat(tokenomics.total_supply || 0).toLocaleString()} {tokenomics.token_symbol}
                        </p>
                        <p className="text-gray-500 text-sm">
                            Ticker: {tokenomics.token_symbol} | Chain: BlockStar Chain
                        </p>
                        <div className="max-w-3xl mx-auto mt-12 space-y-6 text-left">
                            {tokenomics.items && tokenomics.items.map((item, index) => {
                                const tokenAmount = (parseFloat(item.percentage) / 100) * parseFloat(tokenomics.total_supply || 0);
                                return (
                                    <div key={index} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300 transform hover:scale-105">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                                            <div className="flex-1">
                                                <h4 className="text-xl font-bold text-white">{item.name}</h4>
                                                <p className="text-gray-400 mt-2 text-sm leading-relaxed">{item.description}</p>
                                            </div>
                                            <div className="text-left sm:text-right flex-shrink-0 mt-2 sm:mt-0">
                                                <p className="text-lg font-bold" style={{ color: website.primary_color }}>{item.percentage}%</p>
                                                <p className="text-xs text-gray-500">({tokenAmount.toLocaleString()} {tokenomics.token_symbol})</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
                <section id="presale" className="py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h3 className="text-4xl font-bold">{presale.title}</h3>
                        <div className="inline-block border-b-2 mt-2" style={{ borderColor: website.primary_color, width: '80px' }}></div>
                        <p className="max-w-2xl mx-auto mt-4 text-gray-400">{presale.description}</p>
                        <div className="my-12" id="countdown-timer"></div>
                        <div className="max-w-xl mx-auto bg-gray-800 p-8 rounded-2xl border border-gray-700">
                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-gray-400 mb-2">
                                    <span>Raised: ${parseFloat(stats.totalRaised || 0).toLocaleString()}</span>
                                    <span>Price: ${stats.price}</span>
                                    <span>Target: ${parseFloat(presale.targetAmount || 0).toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-3">
                                    <div className="h-3 rounded-full" style={{ width: `${parseFloat(stats.percentageRaised)}%`, backgroundColor: website.primary_color }}></div>
                                </div>
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-4">Contribute to Presale</h4>
                            <div>
                                <div className='flex justify-between'>
                                    <label className="text-left block text-sm mb-1 text-gray-400">Contribution Amount</label>
                                    <label className="text-left block text-sm mb-1 text-gray-400">~ {formatPrice(doller)}</label>
                                </div>
                                <input
                                    type="text"
                                    onChange={(e) => handleChangeAmount(e.target.value)}
                                    id="contributionAmount"
                                    value={fromAmount}
                                    placeholder="0"
                                    className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white" />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <div>
                                    <span>Balance: {formatPrice(accStats.balance)}</span>
                                </div>
                                <div className='flex'>
                                    <span>Min: ${stats.minBuy}</span>&nbsp;{"|"}&nbsp;
                                    <span>Max: ${stats.maxBuy}</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-left text-sm mb-2 text-gray-400">Pay With:</p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {chaininfo && chaininfo.selectedCurrencies ? chaininfo.selectedCurrencies.map((currency, index) => (
                                        <button
                                            key={currency.symbol}
                                            onClick={() => setSelectedCurrency(index)}
                                            className={`btn btn-currency flex items-center justify-center py-3 border-2 transition-all duration-150 ${selectedCurrency === index ? 'border-accent' : 'border-transparent'}`}
                                        >
                                            <img src={currency.image} alt={currency.symbol} className="w-5 h-5 mr-2" />
                                            {currency.symbol}
                                        </button>
                                    )) : (
                                        <button className={`btn btn-currency flex items-center justify-center py-3 border-2 transition-all duration-150`}>
                                            No Currency Supported
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="mt-4 text-gray-400">
                                You will receive: <span id="tokens-to-receive" className="font-bold text-white">
                                    <strong className="text-white" id="bomToReceive">{formatPrice(toAmount)} {tokenomics.token_symbol} </strong>
                                </span>
                            </p>
                            {address ? (
                                <>
                                    {showApprove ? (
                                        <button
                                            disabled={insufficientBalance || txLoading}
                                            type="button"
                                            className="w-full mt-6 text-white font-bold py-3 rounded-lg" style={{ backgroundColor: website.primary_color }}
                                            onClick={() => handleSubmit(1)} // Approve
                                        >
                                            {txLoading ? 'Loading' : 'Approve'}
                                        </button>
                                    ) : (
                                        <button
                                            disabled={insufficientBalance || txLoading}
                                            type="button"
                                            className="w-full mt-6 text-white font-bold py-3 rounded-lg" style={{ backgroundColor: website.primary_color }}
                                            onClick={() => handleSubmit(2)} // Buy
                                        >

                                            {txLoading ? 'Loading' : ' Buy Now'}
                                        </button>
                                    )}
                                    {stats.claimstatus && parseFloat(stats.buybal) > 0 && (
                                        <>
                                            <p className='mt-3 text-center mb-3'>Your Purchased : {formatPrice(stats.buybal)}</p>
                                            <button
                                                disabled={insufficientBalance || txLoading}
                                                type="button"
                                                className="w-full mt-6 text-white font-bold py-3 rounded-lg" style={{ backgroundColor: website.primary_color }}
                                                onClick={() => handleSubmit(3)} // Buy
                                            >

                                                {txLoading ? 'Loading' : ' Claim Now'}
                                            </button>
                                        </>
                                    )}

                                </>
                            ) : (

                                <ConnectButton className="w-full mt-6 text-white font-bold py-3 rounded-lg" style={{ backgroundColor: website.primary_color }} />
                            )}

                        </div>
                    </div>
                </section>
                <section id="how-to-buy" className="py-20 bg-black/50">
                    <div className="container mx-auto px-4 text-center">
                        <h3 className="text-4xl font-bold">
                            {howToBuy && howToBuy.title ? howToBuy.title.replace(/\$Token/g, '$' + tokenomics.token_symbol) : ""}
                        </h3>
                        <div className="inline-block border-b-2 mt-2" style={{ borderColor: website.primary_color, width: '80px' }}></div>
                        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
                            {howToBuy.steps && howToBuy.steps.map((step, index) => (
                                <div key={index} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 text-center transition-transform transform hover:-translate-y-2">
                                    <div className="text-5xl font-bold" style={{ color: website.primary_color }}>0{index + 1}</div>
                                    <h4 className="text-xl font-bold mt-4 text-white">{step.title.replace(/\$Token/g, '$' + tokenomics.token_symbol)}</h4>
                                    <p className="text-gray-400 mt-2 text-sm leading-relaxed">{step.description.replace(/\$Token/g, '$' + tokenomics.token_symbol)}</p>
                                    {index === 1 ? <a href={dex.url} target="_blank" className="inline-block text-sm mt-4 font-semibold" style={{ color: website.primary_color }}>Visit DEX →</a> : ''}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <section id="roadmap" className="py-20">
                    <div className="container mx-auto px-4">
                        <h3 className="text-4xl font-bold mb-16 text-center">Development Roadmap</h3>
                        <div className="relative max-w-2xl mx-auto">
                            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-700 transform -translate-x-1/2"></div>
                            <div className="space-y-8">
                                {roadmap && roadmap.map((item, index) => {
                                    const detailsHtml = item.details && item.details.map((detail, detailIndex) => (
                                        <li key={detailIndex} className="flex items-start"><span className="mr-2 mt-1" style={{ color: website.primary_color }}>◆</span><span>{detail}</span></li>
                                    ));

                                    const titleBlock = (
                                        <div className="md:text-right md:pr-12">
                                            <p className="text-xl font-bold" style={{ color: website.primary_color }}>{item.title}</p>
                                            <p className="text-lg text-white font-semibold mt-1">{item.subtitle}</p>
                                        </div>
                                    );

                                    const detailsBlock = (
                                        <div className="relative">
                                            <div className="hidden md:block absolute w-4 h-4 rounded-full -left-2 top-2" style={{ backgroundColor: website.primary_color }}></div>
                                            <div className="mt-4 md:mt-0 md:ml-8 p-6 rounded-lg bg-gray-800/50 border border-gray-700/50">
                                                <ul className="space-y-2 text-gray-300">{detailsHtml}</ul>
                                            </div>
                                        </div>
                                    );

                                    if (index % 2 === 0) {
                                        return (
                                            <div key={index} className="relative md:grid md:grid-cols-2 md:gap-8 items-start">
                                                {titleBlock}
                                                {detailsBlock}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={index} className="relative md:grid md:grid-cols-2 md:gap-8 items-start">
                                                <div className="md:col-start-2 md:text-left md:pl-12">{titleBlock.props.children}</div>
                                                <div className="md:col-start-1 md:row-start-1">{detailsBlock.props.children}</div>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <section className="py-20 bg-black/50">
                <div className="container mx-auto text-center max-w-3xl">
                    <h2 className="text-4xl font-bold text-white">{cta.title}</h2>
                    <p className="mt-4 text-gray-400">{cta.description}</p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        {allSocialLinks && allSocialLinks.map((link, index) => (
                            <a key={index} href={link.url} target="_blank" className="px-5 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 font-semibold text-white no-underline transition-all transform hover:scale-105">{link.name}</a>
                        ))}
                        {social && social.whitepaperPdf
                            ? <a href={social.whitepaperPdf} download="whitepaper.pdf" className="px-5 py-3 rounded-lg bg-white text-gray-900 hover:bg-gray-200 font-semibold no-underline transition-all transform hover:scale-105">📄 Download White Paper</a>
                            : <a href={social.whitepaperUrl} target="_blank" className="px-5 py-3 rounded-lg bg-white text-gray-900 hover:bg-gray-200 font-semibold no-underline transition-all transform hover:scale-105">📄 Read White Paper</a>}
                    </div>
                </div>
            </section>
            <footer className="py-10 mt-10 border-t border-gray-800 text-center text-gray-500 text-sm">
                <div className="container mx-auto">
                    <p>{footer.copyright}</p>
                    <p className="mt-2">{footer.disclaimer}</p>
                </div>
            </footer>
        </>
    )
}
