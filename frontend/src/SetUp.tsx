import * as React from "react";
import {useState} from "react";
import {Button, InputGroup, Text} from "@blueprintjs/core";
import {Intent} from "@blueprintjs/core/lib/esm/common/intent";
import Axios from "axios";
// import { Example, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";
// "localhost:5000"
// "167.99.255.241:5000"
const baseUrl = "localhost:5000"

export const SetUp = () => {
    const [bobPrivKey, setBobPrivKey] = useState("0x16387146e0be3b7da18fc40e3c231c4d320d0e087c310ac49de1c178dde54398");
    const [alicePrivKey, setAlicePrivKey] = useState("0xb6bb217955486f4cd9b2662fa909b0d4a207c8dae6f148be5e7ca94ed3fbdf0c");
    const [m, setM] = useState("2");
    const [n, setN] = useState("3");
    const [kfrags, setKfrags] = useState("");
    const [alicePubKey, setAlicePubKey] = useState("");
    const [alicesSigningKey, setAlicesSigningKey] = useState("");
    const [alicesVerifyingKey, setAlicesVerifyingKey] = useState("");
    const [error, setError] = useState("");

    const setupButtonHandler = async () => {

        const url = (process.env.NODE_ENV === 'production' ? "https" : "http") + "://"+baseUrl+"/setup";
        const data = {
            "bobs_private_key": bobPrivKey,
            "alices_private_key": alicePrivKey,
            "m": m,
            "n": n
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
            setKfrags(JSON.stringify(response.data.kfrags));
            setAlicePubKey(JSON.stringify(response.data.alices_public_key));
            setAlicesSigningKey(JSON.stringify(response.data.alices_signing_key));
            setAlicesVerifyingKey(JSON.stringify(response.data.alices_verifying_key));
            setError("");
        } catch (e) {
            setError(e.message);
        }

    };

    return (
        <div>
            <h2> SetUp </h2>
            <p> Sender (Alice) </p>
            <InputGroup placeholder={"privKey"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAlicePrivKey(event.target.value)}
                        value={alicePrivKey}
            />
            <br/>
            <p> Recipient (Bob) </p>
            <InputGroup placeholder={"pubKey"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setBobPrivKey(event.target.value)}
                        value={bobPrivKey}
            />
            <br/>
            <p>M</p>
            <InputGroup placeholder={"pubKey"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setM(event.target.value)}
                        value={m}
            />
            <br/>
            <p>N</p>
            <InputGroup placeholder={"pubKey"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setN(event.target.value)}
                        value={n}
            /><br/>
            <Button intent={Intent.PRIMARY}
                    onClick={setupButtonHandler}>set up</Button>
            <br/>
            <Text>kfrags: </Text>{kfrags && (<Text ellipsize={true}>{kfrags}</Text>)}
            <Text>alicePubKey: </Text>{alicePubKey && (<Text ellipsize={true}>{alicePubKey}</Text>)}
            <Text>alicesSigningKey: </Text>{alicesSigningKey && (<Text ellipsize={true}>{alicesSigningKey}</Text>)}
            <Text>alicesVerifyingKey: </Text>{alicesVerifyingKey && (<Text ellipsize={true}>{alicesVerifyingKey}</Text>)}
            {error && (<p style={{ color: "red" }}> error: {error}</p>)}
        </div>
    );
};