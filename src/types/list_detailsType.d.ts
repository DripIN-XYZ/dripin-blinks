export interface listDetailsType {
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
    nft:                 Nft;
    list_state:          string;
    currency_symbol:     string;
    created_at:          Date;
    receipt:             string;
    purchase_receipt:    string;
}

export interface Nft {
    name:                  string;
    symbol:                string;
    royalty:               number;
    image_uri:             string;
    cached_image_uri:      string;
    animation_url:         string;
    cached_animation_url:  string;
    metadata_uri:          string;
    description:           string;
    mint:                  string;
    owner:                 string;
    update_authority:      string;
    creators:              Creator[];
    collection:            Collection;
    attributes:            Attributes;
    attributes_array:      any[];
    files:                 File[];
    external_url:          string;
    is_loaded_metadata:    boolean;
    primary_sale_happened: boolean;
    is_mutable:            boolean;
    token_standard:        string;
    is_compressed:         boolean;
    merkle_tree:           string;
    is_burnt:              boolean;
}

export interface Attributes {
}

export interface Collection {
    address:  string;
    verified: boolean;
}

export interface Creator {
    address:  string;
    share:    number;
    verified: boolean;
}

export interface File {
    uri:  string;
    type: string;
}
