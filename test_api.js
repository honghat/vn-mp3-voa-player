import { ZingMp3 } from 'zingmp3-api-full-v2';

async function test() {
    try {
        console.log("Searching...");
        const search = await ZingMp3.search("Loi Nho");

        if (search && search.data && search.data.songs) {
            console.log("Found", search.data.songs.length, "songs");

            if (search.data.songs.length > 0) {
                const song = search.data.songs[0];
                console.log("\nFirst song:", song.title, "by", song.artistsNames);
                console.log("ID:", song.encodeId);

                console.log("\nFetching song info...");
                const songInfo = await ZingMp3.getSong(song.encodeId);
                console.log("Song info result:", JSON.stringify(songInfo, null, 2));
            }
        } else {
            console.log("No songs found");
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
