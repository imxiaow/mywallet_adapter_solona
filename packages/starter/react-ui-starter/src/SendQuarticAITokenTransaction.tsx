import { Button, TextField } from '@material-ui/core';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, Transaction, TransactionSignature, PublicKey, sendAndConfirmTransaction} from '@solana/web3.js';
import { FC, useCallback, useState, ChangeEvent } from 'react';
import { useNotify } from './notify';
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Wallet } from '@solana/wallet-adapter-wallets';


const stylesTransactionButton = {
    container: {
        height: '6vh',
        marginLeft: '25vw',
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

export interface SendQuarticAITokenTransactionProps {
    myWallet: Wallet[];
}

export const SendQuarticAITokenTransaction: FC<SendQuarticAITokenTransactionProps> = ({
    myWallet,
}) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [AITokenAmount, setAITokenAmount] = useState(100000000); // default is 100000000
    const [ToWalletAddress, setToWalletAddress] =useState('');
    const [userCurWalletSecurityKey, setUserCurWalletSecurityKey] = useState([])

    const notify = useNotify();

    const onChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
        setAITokenAmount(Number(event.currentTarget.value))
    }

    const onChangeWalletAddress = (event: ChangeEvent<HTMLInputElement>) => {
        setToWalletAddress(event.currentTarget.value)
    }

    const onChangeSecurityKey= (event: ChangeEvent<HTMLInputElement>) => {
        var myArray = JSON.parse("[" + event.currentTarget.value + "]")
        setUserCurWalletSecurityKey(myArray)
    }

    var quarticAITokenPubKey = new PublicKey("9tjgbaSSEyPgRgTLVaTzzZR46xPq1jU6d7fB217czRdK");

    const onClick = useCallback(async () => {
        if (!publicKey) {
            notify('error', 'Wallet not connected!');
            return;
        }

        if(ToWalletAddress === ''){
            notify('error', 'Destination Wallet not entered!');
            return;
        }
        
        if(userCurWalletSecurityKey.length === 0){
            notify('error', 'Security Key not provide!');
            return;
        }

        const DEMO_WALLET_SECRET_KEY = new Uint8Array(userCurWalletSecurityKey);

        var fromWallet = Keypair.fromSecretKey(DEMO_WALLET_SECRET_KEY);
        var toWalletPubKey = new PublicKey(ToWalletAddress)

        let signature: TransactionSignature = '';

        try {
            var QuarticToken = new Token(
                connection, 
                quarticAITokenPubKey,
                TOKEN_PROGRAM_ID,
                fromWallet,
            )

            var fromTokenAccount = await QuarticToken.getOrCreateAssociatedAccountInfo(
                publicKey
            )
            var toTokenAccount = await QuarticToken.getOrCreateAssociatedAccountInfo(
                toWalletPubKey
            )

            // Add token transfer instructions to transaction
            var transaction = new Transaction().add(
                    Token.createTransferInstruction(
                        TOKEN_PROGRAM_ID,
                        fromTokenAccount.address,
                        toTokenAccount.address,
                        fromWallet.publicKey,
                        [],
                        AITokenAmount
                    )
            );
            // Sign transaction, broadcast, and confirm
            signature = await sendAndConfirmTransaction(
                connection,
                transaction,
                [fromWallet]
            );
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
            <h3 style={stylesTransactionButton.containerText}>Send Quartic AI Token: </h3>
            <TextField defaultValue={AITokenAmount} style={stylesTransactionButton.containerInput} color="primary" id="outlined-basic" label="Amount" onChange={onChangeAmount}  variant="outlined" />
            <br/>
            <TextField style={stylesTransactionButton.containerInputLonger} color="primary" id="outlined-basic" label="Wallet Address" onChange={onChangeWalletAddress}  variant="outlined" />
            <br/>
            <TextField style={stylesTransactionButton.containerInputLonger} color="primary" id="outlined-basic" label="Security Key" onChange={onChangeSecurityKey}  variant="outlined" />
            <br/>
            <Button style={stylesTransactionButton.container} variant="contained" color="primary" onClick={onClick} disabled={!publicKey}>
                Send Quartic AI Token to Wallet Address (devnet)
            </Button>
        </div>
    );
};
