import * as React from "react";
import {useState} from "react";
import {Button, InputGroup, Text} from "@blueprintjs/core";
import {Intent} from "@blueprintjs/core/lib/esm/common/intent";
import Axios from "axios";
// import { Example, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";

export const Encryptor = () => {
    const [publicKey, setPublicKey] = useState("a6bbc4aedd8019a67c9f9e4267c138062aed491070129faf8b108eacd0a6bb9f1d133b446a6904026680e5bfd6041cc95a4f3310ed1743de6157cc4fed796c66");
    const [message, setMessage] = useState("message");
    const [result1, setResult1] = useState("");
    const [result2, setResult2] = useState("");
    const [error, setError] = useState("");

    const encryptButtonHandler = async () => {

        const url = process.env.NODE_ENV === 'production'
            ? "https://167.99.255.241:5000/encrypt"
            : "localhost:5000/encrypt";
        const data = {
            "recipient": publicKey,
            "data": message
        };
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*"
            }
        };

        try {
            const response = await Axios.post(url, data, axiosConfig);
            console.log(response);
            setResult1(JSON.stringify(response.data.capsule));
            setResult2(JSON.stringify(response.data.ciphertext));
        } catch (e) {
            setError(e.message);
        }

    };

    return (
        <div>
            <h2> Encryptor </h2>
            <p> Recipient </p>
            <InputGroup placeholder={"publicKey"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPublicKey(event.target.value)}
                        value={publicKey}
            />
            <br/>
            <p> Message </p>
            <InputGroup placeholder={"enter message"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setMessage(event.target.value)}
                        value={message}
            />
            <br/>
            <Button intent={Intent.PRIMARY}
                    onClick={encryptButtonHandler}>encrypt</Button>
            <br/>
            {result1 && (<Text ellipsize={true}>{result1}</Text>)}
            {result2 && (<Text ellipsize={true}>{result2}</Text>)}
            {error && (<p style={{ color: "red" }}> error: {error}</p>)}
        </div>
    );
};