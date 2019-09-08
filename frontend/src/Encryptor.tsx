import * as React from "react";
import {useState} from "react";
import {Button, InputGroup, Text} from "@blueprintjs/core";
import {Intent} from "@blueprintjs/core/lib/esm/common/intent";
import Axios from "axios";
// import { Example, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";
// "localhost:5000"
// "167.99.255.241:5000"
const baseUrl = "localhost:5000"
export const Encryptor = () => {
    const [alicePubKey, setAlicePubKey] = useState("03edd6db086fc9d45194253ad64decc24a699ee1bd498dabdcfdfbb7ecd3e94cfb");
    const [message, setMessage] = useState("message");
    const [capsule, setCapsule] = useState("");
    const [cypertext, setCypertext] = useState("");
    const [error, setError] = useState("");

    const encryptButtonHandler = async () => {

        const url = (process.env.NODE_ENV === 'production' ? "https" : "http") + "://"+baseUrl+"/en";
        const data = {
            "plaintext": message,
            "alices_public_key": alicePubKey
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
            setCapsule(JSON.stringify(response.data.capsule));
            setCypertext(JSON.stringify(response.data.cypertext));
            setError("");
        } catch (e) {
            setError(e.message);
        }

    };

    return (
        <div>
            <h2> Encryptor </h2>
            <p> Sender (Alice) </p>
            <InputGroup placeholder={"pubKey"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAlicePubKey(event.target.value)}
                        value={alicePubKey}
            />
            <br/>
            <p> Message (Bob) </p>
            <InputGroup placeholder={"message"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setMessage(event.target.value)}
                        value={message}
            />
            <br/>
            <br/>
            <Button intent={Intent.PRIMARY}
                    onClick={encryptButtonHandler}>encrypt</Button>
            <br/>
            {capsule && (<Text ellipsize={true}>{capsule}</Text>)}
            {cypertext && (<Text ellipsize={true}>{cypertext}</Text>)}
            {error && (<p style={{ color: "red" }}> error: {error}</p>)}
        </div>
    );
};