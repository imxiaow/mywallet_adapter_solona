import { Button, TextField } from '@material-ui/core';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction, TransactionSignature, PublicKey } from '@solana/web3.js';
import { FC, useCallback, useState, ChangeEvent } from 'react';
import { useNotify } from './notify';
import { Wallet } from '@solana/wallet-adapter-wallets';
import {AccountLayout, Token, TOKEN_PROGRAM_ID} from '@solana/spl-token';
import { TokenSwap } from '@solana/spl-token-swap';

const stylesSwapButton = {
    container: {
        marginLeft: '25vw',
        height: '6vh',
        marginTop: '5vh'
    },
};

export const TOKEN_SWAP_PROGRAM_ID: PublicKey = new PublicKey(
    'SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8',
);

export interface QAISwapProps {
    myWallet: Wallet[];
}

export const QAISwap: FC<QAISwapProps> = ({
    myWallet,
}) => {

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const notify = useNotify();

    // // The following globals are created by `createTokenSwap` and used by subsequent tests
    // // Token swap
    // let tokenSwap: TokenSwap;
    // // authority of the token and accounts
    // let authority: PublicKey;
    // // bump seed used to generate the authority public key
    // let bumpSeed: number;
    // // owner of the user accounts
    // let owner: Account;
    // // Token pool
    // let tokenPool: Token;
    // let tokenAccountPool: PublicKey;
    // let feeAccount: PublicKey;
    // // Tokens swapped
    // let mintA: Token;
    // let mintB: Token;
    // let tokenAccountA: PublicKey;
    // let tokenAccountB: PublicKey;


    // // Hard-coded fee address, for testing production mode
    // const SWAP_PROGRAM_OWNER_FEE_ADDRESS =
    // process.env.SWAP_PROGRAM_OWNER_FEE_ADDRESS;

    // // Pool fees
    // const TRADING_FEE_NUMERATOR = 25;
    // const TRADING_FEE_DENOMINATOR = 10000;
    // const OWNER_TRADING_FEE_NUMERATOR = 5;
    // const OWNER_TRADING_FEE_DENOMINATOR = 10000;
    // const OWNER_WITHDRAW_FEE_NUMERATOR = SWAP_PROGRAM_OWNER_FEE_ADDRESS ? 0 : 1;
    // const OWNER_WITHDRAW_FEE_DENOMINATOR = SWAP_PROGRAM_OWNER_FEE_ADDRESS ? 0 : 6;
    // const HOST_FEE_NUMERATOR = 20;
    // const HOST_FEE_DENOMINATOR = 100;

    // // Initial amount in each swap token
    // let currentSwapTokenA = 1000000;
    // let currentSwapTokenB = 1000000;
    // let currentFeeAmount = 0;


    // // Swap instruction constants
    // // Because there is no withdraw fee in the production version, these numbers
    // // need to get slightly tweaked in the two cases.
    // const SWAP_AMOUNT_IN = 100000;
    // const SWAP_AMOUNT_OUT = SWAP_PROGRAM_OWNER_FEE_ADDRESS ? 90661 : 90674;
    // const SWAP_FEE = SWAP_PROGRAM_OWNER_FEE_ADDRESS ? 22273 : 22277;
    // const HOST_SWAP_FEE = SWAP_PROGRAM_OWNER_FEE_ADDRESS
    // ? Math.floor((SWAP_FEE * HOST_FEE_NUMERATOR) / HOST_FEE_DENOMINATOR)
    // : 0;
    // const OWNER_SWAP_FEE = SWAP_FEE - HOST_SWAP_FEE;

    // // Pool token amount minted on init
    // const DEFAULT_POOL_TOKEN_AMOUNT = 1000000000;
    // // Pool token amount to withdraw / deposit
    // const POOL_TOKEN_AMOUNT = 10000000;


    // // createTokenSwap:








    const onClick = useCallback(async () => {
        if (!publicKey) {
            notify('error', 'Wallet not connected!');
            return;
        }

        // try {
        //     const transaction = new Transaction().add(
        //         SystemProgram.transfer({
        //             fromPubkey: publicKey,
        //             toPubkey: ToWalletPubKey,
        //             lamports: lamportAmount,
        //         })
        //     );

        //     signature = await sendTransaction(transaction, connection);
        //     notify('info', 'Transaction sent:', signature);

        //     await connection.confirmTransaction(signature, 'processed');
        //     notify('success', 'Transaction successful!', signature);
        // } catch (error: any) {
        //     notify('error', `Transaction failed! ${error?.message}`, signature);
        //     return;
        // }
    }, [publicKey, notify, connection, sendTransaction]);



    return (
        <div>
            <Button style={stylesSwapButton.container} variant="contained" color="primary" onClick={onClick} disabled={!publicKey}>
                Swap
            </Button>


        </div>
    )
}