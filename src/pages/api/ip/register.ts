// src/pages/api/ip/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { IpMetadata } from "@story-protocol/core-sdk";
import { mintNFT } from "../../../utils/mintNFT";
import { NFTContractAddress, account, client } from "../../../utils/utils";
import { uploadJSONToIPFS } from "../../../utils/uploadToIpfs";
import { createHash } from "crypto";

export const maxDuration = 150;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { image, metadata } = req.body;

    if (!image || !metadata) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1. Set up IP Metadata
    const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata({
      title: metadata.title || "Untitled",
      description: metadata.description || "",
      attributes: Object.entries(metadata).map(([key, value]) => ({
        key,
        value: String(value),
      })),
    });

    // 2. Set up NFT Metadata
    const nftMetadata = {
      name: metadata.title || "Untitled",
      description: metadata.description || "",
      image: image,
    };

    // 3. Upload metadata to IPFS
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
    const ipHash = createHash("sha256")
      .update(JSON.stringify(ipMetadata))
      .digest("hex");
    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
    const nftHash = createHash("sha256")
      .update(JSON.stringify(nftMetadata))
      .digest("hex");

    // 4. Mint NFT
    const tokenId = await mintNFT(
      account.address,
      `https://ipfs.io/ipfs/${nftIpfsHash}`
    );

    // 5. Register IP Asset
    const response = await client.ipAsset.register({
      nftContract: NFTContractAddress,
      tokenId: tokenId!,
      ipMetadata: {
        ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
        ipMetadataHash: `0x${ipHash}`,
        nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
        nftMetadataHash: `0x${nftHash}`,
      },
      txOptions: { waitForTransaction: true },
    });

    if (!response.ipId) {
      return res.status(500).json({ message: "Failed to create IPA" });
    }

    const imageResponse = await fetch(image);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");

    // Register IP with external service
    const formData = new URLSearchParams();

    formData.append("filedata", base64Image);

    const dataPayload = {
      ...metadata,
      ipId: response.ipId,
      txHash: response.txHash,
      ipUrl: `https://explorer.story.foundation/ipa/${response.ipId}`,
      ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
      nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
      ipMetadataHash: `0x${ipHash}`,
      nftMetadataHash: `0x${nftHash}`,
      tokenId: tokenId!,
    };
    formData.append("payload", JSON.stringify(dataPayload));

    const registerResponse = await fetch(
      "http://skynet88-supermario.andrew.cmu.edu:8000/api/register_ip",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
        body: formData,
      }
    );

    return res.status(200).json({
      success: true,
      ipId: response.ipId,
      txHash: response.txHash,
      tokenId: tokenId,
      explorerUrl: `https://explorer.story.foundation/ipa/${response.ipId}`,
      ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
      nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
      ipMetadataHash: `0x${ipHash}`,
      nftMetadataHash: `0x${nftHash}`,
    });
  } catch (error) {
    console.error("Error registering IP:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
}
