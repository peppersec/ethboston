import * as React from "react";
import {useState} from "react";
import {Button, InputGroup, Text, TextArea} from "@blueprintjs/core";
import {Intent} from "@blueprintjs/core/lib/esm/common/intent";
import Axios from "axios";


export const Decryptor = () => {
    const [privateKey, setPrivateKey] = useState();
    const [encryptedMessage, setEncryptedMessage] = useState();
    const [capsule, setCapsule] = useState();
    const [fragments, setFragments] = useState();
    const [result, setResult] = useState("");
    const [error, setError] = useState("");

    const decryptButtonHandler = async () => {

        const url = (process.env.NODE_ENV === 'production' ? "https" : "http") + "://167.99.255.241:5000/decrypt";
        const data = {
            "recipient": privateKey,
            "data": encryptedMessage,
            "capsule": capsule,
            "fragments": fragments
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
            setResult(JSON.stringify(response.data));
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <div>
            <h2> Decryptor </h2>
            <p> Encrypted Message </p>
            <InputGroup placeholder={"encrypted message"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEncryptedMessage(event.target.value)}
                        value={encryptedMessage}
            />
            <br/>
            <p> pk </p>
            <InputGroup placeholder={"private key"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPrivateKey(event.target.value)}
                        value={privateKey}
            />
            <br/>
            <p> capsule </p>
            <InputGroup placeholder={"capsule"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCapsule(event.target.value)}
                        value={capsule}
            />

            <br/>
            <p> fragments </p>
            <InputGroup placeholder={"fragments"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFragments(event.target.value)}
                        value={fragments}
            />

            <br/>
            <Button intent={Intent.PRIMARY}
                    onClick={decryptButtonHandler}>decrypt</Button>
            <br/>
            {result &&(<Text>{result}</Text>)}
            {error && (<p style={{ color: "red" }}> error: {error}</p>)}
        </div>
    );
};