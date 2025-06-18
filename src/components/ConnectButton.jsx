import React from 'react'
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { trimAddress } from '@utils/helper';


export default function ConnectButton({ className , text = 'Connect Wallet' , ...props }) {
    const { open } = useAppKit();
    const { address, isConnected } = useAppKitAccount();

    return (
        address && isConnected ? (
            <>
                <button {...props} onClick={() => open()} type="button" className={className} >
                    {trimAddress(address)}
                </button>
            </>
        ) : (
            <button {...props} onClick={() => open()} type="button" className={className} >
                {text}
            </button >
        )

    )
}