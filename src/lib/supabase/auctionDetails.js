import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const processAuctionDetail = async (wallet_address, action, auctionData = {}) => {
    try {
        if (action === 'delete') {
            // Directly attempt to delete the entry
            const { data: deleteData, error: deleteError } = await supabase
                .from('auctionDetails')
                .delete()
                .eq('wallet_address', wallet_address);

            if (deleteError) {
                throw new Error(`Error deleting auction entry: ${deleteError.message}`);
            }
            return { message: 'Auction entry deleted', data: deleteData };
        } else if (action === 'insert') {
            // Directly insert the new auction detail entry
            const { data: insertData, error: insertError } = await supabase
                .from('auctionDetails')
                .insert([{
                    wallet_address,
                    lamports: auctionData.lamports,
                    mint_address: auctionData.mint_address,
                    expiry_time: auctionData.expiry_time,
                }]);

            if (insertError) {
                throw new Error(`Error creating auction entry: ${insertError.message}`);
            }
            return { message: 'Auction entry created', data: insertData };
        } else {
            throw new Error('Invalid action specified');
        }
    } catch (error) {
        throw new Error(`Error processing auction detail: ${error.message}`);
    }
};

export const getAuctionDetail = async (mint_address, wallet_address) => {
    try {
        const { data, error } = await supabase
            .from('auctionDetails')
            .select('*')
            .eq('mint_address', mint_address)
            .eq('wallet_address', wallet_address);

        if (error) {
            throw new Error(`Error fetching auction detail: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};
