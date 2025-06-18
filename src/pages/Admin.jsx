import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import presaleAbi from '../abi/presale.json';
import { useEthersSigner } from 'src/stats/useEthersProvider';
import { getContract, getWeb3 } from '@utils/contractHelper';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useParams } from 'react-router-dom';
import { useWebsiteStats } from 'src/stats/useWebsite';
import { useAdminStats } from 'src/stats/useCommon';
import { ethers } from 'ethers';

export default function Admin() {
    const { address, isConnected } = useAppKitAccount();
    const { chainId } = useAppKitNetwork();
    const { id } = useParams(); // get the id from the route
    const { error, loading, chaininfo, presale_address } = useWebsiteStats(id);
    const signer = useEthersSigner(chaininfo?.chainId);
    const stats = useAdminStats(presale_address, chaininfo?.chainId)

    const [update, setUpdate] = useState({
        treasury_wallet: "",
        sale_status: "",
        claim_status: "",
        endtime: "",
        min_contribution: "",
        max_contribution: "",
        saleprice: ""
    });


    useEffect(() => {
        setUpdate({
            treasury_wallet: stats.treasury_wallet,
            sale_status: stats.sale_status,
            claim_status: stats.claim_status,
            endtime: stats.endtime,
            min_contribution: stats.min_contribution,
            max_contribution: stats.max_contribution,
            saleprice: stats.saleprice,
        })
    }, [stats])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUpdate({
            ...update,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleArrayChange = (e, name, index) => {
        const newArray = [...update[name]];
        newArray[index] = e.target.value;
        setUpdate({ ...update, [name]: newArray });
    };

    const handleSubmit = async (id) => {
        try {
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

            const tokenContract = getContract(presaleAbi, presale_address, signer);
            let tx;

            switch (id) {
                case 1:
                    tx = await tokenContract.setClaimStatus(update.claim_status === true || update.claim_status === 'true' ? true : false);
                    break;
                case 2:
                    tx = await tokenContract.setSaleStatus(update.sale_status === true || update.sale_status === 'true' ? true : false);
                    break;
                case 3:
                    tx = await tokenContract.setTreasuryWallet(update.treasury_wallet);
                    break;
                case 4:
                    tx = await tokenContract.setSalePrice(ethers.utils.parseEther(update.saleprice));
                    break;
                case 5:
                    tx = await tokenContract.setMinContribution(ethers.utils.parseEther(update.min_contribution));
                    break;
                case 6:
                    tx = await tokenContract.setMaxContribution(ethers.utils.parseEther(update.max_contribution));
                    break;
                case 7:
                    tx = await tokenContract.setEndTime(update.endtime);
                    break;
                default: return;
            }

            toast.loading('Transaction pending...');
            const web3 = getWeb3(chaininfo.chainId);
            const interval = setInterval(async () => {
                const receipt = await web3.eth.getTransactionReceipt(tx.hash);
                if (receipt) {
                    clearInterval(interval);
                    toast.dismiss();
                    receipt.status ? toast.success("Success!") : toast.error("Failed transaction.");
                }
            }, 4000);
        } catch (err) {
            toast.dismiss();
            toast.error(err.reason || err.message);
        }
    };

    const renderInput = (label, name, index, type = "text", isArray = false, arrayLength = 1, customLabels = []) => {

        return (
            <tr key={index}>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{label}</td>
                <td className="px-6 py-4">
                    {
                        isArray ? (
                            Array(arrayLength).fill().map((_, i) => (
                                <div key={i} className="mb-2">
                                    <label className="block text-sm text-gray-400">
                                        {customLabels[i]}
                                    </label>
                                    <input
                                        type={type}
                                        className="bg-stone-900 text-white text-lg w-full outline-none border border-gray-700"
                                        value={update[name][i]}
                                        onChange={(e) => handleArrayChange(e, name, i)}
                                    />
                                </div>
                            ))
                        ) : type === "checkbox" ? (
                            <input
                                type="checkbox"
                                checked={update[name]}
                                onChange={handleChange}
                                name={name}
                            />
                        ) : (
                            <>
                                <label className="block text-sm text-gray-400">{label}</label>
                                <input
                                    type={type}
                                    name={name}
                                    value={update[name]}
                                    onChange={handleChange}
                                    className="bg-stone-900 w-full border border-gray-700 text-white text-lg outline-none"
                                />
                            </>
                        )
                    }
                </td>
                <td className="px-6 py-4">
                    <button onClick={() => handleSubmit(index + 1)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm">
                        Submit
                    </button>
                </td>
            </tr>
        );
    };

    const fields = [
        ["set Claim Status", "claim_status"],
        ["set Sale Status", "sale_status"],
        ["set Treasury Wallet", "treasury_wallet"],
        ["set Sale Price($)", "saleprice"],
        ["set Min Contribution($)", "min_contribution"],
        ["set Max Contribution($)", "max_contribution"],
        ["set Endtime(In Timestamp)", "endtime"],
    ];

    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin" />
                </div>
            )}
            {
                error || !address || address !== stats.owner ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">

                        <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                            <div class="mx-auto max-w-screen-sm text-center">
                                <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">404</h1>
                                <p class="mb-4 text-3xl tracking-tight font-bold text-white md:text-4xl dark:text-white">Something's missing.</p>
                                <p class="mb-4 text-lg font-light text-gray-200 dark:text-gray-400">Sorry, we can't find that page. </p>
                                <p className='text-2xl'>{error}</p>
                            </div>
                        </div>

                    </div>

                ) : (
                    <main className="main-content p-6">
                        <h1 className="text-3xl font-bold text-center mb-6">Admin Settings</h1>
                        <div className="overflow-x-auto shadow rounded">
                            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="bg-gray-900 dark:bg-gray-700 text-xs text-white uppercase dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-3">No.</th>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Input</th>
                                        <th className="px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className='text-white'>
                                    {fields.map(([label, name, isArray = false, length = 1, customLabels = [], type = "text"], index) =>
                                        renderInput(label, name, index, type, isArray, length, customLabels)
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </main>
                )
            }
        </>
    )
}