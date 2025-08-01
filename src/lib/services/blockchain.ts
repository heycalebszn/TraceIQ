import axios from 'axios';
import { ethers } from 'ethers';
import { BlockchainTransaction, BitcoinTransaction, AddressRiskData } from '@/types';

export class BlockchainService {
  private etherscanApiKey: string;
  private alchemyApiKey: string;
  private infuraProjectId: string;
  private oklinkApiKey: string;
  private bscscanApiKey: string;

  constructor() {
    this.etherscanApiKey = process.env.ETHERSCAN_API_KEY || '';
    this.alchemyApiKey = process.env.ALCHEMY_API_KEY || '';
    this.infuraProjectId = process.env.INFURA_PROJECT_ID || '';
    this.oklinkApiKey = process.env.OKLINK_API_KEY || '';
    this.bscscanApiKey = process.env.BSCSCAN_API_KEY || '';
  }

  async getTransactionData(txHash: string, network: string = 'ethereum'): Promise<BlockchainTransaction | null> {
    try {
      switch (network.toLowerCase()) {
        case 'ethereum':
        case 'eth':
          return await this.getEthereumTransaction(txHash);
        case 'bitcoin':
        case 'btc':
          return await this.getBitcoinTransaction(txHash);
        case 'bsc':
        case 'binance':
          return await this.getBSCTransaction(txHash);
        default:
          return await this.getEthereumTransaction(txHash);
      }
    } catch (error) {
      console.error(`Error fetching transaction data for ${txHash}:`, error);
      return null;
    }
  }

  private async getEthereumTransaction(txHash: string): Promise<BlockchainTransaction | null> {
    try {
      // First try Etherscan API
      if (this.etherscanApiKey) {
        const response = await axios.get(
          `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${this.etherscanApiKey}`
        );

        if (response.data.result) {
          const tx = response.data.result;
          
          // Get transaction receipt for gas used
          const receiptResponse = await axios.get(
            `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${this.etherscanApiKey}`
          );

          const receipt = receiptResponse.data.result;

          return {
            hash: tx.hash,
            blockNumber: parseInt(tx.blockNumber, 16),
            from: tx.from,
            to: tx.to || '',
            value: ethers.formatEther(tx.value),
            gas: parseInt(tx.gas, 16).toString(),
            gasPrice: ethers.formatUnits(tx.gasPrice, 'gwei'),
            gasUsed: receipt ? parseInt(receipt.gasUsed, 16).toString() : '0',
            timestamp: Date.now(), // We'd need to get block data for actual timestamp
            input: tx.input,
            status: receipt ? (receipt.status === '0x1' ? 'success' : 'failed') : 'pending',
            network: 'ethereum'
          };
        }
      }

      // Fallback to Alchemy or Infura
      if (this.alchemyApiKey) {
        const provider = new ethers.AlchemyProvider('mainnet', this.alchemyApiKey);
        const tx = await provider.getTransaction(txHash);
        const receipt = await provider.getTransactionReceipt(txHash);

        if (tx) {
          return {
            hash: tx.hash,
            blockNumber: tx.blockNumber || 0,
            from: tx.from,
            to: tx.to || '',
            value: ethers.formatEther(tx.value),
            gas: tx.gasLimit.toString(),
            gasPrice: tx.gasPrice ? ethers.formatUnits(tx.gasPrice, 'gwei') : '0',
            gasUsed: receipt ? receipt.gasUsed.toString() : '0',
            timestamp: Date.now(),
            input: tx.data,
            status: receipt ? (receipt.status === 1 ? 'success' : 'failed') : 'pending',
            network: 'ethereum'
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error fetching Ethereum transaction:', error);
      return null;
    }
  }

  private async getBitcoinTransaction(txHash: string): Promise<BlockchainTransaction | null> {
    try {
      // Using a public Bitcoin API (you might want to use a more reliable service)
      const response = await axios.get(`https://blockstream.info/api/tx/${txHash}`);
      const tx: BitcoinTransaction = response.data;

      if (tx) {
        const outputValue = tx.vout.reduce((sum: number, output) => sum + output.value, 0);

        return {
          hash: tx.txid,
          blockNumber: tx.status?.block_height || 0,
          from: tx.vin[0]?.prevout?.scriptpubkey_address || 'Unknown',
          to: tx.vout[0]?.scriptpubkey_address || 'Unknown',
          value: (outputValue / 100000000).toString(), // Convert satoshis to BTC
          gas: '0',
          gasPrice: '0',
          gasUsed: tx.fee?.toString() || '0',
          timestamp: tx.status?.block_time ? tx.status.block_time * 1000 : Date.now(),
          input: '',
          status: tx.status?.confirmed ? 'success' : 'pending',
          network: 'bitcoin'
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching Bitcoin transaction:', error);
      return null;
    }
  }

  private async getBSCTransaction(txHash: string): Promise<BlockchainTransaction | null> {
    try {
      const response = await axios.get(
        `https://api.bscscan.com/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${this.bscscanApiKey}`
      );

      if (response.data.result) {
        const tx = response.data.result;
        
        const receiptResponse = await axios.get(
          `https://api.bscscan.com/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${this.bscscanApiKey}`
        );

        const receipt = receiptResponse.data.result;

        return {
          hash: tx.hash,
          blockNumber: parseInt(tx.blockNumber, 16),
          from: tx.from,
          to: tx.to || '',
          value: ethers.formatEther(tx.value),
          gas: parseInt(tx.gas, 16).toString(),
          gasPrice: ethers.formatUnits(tx.gasPrice, 'gwei'),
          gasUsed: receipt ? parseInt(receipt.gasUsed, 16).toString() : '0',
          timestamp: Date.now(),
          input: tx.input,
          status: receipt ? (receipt.status === '0x1' ? 'success' : 'failed') : 'pending',
          network: 'bsc'
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching BSC transaction:', error);
      return null;
    }
  }

  async getAddressRiskAnalysis(address: string, network: string = 'ethereum'): Promise<AddressRiskData | null> {
    try {
      if (!this.oklinkApiKey) {
        console.warn('OKLink API key not configured');
        return null;
      }

      const networkMap: { [key: string]: string } = {
        'ethereum': 'ETH',
        'bitcoin': 'BTC',
        'bsc': 'BSC'
      };

      const oklinkNetwork = networkMap[network.toLowerCase()] || 'ETH';

      const response = await axios.get(
        `https://www.oklink.com/api/v5/tracker/kya/address-risk-level?network=${oklinkNetwork}&address=${address}`,
        {
          headers: {
            'Ok-Access-Key': this.oklinkApiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching address risk analysis:', error);
      return null;
    }
  }

  async traceTransactionPath(txHash: string, network: string = 'ethereum', maxDepth: number = 5): Promise<BlockchainTransaction[]> {
    try {
      const visitedTxs = new Set<string>();
      const path: BlockchainTransaction[] = [];
      
      // Start with the initial transaction
      const initialTx = await this.getTransactionData(txHash, network);
      if (!initialTx) return [];
      
      await this.traceRecursive(initialTx, network, path, visitedTxs, 0, maxDepth);
      
      return path;
    } catch (error) {
      console.error('Error tracing transaction path:', error);
      return [];
    }
  }

  private async traceRecursive(
    transaction: BlockchainTransaction,
    network: string,
    path: BlockchainTransaction[],
    visited: Set<string>,
    depth: number,
    maxDepth: number
  ): Promise<void> {
    if (depth >= maxDepth || visited.has(transaction.hash)) {
      return;
    }

    visited.add(transaction.hash);
    path.push(transaction);

    try {
      // For Ethereum-like networks, analyze input/output transactions
      if (network === 'ethereum' || network === 'bsc' || network === 'polygon') {
        await this.traceEthereumPath(transaction, network, path, visited, depth, maxDepth);
      } else if (network === 'bitcoin') {
        await this.traceBitcoinPath(transaction, network, path, visited, depth, maxDepth);
      }
    } catch (error) {
      console.error(`Error tracing at depth ${depth}:`, error);
    }
  }

  private async traceEthereumPath(
    transaction: BlockchainTransaction,
    network: string,
    path: BlockchainTransaction[],
    visited: Set<string>,
    depth: number,
    maxDepth: number
  ): Promise<void> {
    try {
      // Get transactions from the 'from' address in the same block or nearby blocks
      const blockRange = 5; // Check 5 blocks before and after
      const relatedTxs = await this.getRelatedTransactions(
        transaction.from,
        transaction.blockNumber,
        blockRange,
        network
      );

      // Also check 'to' address for potential incoming transactions
      const toRelatedTxs = await this.getRelatedTransactions(
        transaction.to,
        transaction.blockNumber,
        blockRange,
        network
      );

      const allRelated = [...relatedTxs, ...toRelatedTxs];

      // Filter for transactions that might be part of a chain
      const chainedTxs = allRelated.filter(tx => 
        tx.hash !== transaction.hash && 
        !visited.has(tx.hash) &&
        this.isLikelyChained(transaction, tx)
      );

      // Sort by likelihood of being in the path (timestamp, value patterns, etc.)
      chainedTxs.sort((a, b) => this.calculatePathLikelihood(transaction, b) - this.calculatePathLikelihood(transaction, a));

      // Recursively trace the most likely connected transactions (limit to top 3 to avoid explosion)
      for (const chainedTx of chainedTxs.slice(0, 3)) {
        await this.traceRecursive(chainedTx, network, path, visited, depth + 1, maxDepth);
      }
    } catch (error) {
      console.error('Error tracing Ethereum path:', error);
    }
  }

  private async traceBitcoinPath(
    transaction: BlockchainTransaction,
    network: string,
    path: BlockchainTransaction[],
    visited: Set<string>,
    depth: number,
    maxDepth: number
  ): Promise<void> {
    try {
      // For Bitcoin, we need to look at UTXO chains
      // This is a simplified implementation - in practice you'd need full UTXO analysis
      const response = await axios.get(`https://blockstream.info/api/address/${transaction.to}/txs`);
      const addressTxs = response.data;

      const relatedTxs: BlockchainTransaction[] = [];
              for (const tx of (addressTxs as Record<string, unknown>[]).slice(0, 10)) { // Limit to recent 10 transactions
          if ((tx.txid as string) !== transaction.hash && !visited.has(tx.txid as string)) {
          const convertedTx = await this.convertBitcoinTx(tx);
          if (convertedTx) {
            relatedTxs.push(convertedTx);
          }
        }
      }

      // Follow the most recent transactions that could be in the path
      for (const relatedTx of relatedTxs.slice(0, 2)) {
        await this.traceRecursive(relatedTx, network, path, visited, depth + 1, maxDepth);
      }
    } catch (error) {
      console.error('Error tracing Bitcoin path:', error);
    }
  }

  private async getRelatedTransactions(
    address: string,
    blockNumber: number,
    blockRange: number,
    network: string
  ): Promise<BlockchainTransaction[]> {
    const transactions: BlockchainTransaction[] = [];
    
    try {
      if (network === 'ethereum' && this.etherscanApiKey) {
        // Get transactions for the address around the block range
        const response = await axios.get(
          `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${Math.max(0, blockNumber - blockRange)}&endblock=${blockNumber + blockRange}&sort=desc&apikey=${this.etherscanApiKey}`
        );

        if (response.data.result) {
          for (const tx of response.data.result.slice(0, 20)) { // Limit to 20 transactions
            transactions.push({
              hash: tx.hash,
              blockNumber: parseInt(tx.blockNumber),
              from: tx.from,
              to: tx.to || '',
              value: ethers.formatEther(tx.value),
              gas: tx.gas,
              gasPrice: ethers.formatUnits(tx.gasPrice, 'gwei'),
              gasUsed: tx.gasUsed,
              timestamp: parseInt(tx.timeStamp) * 1000,
              input: tx.input,
              status: tx.isError === '0' ? 'success' : 'failed',
              network: network
            });
          }
        }
      }
    } catch (error) {
      console.error('Error getting related transactions:', error);
    }

    return transactions;
  }

  private isLikelyChained(baseTx: BlockchainTransaction, candidateTx: BlockchainTransaction): boolean {
    // Check if transactions are likely to be in a chain based on:
    // 1. Address connections (output of one becomes input of another)
    // 2. Timing (within reasonable time window)
    // 3. Value patterns (partial or full value transfers)
    
    const addressConnected = baseTx.to === candidateTx.from || baseTx.from === candidateTx.to;
    const timeWindow = Math.abs(baseTx.timestamp - candidateTx.timestamp) < 3600000; // 1 hour window
    const valueRelated = this.isValueRelated(baseTx.value, candidateTx.value);
    
    return addressConnected && timeWindow && valueRelated;
  }

  private isValueRelated(value1: string, value2: string): boolean {
    try {
      const val1 = parseFloat(value1);
      const val2 = parseFloat(value2);
      
      // Check if values are related (within 20% difference or one is subset of other)
      const ratio = val1 > 0 ? val2 / val1 : 0;
      return ratio > 0.1 && ratio < 10; // Allow for fees and partial transfers
    } catch {
      return false;
    }
  }

  private calculatePathLikelihood(baseTx: BlockchainTransaction, candidateTx: BlockchainTransaction): number {
    let score = 0;
    
    // Higher score for direct address connections
    if (baseTx.to === candidateTx.from) score += 50;
    if (baseTx.from === candidateTx.to) score += 30;
    
    // Score based on timing (closer in time = higher score)
    const timeDiff = Math.abs(baseTx.timestamp - candidateTx.timestamp);
    const timeScore = Math.max(0, 20 - (timeDiff / 60000)); // 20 points max, decreasing by minute
    score += timeScore;
    
    // Score based on value relationship
    const val1 = parseFloat(baseTx.value);
    const val2 = parseFloat(candidateTx.value);
    if (val1 > 0 && val2 > 0) {
      const ratio = Math.min(val1, val2) / Math.max(val1, val2);
      score += ratio * 10; // Up to 10 points for value similarity
    }
    
    return score;
  }

  private async convertBitcoinTx(btcTx: Record<string, unknown>): Promise<BlockchainTransaction | null> {
    try {
      const outputValue = (btcTx.vout as Array<{value: number}>).reduce((sum: number, output: {value: number}) => sum + output.value, 0);
      
              const status = btcTx.status as {block_height?: number; block_time?: number; confirmed?: boolean} | undefined;
        const vin = btcTx.vin as Array<{prevout?: {scriptpubkey_address?: string}}> | undefined;
        const vout = btcTx.vout as Array<{scriptpubkey_address?: string}> | undefined;
        const fee = btcTx.fee as number | undefined;
        
        return {
          hash: btcTx.txid as string,
          blockNumber: status?.block_height || 0,
          from: vin?.[0]?.prevout?.scriptpubkey_address || 'Unknown',
          to: vout?.[0]?.scriptpubkey_address || 'Unknown',
          value: (outputValue / 100000000).toString(), // Convert satoshis to BTC
          gas: '0',
          gasPrice: '0',
          gasUsed: fee?.toString() || '0',
          timestamp: status?.block_time ? status.block_time * 1000 : Date.now(),
          input: '',
          status: status?.confirmed ? 'success' : 'pending',
          network: 'bitcoin'
        };
    } catch {
      return null;
    }
  }
}