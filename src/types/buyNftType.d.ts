export interface buyNftType {
    success: boolean;
    message: string;
    result:  Result;
}

export interface Result {
    network:             string;
    marketplace_address: string;
    seller_address:      string;
    price:               number;
    nft_address:         string;
    purchase_receipt:    string;
    currecy_symbol:      string;
    buyer_address:       string;
    encoded_transaction: string;
    transaction_version: string;
    signers:             string[];
}
