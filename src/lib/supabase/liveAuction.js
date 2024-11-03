import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ogjejkxixcnuqxvhpekh.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9namVqa3hpeGNudXF4dmhwZWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc1MjgyODQsImV4cCI6MjA0MzEwNDI4NH0.eOKTBFkCL-hJPmfUzKrhsZ-DgTOt6TK8vYVCaua8b8Q";
const supabase = createClient(supabaseUrl, supabaseKey);

export const processLiveAuction = async (auctionId, action, data) => {
  try {
    const table = "liveauctions";

    // Delete Action
    if (action === "delete") {
      const { data: deleteData, error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq("id", auctionId);

      if (deleteError)
        throw new Error(`Error deleting auction: ${deleteError.message}`);
      return { message: "Auction deleted", data: deleteData };
    }

    // Update Action
    if (action === "update") {
      const { data: updateData, error: updateError } = await supabase
        .from(table)
        .update(data)
        .eq("id", auctionId);

      if (updateError)
        throw new Error(`Error updating auction: ${updateError.message}`);
      return { message: "Auction updated", data: updateData };
    }

    // Create Action
    if (action === "create") {
      const { data: createData, error: createError } = await supabase
        .from(table)
        .insert([data]);

      if (createError)
        throw new Error(`Error creating auction: ${createError.message}`);
      return { message: "Auction created", data: createData };
    }
  } catch (error) {
    throw new Error(`Error processing auction: ${error.message}`);
  }
};

// Dummy Test Calls
(async () => {
  try {
    // 1. Create a New Auction
    const newAuctionData = {
      owneraddress: "owner_address_123",
      mintaddress: "mint_address_123",
      expirytime: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour from now
      createdat: new Date().toISOString(),
    };
    const createResult = await processLiveAuction(
      null,
      "create",
      newAuctionData
    );
    console.log("Create Result:", createResult);

    // Extract auction ID for further testing if creation was successful
    const auctionId = createResult.data[0]?.id;
    if (!auctionId) throw new Error("Auction ID not returned from creation.");

    // 2. Update the Auction
    const updateData = {
      owneraddress: "updated_owner_address_456",
      expirytime: new Date(Date.now() + 7200 * 1000).toISOString(), // 2 hours from now
    };
    const updateResult = await processLiveAuction(
      auctionId,
      "update",
      updateData
    );
    console.log("Update Result:", updateResult);

    // 3. Delete the Auction
    const deleteResult = await processLiveAuction(auctionId, "delete");
    console.log("Delete Result:", deleteResult);
  } catch (error) {
    console.error("Test Error:", error.message);
  }
})();
