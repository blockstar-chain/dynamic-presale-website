import { useState, useEffect } from "react";
import presaleAbi from '../abi/presale.json';
import tokenAbi from '../abi/token.json';
import { getMultiCall, getWeb3, getWeb3Contract } from "@utils/contractHelper";
import { ADD_AMOUNT } from "@utils/constant";
import { useAppKitAccount } from "@reown/appkit/react";
import { ethers } from "ethers";


export const useCommonStats = (updater, presale_address = "", chainId = "") => {
    const [stats, setStats] = useState({
        price: 0,
        tokenSold: 0,
        usdtRaised: 0,
        totalRaised: 0,
        perRaised: 0,
        loading: true,
        minBuy: 0,
        maxBuy: 0,
        claimstatus: false,
        percentageRaised: 0,
    });

    useEffect(() => {
        const fetch = async () => {

            try {

                const presaleContract = getWeb3Contract(presaleAbi, presale_address, chainId);

                let data = await getMultiCall([
                    presaleContract.methods.saleprice(), //0
                    presaleContract.methods.totalTokensSold(), //1
                    presaleContract.methods.min_contribution(), //2
                    presaleContract.methods.max_contribution(), //3
                    presaleContract.methods.claimStatus(), //4
                    presaleContract.methods.totalToken(), //5
                    presaleContract.methods.totalusdsold(), //6
                ], chainId)

                const totalRaised = parseFloat(data[1] / Math.pow(10, 18)) + parseFloat(ADD_AMOUNT);
                const targetAmountNumber = parseFloat(data[5] / Math.pow(10, 18));
                const percentageRaised = parseFloat(totalRaised) > 0 ? ((totalRaised / targetAmountNumber) * 100).toFixed(2) : 0;


                let price = data[0] / Math.pow(10, 18);
                let tokenSold = data[1] / Math.pow(10, 18);


                setStats({
                    price,
                    tokenSold: tokenSold,
                    minBuy: data[2] / Math.pow(10, 18),
                    maxBuy: data[3] / Math.pow(10, 18),
                    loading: false,
                    claimstatus: data[4],
                    percentageRaised,
                    totalRaised: data[6] / Math.pow(10, 18)
                })
            }
            catch (err) {
                console.log(err.message);
            }
        }


        if (presale_address && chainId) {
            fetch();
        }
        else {
            setStats({
                price: 0,
                tokenSold: 0,
                usdtRaised: 0,
                totalRaised: 0,
                perRaised: 0,
                loading: true,
                minBuy: 0,
                maxBuy: 0,
                claimstatus: false,
                percentageRaised: 0,
            })
        }
        // eslint-disable-next-line
    }, [updater, chainId, presale_address]);

    return stats;
}


export const useAccountStats = (presale_address = "", chainId = "", currencyInfo = {}) => {
    const { address } = useAppKitAccount();
    const [stats, setStats] = useState({
        balance: 0,
        allowance: 0
    });

    useEffect(() => {
        const fetch = async () => {
            try {
                let balance = 0;
                let allowance = 0;


                const web3 = getWeb3(chainId);

                // If it's native (e.g. ETH, BNB)
                if (currencyInfo.address === "0x0000000000000000000000000000000000000000") {
                    const rawBalance = await web3.eth.getBalance(address);
                    balance = parseFloat(ethers.utils.formatEther(rawBalance));
                    allowance = 100000000000000;
                }
                // If it's an ERC-20 token
                else {
                    const tokenContract = getWeb3Contract(tokenAbi, currencyInfo.address, chainId);
                    const rawBalance = await tokenContract.methods.balanceOf(address).call();
                    const rawAllowance = await tokenContract.methods.allowance(address, presale_address).call();

                    balance = parseFloat(ethers.utils.formatUnits(rawBalance, currencyInfo.decimals));
                    allowance = parseFloat(ethers.utils.formatUnits(rawAllowance, currencyInfo.decimals));
                }


                setStats({ balance, allowance });
            } catch (err) {
                console.error("useAccountStats error:", err.message);
                setStats({
                    balance: 0,
                    allowance: 0
                });
            }
        };

        if (address && presale_address && chainId) {
            fetch();
        } else {
            setStats({
                balance: 0,
                allowance: 0
            });
        }
    }, [address, presale_address]);

    return stats;
};


export const useAdminStats = (presale_address = "", chainId = "") => {
    const { address } = useAppKitAccount();
    const [stats, setStats] = useState({
        owner: "",
        treasury_wallet: "",
        sale_status: "",
        claim_status: "",
        saleprice: "",
        min_contribution: "",
        max_contribution: "",
        endtime: ""
    });

    useEffect(() => {
        const fetch = async () => {
            try {
                const presaleContract = getWeb3Contract(presaleAbi, presale_address, chainId);

                let data = await getMultiCall([
                    presaleContract.methods.owner(), //0
                    presaleContract.methods.claimStatus(), //1
                    presaleContract.methods.saleStatus(), //2
                    presaleContract.methods.treasuryWallet(), //3
                    presaleContract.methods.min_contribution(), //4
                    presaleContract.methods.max_contribution(), //5
                    presaleContract.methods.endtime(), //6
                    presaleContract.methods.saleprice(), //7
                ], chainId)

                setStats({
                    owner: data[0],
                    treasury_wallet: data[3],
                    sale_status: data[2],
                    claim_status: data[1],
                    saleprice: data[7] / Math.pow(10, 18),
                    min_contribution: data[4] / Math.pow(10, 18),
                    max_contribution: data[5] / Math.pow(10, 18),
                    endtime: data[6]
                });
            } catch (err) {
                console.error("useAccountStats error:", err.message);
                setStats({
                    owner: "",
                    treasury_wallet: "",
                    sale_status: "",
                    claim_status: ""
                });
            }
        };

        if (address && presale_address && chainId) {
            fetch();
        } else {
            setStats({
                owner: "",
                treasury_wallet: "",
                sale_status: "",
                claim_status: "",
                saleprice: "",
                min_contribution: "",
                max_contribution: "",
                endtime: ""
            });
        }
    }, [address, presale_address, chainId]);

    return stats;
};



