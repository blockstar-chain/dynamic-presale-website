import { DEFAULT_CHAIN_ID } from '@utils/constant'
import { providers } from 'ethers'
import { useMemo } from 'react'
import { useConnectorClient } from 'wagmi'

export function clientToSigner(client) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}

/** Hook to convert a Viem Client to an ethers.js Signer. */
export function useEthersSigner(chainId = DEFAULT_CHAIN_ID) {
  const { data: client } = useConnectorClient({ chainId })
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}