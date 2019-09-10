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
    const [aliceVerKey, setAliceVerKey] = useState("021e9c962625e7218027270e9b4679bb9f08b31ab7fd8036d2b5eccbf7d48b419d");
    const [bobPrivKey, setBobPrivKey] =   useState("0xb6bb217955486f4cd9b2662fa909b0d4a207c8dae6f148be5e7ca94ed3fbdf0c");
    const [encryptedMessage, setEncryptedMessage] = useState("f2ad3e72ef02e7d840f7c3500c95657383ddf2533ea3c62a613ae17b0465f826c6a4c042ebe4310e");
    const [capsule, setCapsule] = useState("02dfa33bf628b9d0d5e23c964ac421355b8a43a810d0a3fb69a3605a3a11e929fa0222e93fe35ee012a38db7d28c6ed8cb7a65b58e745bb18c633c2342bf15a8d29877ee26a08c085eb4326b110e96560f44ac86764f83e28823eae3074eadca1d20");
    const [kfrags, setKfrags] = useState(["b96ed0d225f1a07af557a28660f385bbf66cc6fccfb1abfb287b5cf15abd2de4f605b3948db0697d88d2f6df6c83f5b570c5cecc2effa6958376c8dc11287353033f1b20dd40d2cbc78b75cec53e6c8e31ec2e04dd418ffd75fb6daa87d697729203404eea4b2b214588c7acfe461bd03a9565749be103c2c3efc5593fcea739356403675a0853aabe7cd131da79b3a3c3bb4fc887445327ffe828bdb4d89dd0dc7641f0e28a5c8a961c0e4cf73fcb5aa4b5e8befae854c50dbc9ae3060417363c1c77d814fa0ecea498261e4b6962589dbc832730da65b75bc8100cc34f217bc9cc8e4a07ecc7b1408e841d17c4514c350e196ba23fe5f2949ac5fecfe4e7dfbeac58",
        "a4cb7795c018f6e8a9f9e5b5eafa232bf26bc15c3e5a4559cb5e04ded287aa6b64b8244e13424e12fe0c55b89157acecb9120f4654af44d98dfe1690dea5bd490249929737866e262858064f4dc258c8657e73f8c08c18bab491fea82faa1ecb9d03404eea4b2b214588c7acfe461bd03a9565749be103c2c3efc5593fcea7393564035c79c48c3454d6559a697404b5eb65c1a60bdc2b2a9d8b00e53d36ca6a800faad0cf68cca8529101bd71f001625ff9e006b0990aa4ad243fd3b14e8f344b3f2472c6a6327e73e7d0ad519fc732f50aa2e46eed834bb8df2a1781bdcb52b09d01efcef5d8bd6260bdae2b621d5e58d967733952e71d9e80c4a9bceba4844ac0d4",
        "c896bb66f805c068cd6ac81b75be1b3506378dffe49210123371145eda192f56fa411c2c4e72c34b8b48067989fbf82f2d9607ca6c5d1f666d957390d898f45a02d5aaf2c807eea29f446e6bf1dbad263b25fbe2011ced6138bfe995bbae36b23703404eea4b2b214588c7acfe461bd03a9565749be103c2c3efc5593fcea7393564035eb27ba2170f2aed55174718904a8a08586d90702a5ea82fe139e74839b6cf53f17e05d5dc47d93d76cc72098d57a50c9a511a5e58b5ab0f9fd34524f3f12669ecde82371ea1feffaf1a04321f6ba99980ea17d93b86fff5197b15b789b4c632b3250603d8c9bc743905960ec9fa6b4b3e055c7c24fc38f3f9890a2d49c32a5f"]);
    
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
            {/*<InputGroup placeholder={"capsule"}*/}
            {/*            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setKfrags(event.target.value)}*/}
            {/*            value={kfrags}*/}
            {/*/>*/}

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