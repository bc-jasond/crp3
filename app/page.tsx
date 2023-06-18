"use client";

import {Box, Button, Heading, Text, Toast, useToast, VStack} from "@chakra-ui/react";
import {formatEther, formatUnits} from "@ethersproject/units";
//import {useCoingeckoPrice} from "@usedapp/coingecko";
import {useConfig, useEtherBalance, useEthers, useGasPrice, useTokenBalance} from '@usedapp/core'
import {BigNumberish} from "ethers";

import Head from "next/head";
import React, {useEffect, useState} from "react";
import recurringPaymentABI from "../lib/RecurringPayment.abi.json";
import { RECURRING_PAYMENT_CONTRACT } from "../constants";

const ConnectButton = () => {
  const { account, deactivate, activateBrowserWallet } = useEthers()
  // 'account' being undefined means that we are not connected.
  if (account) {
    return <Button onClick={() => deactivate()}>Disconnect</Button>
  }
  return <Button onClick={() => activateBrowserWallet()}>Connect</Button>
}
export default function Home() {
  const toast = useToast()
  const [errorInternal, setErrorInternal] = useState<string>();
  const { error, account, chainId } = useEthers()
  const { readOnlyUrls = {} } = useConfig()
  // gas token - MATIC
  const balance = useEtherBalance(account)
  // https://polygonscan.com/token/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063
  // PoS means Proof-of-Stake
  // (PoS) Dai Stablecoin
  const DAI_ADDRESS = '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'
  const daiBalance = useTokenBalance(DAI_ADDRESS, account)
  // https://polygonscan.com/token/0x2791bca1f2de4661ed88a30c99a7a9449aa84174
  // (PoS) USD Coin
  const USDC_ADDRESS = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
  const usdcBalance = useTokenBalance(USDC_ADDRESS, account)
  // https://polygonscan.com/token/0xc2132d05d31c914a87c6611c10748aeb04b58e8f
  // (PoS) Tether USD
  const USDT_ADDRESS = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
  const usdtBalance = useTokenBalance(USDT_ADDRESS, account)
  // https://polygonscan.com/token/0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6
  // Wrapped BTC
  const WBTC_ADDRESS = '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6'
  const wbtcBalance = useTokenBalance(WBTC_ADDRESS, account)
  // https://polygonscan.com/token/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619
  // Wrapped ETH
  const WETH_ADDRESS = '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'
  const wethBalance = useTokenBalance(WETH_ADDRESS, account)
  
  const gasPrice = useGasPrice()
  //const maticPrice = useCoingeckoPrice('matic', 'usd')
  const unsupportedNetworkErrorId = 'unsupported-network-error'
  if (error?.name === 'ChainIdError' && !toast.isActive(unsupportedNetworkErrorId)) {
    toast({
      id: unsupportedNetworkErrorId,
      title: 'Unsupported Network',
      description: "Switch to Polygon Mainnet.",
      status: 'error',
      duration: null,
      isClosable: false,
    })
  }
  if (!error && toast.isActive(unsupportedNetworkErrorId)) {
    toast.close(unsupportedNetworkErrorId)
  }
  
  return (
    <>
      <Head>
        <title>Crypto Recurring Payments</title>
      </Head>

      <Heading display="flex" justifyContent="center" s="h3" my={4}>
        Crypto Recurring Payments
      </Heading>
      <VStack>
        <ConnectButton />
        {account && (
          <Box mb={0} p={4} w="" borderWidth="1px" borderRadius="lg">
            <Heading my={4} fontSize="xl">
              Account info
            </Heading>
            <Text>{account}</Text>
            <Text>{balance ? formatEther(balance as BigNumberish) : 0} MATIC gas: {gasPrice ? formatEther(gasPrice) : '?'}</Text>
            <Text>{usdcBalance ? formatUnits(usdcBalance, 6) : 0} USDC</Text>
            <Text>{usdtBalance ? formatUnits(usdtBalance, 6) : 0} USDT</Text>
            <Text>{usdtBalance ? formatUnits(usdtBalance, 18) : 0} WETH</Text>
            <Text>{usdtBalance ? formatUnits(usdtBalance, 18) : 0} WBTC</Text>
            <Text>{daiBalance ? formatUnits(daiBalance, 18) : 0} DAI</Text>
          </Box>
        )}
      </VStack>
    </>
  );
}
