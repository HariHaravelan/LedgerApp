import { DetectedAccount } from "../../types/SMSTypes";
import SmsAndroid from 'react-native-get-sms-android';

// Types from the transaction parser
enum AccountType {
    CARD = "CARD",
    WALLET = "WALLET",
    ACCOUNT = "ACCOUNT",
}

interface AccountInfo {
    type: AccountType | null;
    number: string;
    name: string | null;
}

export class AccountDetector {
    // Combined bank and card patterns for detection
    private readonly PATTERNS = {
        // Bank name patterns
        banks: new Map([
            ['HDFC', 'HDFC Bank'],
            ['ICICI', 'ICICI Bank'],
            ['AXIS', 'Axis Bank'],
            ['IOB', 'Indian Overseas Bank'],
            ['SCB', 'Standard Chartered Bank'],
            ['AMEX', 'American Express'],
            ['SBI', 'State Bank of India']
        ]),

        // Words that need to be combined
        combinedWords: [
            {
                regex: /credit\scard/g,
                word: "c_card",
                type: AccountType.CARD
            },
            {
                regex: /amazon\spay/g,
                word: "amazon_pay",
                type: AccountType.WALLET
            },
            {
                regex: /uni\scard/g,
                word: "uni_card",
                type: AccountType.CARD
            },
            {
                regex: /slice\scard/g,
                word: "slice_card",
                type: AccountType.CARD
            },
            {
                regex: /one\s*card/g,
                word: "one_card",
                type: AccountType.CARD
            }
        ],

        // Digital wallets
        wallets: ["paytm", "simpl", "lazypay", "amazon_pay"]
    };

    private processMessage(messageBody: string): string[] {
        // Convert to lower case
        let message = messageBody.toLowerCase();
        
        // Clean up message
        message = message
            .replace(/!/g, "")
            .replace(/:/g, " ")
            .replace(/=/g, " ")
            .replace(/[{}]/g, " ")
            .replace(/\n/g, " ")
            .replace(/\r/g, " ")
            .replace(/ending /g, "")
            .replace(/x|[*]/g, "")
            .replace(/is /g, "")
            .replace(/with /g, "")
            .replace(/no. /g, "");

        // Replace account related terms
        message = message.replace(/\bac\b|\bacct\b|\baccount\b/g, "ac");
        
        // Handle amount formatting
        message = message
            .replace(/rs(?=\w)/g, "rs. ")
            .replace(/rs /g, "rs. ")
            .replace(/inr(?=\w)/g, "rs. ")
            .replace(/inr /g, "rs. ")
            .replace(/rs. /g, "rs.")
            .replace(/rs.(?=\w)/g, "rs. ");

        // Handle transaction words
        message = message
            .replace(/debited/g, " debited ")
            .replace(/credited/g, " credited ");

        // Combine special words
        for (const word of this.PATTERNS.combinedWords) {
            message = message.replace(word.regex, word.word);
        }

        return message.split(" ").filter(str => str !== "");
    }

    private extractAccountNumber(words: string[]): AccountInfo {
        const account: AccountInfo = {
            type: null,
            name: null,
            number: '',
        };

        // Look for card mentions first
        const cardIndex = words.findIndex(
            word => word === "card" || 
            this.PATTERNS.combinedWords
                .filter(w => w.type === AccountType.CARD)
                .some(w => {
                    if (w.word === word) {
                        account.name = w.word;
                        return true;
                    }
                    return false;
                })
        );

        if (cardIndex !== -1) {
            account.type = AccountType.CARD;
            if (cardIndex + 1 < words.length) {
                const possibleNumber = words[cardIndex + 1];
                if (!isNaN(Number(possibleNumber))) {
                    account.number = possibleNumber;
                }
            }
            return account;
        }

        // Look for account numbers
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (word === "ac" || word === "a\c") {
                if (i + 1 < words.length) {
                    const accountNo = this.trimSpecialChars(words[i + 1]);
                    if (!isNaN(Number(accountNo))) {
                        account.type = AccountType.ACCOUNT;
                        account.number = accountNo;
                        break;
                    }
                }
            } else if (word.includes("ac")) {
                const extractedNumber = this.extractBondedAccountNo(word);
                if (extractedNumber) {
                    account.type = AccountType.ACCOUNT;
                    account.number = extractedNumber;
                    break;
                }
            }
        }

        // Check for wallets if no account found
        if (!account.type) {
            const wallet = words.find(word => this.PATTERNS.wallets.includes(word));
            if (wallet) {
                account.type = AccountType.WALLET;
                account.name = wallet;
            }
        }

        // Extract last 4 digits of account number if longer
        if (account.number && account.number.length > 4) {
            account.number = account.number.slice(-4);
        }

        return account;
    }

    private trimSpecialChars(str: string): string {
        const [first, last] = [str[0], str[str.length - 1]];
        let finalStr = isNaN(Number(last)) ? str.slice(0, -1) : str;
        finalStr = isNaN(Number(first)) ? finalStr.slice(1) : finalStr;
        return finalStr;
    }

    private extractBondedAccountNo(accountNo: string): string {
        const strippedAccountNo = accountNo.replace("ac", "");
        return isNaN(Number(strippedAccountNo)) ? "" : strippedAccountNo;
    }

    async detectFromMessages(filter: any): Promise<DetectedAccount[]> {
        return new Promise((resolve, reject) => {
            SmsAndroid.list(
                JSON.stringify(filter),
                (error: any) => reject(error),
                (_count: number, messages: string) => {
                    try {
                        const parsedMessages = JSON.parse(messages);
                        const accountsMap = new Map<string, DetectedAccount>();

                        parsedMessages.forEach((sms: any) => {
                            const sender = sms.address?.toUpperCase() || '';
                            
                            // First determine bank from sender
                            const bankName = this.PATTERNS.banks.get(
                                Array.from(this.PATTERNS.banks.keys())
                                    .find(code => sender.includes(code)) || ''
                            );
                            
                            if (!bankName) return;

                            // Process and extract account info
                            const words = this.processMessage(sms.body);
                            const accountInfo = this.extractAccountNumber(words);
                            
                            if (!accountInfo.number && !accountInfo.name) return;

                            const id = accountInfo.number ? 
                                `${bankName.toLowerCase().replace(/\s+/g, '-')}-${accountInfo.number}` :
                                `${bankName.toLowerCase().replace(/\s+/g, '-')}-${accountInfo.name}`;

                            const account: DetectedAccount = {
                                id,
                                institution: bankName,
                                accountNumber: accountInfo.number,
                                type: accountInfo.type?.toLowerCase() || 'savings',
                                lastTransaction: new Date(parseInt(sms.date)),
                                senderIds: new Set([sender])
                            };

                            // Update or add account to map
                            const existing = accountsMap.get(account.id);
                            if (existing && existing.lastTransaction > account.lastTransaction) {
                                existing.senderIds.add(sender);
                            } else {
                                accountsMap.set(account.id, account);
                            }
                        });

                        // Sort accounts by last transaction date
                        const accounts = Array.from(accountsMap.values())
                            .sort((a, b) => b.lastTransaction.getTime() - a.lastTransaction.getTime());

                        resolve(accounts);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }
}