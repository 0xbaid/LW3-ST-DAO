import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect, useRef } from "react";
import {
  CRYPTODEVS_DAO_ABI,
  CRYPTODEVS_DAO_CONTRACT_ADDRESS,
  CRYPTODEVS_NFT_ABI,
  CRYPTODEVS_NFT_CONTRACT_ADDRESS,
} from "../constants";

export default function Home() {
  const [treasuryBalance, setTreasuryBalance] = useState("0"); // ETH Balance of the DAO contrac
  const [numProposal, setNumProposals] = useState("0");
  const [proposals, setProposals] = useState([]);
  const [nftBalance, setNftBalance] = useState(0);
  const [fakeNftTokenId, setFakeNftTokenId] = useState(""); // Fake NFT Token ID to purchase. Used when creating a proposal.
  const [selectedTab, setSelectedTab] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();

  const createProposal = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const daoContract = await getDaoContractInstance(signer);
      const tx = await daoContract.createProposal(fakeNftTokenId);
      setLoading(true);
      tx.wait();
      await getNumProposalInDao();
      setLoading(false);
    } catch (error) {
      window.alert(error.data.message);
    }
  };

  const fetchAllProposals = async () => {
    try {
      const proposals = [];
      for (let i = 0; i < numProposals; i++) {
        const proposal = await fetchProposalById(i);
        proposals.push(proposal);
      }
      setProposals(proposals);
      return proposals;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProposalById = async (id) => {
    try {
      const provider = await getProviderOrSigner();
      const daoContract = await getDaoContractInstance(provider);
      const proposal = await daoContract.proposals(id);
      const parsedProposal = {
        proposalId: id,
        nftTokenId: proposal.nftTokenId.toString(),
        deadline: new Date(parseInt(proposal.deadline.toString()) * 1000),
        yayVotes: proposal.yayVotes.toString(),
        nayVotes: proposal.nayVotes.toString(),
        executed: proposal.executed,
      };
      return parsedProposal;
    } catch (error) {
      console.error(error);
    }
  };

  const getDaoTreasuryBalance = async () => {
    try {
      const provider = await getProviderOrSigner();
      const balance = await provider.getBalance(
        CRYPTODEVS_DAO_CONTRACT_ADDRESS
      );
      setTreasuryBalance(balance.toString());
    } catch (error) {
      console.error(error);
    }
  };

  const getNumProposalInDao = async () => {
    try {
      const provider = await getProviderOrSigner();
      const contract = await getDaoContractInstance(provider);
      const numProposals = await contract.numProposals();
      setNumProposals(numProposals.toString());
    } catch (error) {
      console.error(error);
    }
  };

  const getUserNftBalance = async () => {
    const signer = await getProviderOrSigner();
    const nftContract = getNftContractInstance(signer);
    const balance = await nftContract.balanceOf(signer.getAddress());
    setNftBalance(parseInt(balance.toString()));
  };

  const getDaoContractInstance = (providerOrSigner) => {
    return new Contract(
      CRYPTODEVS_DAO_CONTRACT_ADDRESS,
      CRYPTODEVS_DAO_ABI,
      providerOrSigner
    );
  };

  const getNftContractInstance = (providerOrSigner) => {
    return new Contract(
      CRYPTODEVS_NFT_CONTRACT_ADDRESS,
      CRYPTODEVS_NFT_ABI,
      providerOrSigner
    );
  };

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== 5) {
      window.alert("Please switch to the Georli network!");
      throw new Error("Please switch to the Georli network");
    }
    if (needSigner) {
      const signer = web3Provider.signer();
      return signer;
    }
    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  return <div>Hello</div>;
}
