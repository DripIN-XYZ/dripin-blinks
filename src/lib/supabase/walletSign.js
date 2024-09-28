import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const processWalletSignin = async (wallet_address, action) => {
    try {
        const { data: existingWallet, error: checkError } = await supabase
            .from('wallet_signins')
            .select('*')
            .eq('wallet_address', wallet_address)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            throw new Error(`Error checking wallet address: ${checkError.message}`);
        }

        if (action === 'delete') {
            if (!existingWallet) {
                return { message: 'Wallet address not found for deletion' };
            }
            const { data: deleteData, error: deleteError } = await supabase
                .from('wallet_signins')
                .delete()
                .eq('wallet_address', wallet_address);

            if (deleteError) {
                throw new Error(`Error deleting wallet signin: ${deleteError.message}`);
            }
            return { message: 'Wallet address deleted', data: deleteData };
        } else {
            if (existingWallet) {
                // Update existing wallet sign-in
                const { data: updateData, error: updateError } = await supabase
                    .from('wallet_signins')
                    .update({
                        number_of_signins: existingWallet.number_of_signins + 1,
                        last_signin: new Date().toISOString(),
                    })
                    .eq('wallet_address', wallet_address);

                if (updateError) {
                    throw new Error(`Error updating wallet signin: ${updateError.message}`);
                }

                return { message: 'Wallet sign-in updated', data: updateData };
            } else {
                // Create new wallet sign-in
                const { data: createData, error: createError } = await supabase
                    .from('wallet_signins')
                    .insert([
                        { wallet_address, number_of_signins: 1, last_signin: new Date().toISOString() }
                    ]);

                if (createError) {
                    throw new Error(`Error creating wallet signin: ${createError.message}`);
                }

                return { message: 'Wallet sign-in created', data: createData };
            }
        }
    } catch (error) {
        throw new Error(`Error processing wallet signin: ${error.message}`);
    }
};