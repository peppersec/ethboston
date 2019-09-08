import * as React from "react";
import {useState} from "react";
import {Button, InputGroup, Text, TextArea} from "@blueprintjs/core";
import {Intent} from "@blueprintjs/core/lib/esm/common/intent";
import Axios from "axios";

// "localhost:5000"
// "167.99.255.241:5000"
const baseUrl = "localhost:5000"
export const Decryptor = () => {
    const [alicePubKey, setAlicePubKey] = useState("03edd6db086fc9d45194253ad64decc24a699ee1bd498dabdcfdfbb7ecd3e94cfb");
    const [aliceVerKey, setAliceVerKey] = useState("03edd6db086fc9d45194253ad64decc24a699ee1bd498dabdcfdfbb7ecd3e94cfb");
    const [bobPrivKey, setBobPrivKey] = useState("03edd6db086fc9d45194253ad64decc24a699ee1bd498dabdcfdfbb7ecd3e94cfb");
    const [encryptedMessage, setEncryptedMessage] = useState();
    const [capsule, setCapsule] = useState();
    const [kfrags, setKfrags] = useState();
    
    const [result, setResult] = useState("");
    const [error, setError] = useState("");

    const decryptButtonHandler = async () => {

        const url = (process.env.NODE_ENV === 'production' ? "https" : "http") + "://"+baseUrl+"/de";
        const data = {
            "alices_public_key": alicePubKey, 
            "alices_verifying_key": aliceVerKey,
            "ciphertext": encryptedMessage,
            "bobs_private_key": bobPrivKey,
            "kfrags": kfrags,
            "capsule": capsule
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
            setError("");
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
            <p> Bob privk </p>
            <InputGroup placeholder={"private key"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setBobPrivKey(event.target.value)}
                        value={bobPrivKey}
            />
            <br/>
            <p> Alice pubk </p>
            <InputGroup placeholder={"pub key"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAlicePubKey(event.target.value)}
                        value={alicePubKey}
            />
            <br/>
            <p> Alice verk </p>
            <InputGroup placeholder={"pub key"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAliceVerKey(event.target.value)}
                        value={aliceVerKey}
            />
            <br/>
            <p> kfrags </p>
            <InputGroup placeholder={"capsule"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setKfrags(event.target.value)}
                        value={kfrags}
            />

            <br/>
            <p> capsule </p>
            <InputGroup placeholder={"capsule"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCapsule(event.target.value)}
                        value={capsule}
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