import data from "./data.json";
import { execa, ExecaError } from "execa";
import { appendAsync } from "fs-jetpack";

async function main() {
  console.log(`starting to download ${data.length} songs...`);
  let success = 0;
  let failure = 0;
  for await (let link of data) {
    try {
      const { stdout: stdoutName, stderr: stderrName } = await execa("yt-dlp", [
        link,
        "-f",
        "ba[ext=m4a]",
      ]);
      console.log(stdoutName);
      success++;
    } catch (error: unknown) {
      failure++;
      if (error instanceof ExecaError) {
        const message = `${link}
                    message: ${error.message}
                    \n\n
                    `;
        console.log(message);
        await appendAsync("./errors.txt", message);
      }
    }
  }
  console.log(
    `######## Finished Downloading: Success count: ${success}; Failed: ${failure}`,
  );
}

main();
