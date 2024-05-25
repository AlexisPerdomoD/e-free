import { Command } from "commander";

const commands = new Command()

    commands
        .requiredOption("--mode <mode>", "mode of work <dev> || <pro>", "mode is need to start")
        .option("-P <port>", "optional port", false)

    commands.parse()

export default commands