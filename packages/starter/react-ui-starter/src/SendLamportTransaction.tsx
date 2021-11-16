import { Button, TextField } from '@material-ui/core';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction, TransactionSignature, PublicKey } from '@solana/web3.js';
import { FC, useCallback, useState, ChangeEvent } from 'react';
import { useNotify } from './notify';
import { Wallet } from '@solana/wallet-adapter-wallets';


const stylesTransactionButton = {
    container: {
        marginLeft: '25vw',
        height: '6vh'
        
    },
    containerInput: {
        marginBottom: '2vh',
        marginLeft: '25vw',
    },
    containerInputLonger:{
        marginBottom: '2vh',
        marginLeft: '25vw',
        width:'50vw'
    },
    containerText:{
        color: 'black',
        marginLeft: '25vw',
    }
};

export interface SendLamportTransactionProps {
    myWallet: Wallet[];
}

export const SendLamportTransaction: FC<SendLamportTransactionProps> = ({
    myWallet,
}) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [lamportAmount, setLamportAmount] = useState(1); // default is 1
    const [ToWalletAddress, setToWalletAddress] =useState('');


    const notify = useNotify();

    const onChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
        setLamportAmount(Number(event.currentTarget.value))
    }

    const onChangeWalletAddress = (event: ChangeEvent<HTMLInputElement>) => {
        setToWalletAddress(event.currentTarget.value)
    }

    const onClick = useCallback(async () => {
        if (!publicKey) {
            notify('error', 'Wallet not connected!');
            return;
        }

        if(ToWalletAddress === ''){
            notify('error', 'Destination Wallet not entered!');
            return;
        }
        var ToWalletPubKey = new PublicKey(ToWalletAddress)
        let signature: TransactionSignature = '';

        try {
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: ToWalletPubKey,
                    lamports: lamportAmount,
                })
            );

            signature = await sendTransaction(transaction, connection);
            notify('info', 'Transaction sent:', signature);

            await connection.confirmTransaction(signature, 'processed');
            notify('success', 'Transaction successful!', signature);
        } catch (error: any) {
            notify('error', `Transaction failed! ${error?.message}`, signature);
            return;
        }
    }, [publicKey, notify, connection, sendTransaction]);


    return (
        <div>
            <h3 style={stylesTransactionButton.containerText}>Send Lamports: </h3>
            <TextField defaultValue={lamportAmount} style={stylesTransactionButton.containerInput} color="primary" id="outlined-basic" onChange={onChangeAmount} label="Amount" variant="outlined" />
            <br/>
            <TextField style={stylesTransactionButton.containerInputLonger} color="primary" id="outlined-basic" onChange={onChangeWalletAddress} label="Wallet Address" variant="outlined" />
            <br/>
            {/* <TextField color="primary" id="filled-basic" label="lamport" variant="filled" />
            <TextField color="primary" id="standard-basic" label="lamport" variant="standard" /> */}
            <Button style={stylesTransactionButton.container} variant="contained" color="primary" onClick={onClick} disabled={!publicKey}>
                Send lamports to Wallet Address (devnet)
            </Button>
        </div>

    );
};
