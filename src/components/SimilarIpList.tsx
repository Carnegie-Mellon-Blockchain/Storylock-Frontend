// src/components/SimilarIpList.tsx
import React from "react";
import { IPayload } from "@/types/IPayload";

interface SimilarIpListProps {
  similarIp: IPayload[];
}

const SimilarIpList: React.FC<SimilarIpListProps> = ({ similarIp }) => {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-center">Similar IPs Found</h3>
      <table className="w-full">
        <tbody>
          {similarIp.map((ip, index) => (
            <tr key={index} className="bg-gray-800 border-b border-gray-700">
              <td className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={ip.image}
                    alt="IP Image"
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{ip.title}</h4>
                    <p className="text-gray-400 text-sm">
                      {ip.author} •{" "}
                      {new Date(ip.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </td>
              <td className="p-4 text-right">
                <div className="flex gap-2 justify-end">
                  <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm">
                    {ip.type}
                  </span>
                  <a
                    href={ip.ipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition duration-200"
                  >
                    View
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimilarIpList;
