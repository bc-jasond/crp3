"use client";

import {ChakraProviders} from "@/app/chakra-providers";
import theme from "@/app/chakra-theme";
import {ColorModeScript} from "@chakra-ui/react";
import {Config, DAppProvider, Polygon} from "@usedapp/core";
import { providers } from "ethers";
import {Inter} from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const useDappConfig: Config = {
  readOnlyChainId: Polygon.chainId,
  readOnlyUrls: {
    [Polygon.chainId]: new providers.AlchemyWebSocketProvider('matic', "dZK6Z73kwwZWeJbol0U09SHT4WYTh8HH"),
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProviders>
          <DAppProvider config={useDappConfig}>
            {children}
          </DAppProvider>
        </ChakraProviders>
      </body>
    </html>
  );
}
