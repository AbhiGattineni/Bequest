import React, { useEffect, useState } from "react";
import sha256 from 'crypto-js/sha256';

const API_URL = "http://localhost:8080";

interface DataSignature {
  data: string;
  hash: string;
}

function App() {
  const [data, setData] = useState<string>();
  const [dataSignature, setDataSignature] = useState<DataSignature | null>(null);
  const [isDataIntact, setIsDataIntact] = useState<boolean>(false);
  const [verify, setVerify] = useState<boolean>(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await fetch(API_URL);
      const signature: DataSignature = await response.json();
      setDataSignature(signature);
      setIsDataIntact(verifyDataIntegrity(signature.data, signature.hash));
      setData(signature.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const verifyDataIntegrity = (data: string, hash: string): boolean => {
    const clientHash = sha256(data).toString();
    return clientHash === hash;
  }

  const updateData = async () => {
    const hashedData = sha256(data).toString();
    setVerify(false);
  
    await fetch(API_URL, {
      method: 'PUT',
      body: JSON.stringify({ originalData: data, hashedData }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  
    await getData();
  };

  const verifyData = async () => {
    getData();
    setVerify(true);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
      </div>
      <div>
    {verify && (
      <div style={{ fontSize: "20px" }}>
        Data Integrity Check: {isDataIntact ? 'Passed' : 'Failed'}
      </div>
    )}
    {verify && dataSignature && (
      <div style={{ fontSize: "20px" }}>
        Data: {dataSignature.data} <br />
        Hash: {dataSignature.hash}
      </div>
    )}
  </div>
    </div>
  );
}

export default App;
