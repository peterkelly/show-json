// Copyright 2017 Peter Kelly <peter@pmkelly.net>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/// <reference types="node" />

import { readDataFromStream } from "./io";
import { table } from "./table";
import { isObject } from "./util";

function getPath(obj: any, path: string) {
    const components = path.split(".");
    for (const component of components) {
        if (!isObject(obj))
            return;
        obj = obj[component];
    }
    return obj;
}

function makeRows(fields: string[], data: any[]): any[] {
    const rows: any[] = [];
    for (const element of data) {
        const row: string[] = [];
        for (const field of fields) {
            const value = getPath(element, field);
            if (value != null)
                row.push(value);
            else
                row.push("");
        }
        rows.push(row);
    }
    return rows;
}

function getAllPaths(roots: any[]): string[] {
    const paths = new Set<string>();
    for (const root of roots)
        recurse(root, "");
    return Array.from(paths.values()).sort();

    function recurse(obj: any, path: string): void {
        if (!isObject(obj)) {
            paths.add(path);
            return;
        }
        for (const key of Object.keys(obj)) {
            const childPath = (path.length === 0) ? key : (path + "." + key);
            recurse(obj[key], childPath);
        }
    }
}

interface Column {
    path: string;
    title: string;
}

function printUsageAndExit(): void {
    console.log("Usage: show-json [options]");
    console.log("");
    console.log("Options:");
    console.log("    -c, --columns       Columns to display");
    console.log("    -h, --help          Print usage");
    process.exit(1);
}

function parseColspec(colspec: string): Column[] {
    const columns: Column[] = [];
    for (const spec of colspec.split(",").map(s => s.trim())) {
        let path: string;
        let title: string;

        const match = spec.match(/^(.*) +as +(.*)$/);
        if (match) {
            path = match[1];
            title = match[2];

            if (title.match(/^"/))
                title = JSON.parse(title);
        }
        else {
            path = spec;
            title = spec;
        }

        const column: Column = {
            path: path,
            title: title,
        };
        columns.push(column);
    }
    return columns;
}

async function main(): Promise<void> {
    const argv = process.argv;
    const argc = argv.length;
    let colspec: string | null = null;
    for (let argno = 2; argno < argc; argno++) {
        const name = argv[argno];
        switch (name) {
            case "-h":
            case "--help": {
                printUsageAndExit();
                break;
            }
            case "-c":
            case "--columns": {
                argno++;
                if (argno >= argc)
                    printUsageAndExit();
                colspec = argv[argno];
                break;
            }
            default:
                printUsageAndExit();
                break;
        }
    }


    const buf = await readDataFromStream(process.stdin);
    const data = JSON.parse(buf.toString());

    if (!(data instanceof Array))
        throw new Error("Expected an array");

    let columns: Column[];
    if (colspec !== null) {
        columns = parseColspec(colspec);
    }
    else {
        const paths = getAllPaths(data);
        columns = paths.map(p => ({
            path: p,
            title: p.toUpperCase(),
        }));
    }

    const colPaths = columns.map(c => c.path);
    const colTitles = columns.map(c => c.title);
    console.log(table(colTitles, makeRows(colPaths, data)));
}

// Avoid output truncation
(<any> process.stdout)._handle.setBlocking(true);
(<any> process.stderr)._handle.setBlocking(true);

main().then(() => {
    process.exit(0);
}).catch((error) => {
    console.error("" + error);
    process.exit(1);
});
