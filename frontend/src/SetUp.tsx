import * as React from "react";
import {useState} from "react";
import {Button, InputGroup, Text} from "@blueprintjs/core";
import {Intent} from "@blueprintjs/core/lib/esm/common/intent";
import Axios from "axios";
// import { Example, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";

export const SetUp = () => {
    const [bobPrivKey, setBobPrivKey] = useState("0x16387146e0be3b7da18fc40e3c231c4d320d0e087c310ac49de1c178dde54398");
    const [alicePrivKey, setAlicePrivKey] = useState("0xb6bb217955486f4cd9b2662fa909b0d4a207c8dae6f148be5e7ca94ed3fbdf0c");
    const [message, setMessage] = useState("message");
    const [fragments, setFragments] = useState("");
    const [error, setError] = useState("");

    const setupButtonHandler = async () => {

        const url = (process.env.NODE_ENV === 'production' ? "https" : "http") + "://167.99.255.241:5000/setup";
        const data = {
            "bobPriv": bobPrivKey,
            "alicePriv": alicePrivKey
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
            setFragments(JSON.stringify(response.data));
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
            <InputGroup placeholder={"privKey"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setBobPrivKey(event.target.value)}
                        value={bobPrivKey}
            />
            <br/>
            <br/>
            <Button intent={Intent.PRIMARY}
                    onClick={setupButtonHandler}>set up</Button>
            <br/>
            {fragments && (<Text ellipsize={true}>{fragments}</Text>)}
            {error && (<p style={{ color: "red" }}> error: {error}</p>)}
        </div>
    );
};