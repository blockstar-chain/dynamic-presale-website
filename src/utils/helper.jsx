import moment from 'moment'
import { ALL_NETWORKS, DEFAULT_CHAIN_ID, PINATA_JWT } from './constant';
import axios from 'axios';

export const trimAddress = (addr) => {
    try {
        if (!addr) return '';
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    }
    catch (err) {
        return addr;
    }
}


export function formatPrice(
    value,
    decimals = 4
) {
    if (isNaN(value)) return '0';

    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
    }).format(value);
}

export const formatDate = (timestamp, format = '') => {
    try {
        if (format) {
            return moment(timestamp * 1000).format(format);
        } else {
            return moment(timestamp * 1000).format('DD-MM-YYYY');
        }
    } catch (err) {
        console.error(err.message);
        return false;
    }
};

export const getDaysLeft = (timestamp) => {
    const now = Date.now(); // current time in milliseconds
    const target = timestamp * 1000; // assuming input timestamp is in seconds

    const timeDiff = target - now;

    if (timeDiff <= 0) return 0;

    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysLeft;
};

export const getCurrentChainInfo = (chainId = DEFAULT_CHAIN_ID) => {
    return ALL_NETWORKS[chainId] || ALL_NETWORKS[DEFAULT_CHAIN_ID];
};


export const switchToChain = async (chainData) => {
    try {
        // Request MetaMask to switch to the specified chain
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${parseInt(chainData.chainId, 10).toString(16)}` }] // Convert chainId to hexadecimal
        });
        console.log(`Switched to chain with ID: ${chainData.chainId}`);
        return true;
    } catch (error) {
        if (error.code === 4902) {
            // This error code indicates the chain is not available in MetaMask
            if (chainData) {
                try {
                    // Add the chain to MetaMask
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: `0x${parseInt(chainData.chainId, 10).toString(16)}`,
                                chainName: chainData.name,
                                nativeCurrency: {
                                    name: chainData.name,
                                    symbol: chainData.symbol,
                                    decimals: 18
                                },
                                rpcUrls: [chainData.rpc],
                                blockExplorerUrls: [chainData.explorer]
                            }
                        ]
                    });
                    return true;
                } catch (addError) {
                    console.error('Failed to add the chain:', addError);
                    return false;
                }
            } else {
                console.error('Chain is not available in MetaMask and no data provided to add it.');
                return false;
            }
        } else {
            console.error('Failed to switch chain:', error);
            return false;
        }
    }
}

export const verifyToken = async (token) => {
    try {
        const requestData = new FormData();
        requestData.append('token', token);
        const res = await axios.post(`${BACKEND_API}verify-token/`, requestData);
        return res.data;
    } catch (err) {
        return false;
    }
}


export const uploadFileIPFS = async (file = [] , name = '') => {
    try {
        const formData = new FormData();
        formData.append('file', file, `${name}.png`);

        const metadata = JSON.stringify({
            name: name,
        });
        formData.append("pinataMetadata", metadata);

        const options = JSON.stringify({
            cidVersion: 0,
        });
        formData.append("pinataOptions", options);

        const res = await fetch(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${PINATA_JWT}`,
                },
                body: formData,
            }
        );

        if (!res.ok) {
            return { error: "Failed to upload file.Please try again." };
        }

        const resData = await res.json();
        if (!resData || !resData.IpfsHash) {
            return { error: "Failed to upload file.Please try again." };
        }

        return { error: 'OK', ipfs: resData.IpfsHash };
    }
    catch (err) {
        console.log(err.message);
        return { error: err.message };
    }
}

export const uploadImageFromUrlToIPFS = async (imageUrl) => {
    try {
        // Fetch the image from the URL
        const response = await fetch(imageUrl);
        if (!response.ok) {
            return { error: 'Failed to fetch image from URL.' };
        }

        // Convert to blob
        const blob = await response.blob();

        // Optional: extract file name from URL
        const fileName = imageUrl.split('/').pop()?.split('?')[0] || 'image.jpg';

        // Convert blob to a File object (for pinata metadata)
        const file = new File([blob], fileName, { type: blob.type });

        // Prepare form data
        const formData = new FormData();
        formData.append('file', file);

        const metadata = JSON.stringify({
            name: file.name,
        });
        formData.append("pinataMetadata", metadata);

        const options = JSON.stringify({
            cidVersion: 0,
        });
        formData.append("pinataOptions", options);

        // Upload to Pinata
        const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${PINATA_JWT}`, // make sure PINATA_JWT is set
            },
            body: formData,
        });

        if (!res.ok) {
            return { error: "Failed to upload file. Please try again." };
        }

        const resData = await res.json();
        if (!resData || !resData.IpfsHash) {
            return { error: "Failed to upload file. Please try again." };
        }

        return { error: 'OK', ipfs: resData.IpfsHash };
    } catch (err) {
        console.error(err.message);
        return { error: err.message };
    }
};


export const uploadMetadataToIPFS = async (metadata) => {
    try {
        const res = await axios.post(
            'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            metadata,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${PINATA_JWT}`,
                },
            }
        );

        const ipfsHash = res.data.IpfsHash;
        return { error: 'OK', ipfs: ipfsHash };
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
};


export function dataURLToBlob(dataUrl) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

